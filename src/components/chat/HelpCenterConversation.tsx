import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { BookOpen, Bot, ChevronLeft, Send, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useGlobalData, type GlobalCategory, type GlobalCourse } from "@/contexts/GlobalDataContext";
import { tHelp } from "@/lib/helpCenterCopy";
import { isSupportedLocale } from "@/lib/i18n/constants";
import { formatChatMessageTime } from "@/lib/utils/formatChatMessageTime";
import {
  getChatBotResponse,
  getChatHistory,
  type ChatHistoryRow,
} from "@/lib/utils/api/chat";
import { getLocalizedCategories } from "@/lib/utils/api/categories";
import { getCourseShortInfoForChat, getLocalizedCourses } from "@/lib/utils/api/courses";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  time: string;
  /** Serverdəki cütün id-si (tarixçə + dublikatın qarşısını almaq üçün). */
  serverTurnId?: number;
};

const newLocalId = () => `l-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/** Dil seçilməyibsə chat API bu dildə işləyir (VITE_DEFAULT_LANG və ya az). */
const DEFAULT_CHAT_LANG = import.meta.env.VITE_DEFAULT_LANG ?? "az";

function mapHistoryRow(row: ChatHistoryRow): Message[] {
  const time =
    formatChatMessageTime(row.createdAt) ||
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return [
    {
      id: `h-${row.id}-u`,
      sender: "user",
      text: row.userMessage,
      time,
      serverTurnId: row.id,
    },
    {
      id: `h-${row.id}-b`,
      sender: "bot",
      text: row.botMessage,
      time,
      serverTurnId: row.id,
    },
  ];
}

function getEntityLabel(item: GlobalCategory | GlobalCourse): string {
  return item.name || "";
}

function renderMessageContent(text: string, role: "user" | "bot"): ReactNode {
  if (role === "user") {
    return <span>{text}</span>;
  }

  const lines = String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line, index, arr) => !(line === "" && arr[index - 1] === ""));

  const elements: ReactNode[] = [];
  let pendingList: string[] = [];

  const flushList = () => {
    if (!pendingList.length) return;
    elements.push(
      <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-0.5 my-1 text-sm">
        {pendingList.map((item, idx) => (
          <li key={`${item}-${idx}`}>{item}</li>
        ))}
      </ul>,
    );
    pendingList = [];
  };

  lines.forEach((line, index) => {
    if (!line) {
      flushList();
      return;
    }

    if (line.startsWith("- ")) {
      pendingList.push(line.slice(2).trim());
      return;
    }

    flushList();

    const headingLike = /:$/.test(line) || /^[^:]{1,40}:/.test(line);
    elements.push(
      <p
        key={`line-${index}`}
        className={`text-sm ${headingLike ? "font-semibold text-foreground mt-1 first:mt-0" : "mt-1 first:mt-0"}`}
      >
        {line}
      </p>,
    );
  });

  flushList();

  return <div className="space-y-0.5">{elements}</div>;
}

function TypingIndicator({ ariaLabel }: { ariaLabel: string }) {
  return (
    <span className="flex items-center py-0.5" aria-label={ariaLabel} role="status">
      <span className="inline-flex items-center gap-1.5">
        <span className="size-2 motion-safe:animate-bounce rounded-full bg-muted-foreground/55 [animation-duration:1s]" />
        <span className="size-2 motion-safe:animate-bounce rounded-full bg-muted-foreground/55 [animation-duration:1s] [animation-delay:120ms]" />
        <span className="size-2 motion-safe:animate-bounce rounded-full bg-muted-foreground/55 [animation-duration:1s] [animation-delay:240ms]" />
      </span>
    </span>
  );
}

type Variant = "page" | "widget";

type SheetStep = "lang" | "mode" | "categories" | "courses";

export function HelpCenterConversation({ variant }: { variant: Variant }) {
  const { i18n } = useTranslation();
  const languageOptions = useMemo(
    () => [
      { id: "az", label: tHelp("helpCenterLanguageAz") },
      { id: "en", label: tHelp("helpCenterLanguageEn") },
      { id: "ru", label: tHelp("helpCenterLanguageRu") },
    ],
    [i18n.language],
  );
  const generatingText = useMemo(() => tHelp("helpCenterGeneratingReply"), [i18n.language]);
  const { user, isAuthenticated } = useAuth();
  const { data, loading } = useGlobalData();
  const [message, setMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState<"category" | "all" | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<GlobalCourse | null>(null);
  const [localizedCategories, setLocalizedCategories] = useState<GlobalCategory[]>([]);
  const [localizedCourses, setLocalizedCourses] = useState<GlobalCourse[]>([]);
  /** API sorğuları üçün: state gecikəndə də son seçilmiş kurs id-si göndərilsin. */
  const activeCourseForChatRef = useRef<GlobalCourse | null>(null);
  const commitSelectedCourse = useCallback((course: GlobalCourse | null) => {
    activeCourseForChatRef.current = course;
    setSelectedCourse(course);
  }, []);
  /** Kurs ləğv: sol paneldə açıq kateqoriya/kurs siyahılarını da bağlayır. */
  const clearCourseSelectionFromComposer = useCallback(() => {
    commitSelectedCourse(null);
    setSelectionMode(null);
    setSelectedCategoryId(null);
  }, [commitSelectedCourse]);
  const messageListRef = useRef<HTMLDivElement>(null);
  const chatRequestInFlightRef = useRef(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [historyInitialLoading, setHistoryInitialLoading] = useState(true);
  const [historyLoadingMore, setHistoryLoadingMore] = useState(false);
  const [historyHasMore, setHistoryHasMore] = useState(false);
  const [historyNextBeforeId, setHistoryNextBeforeId] = useState<number | null>(null);
  const [courseSheetOpen, setCourseSheetOpen] = useState(false);
  const [sheetStep, setSheetStep] = useState<SheetStep>("lang");

  const historyHasMoreRef = useRef(false);
  const historyNextBeforeIdRef = useRef<number | null>(null);
  const historyLoadingOlderRef = useRef(false);
  const initialScrollDoneRef = useRef(false);
  /** Köhnə mesaj prepend olanda `messages` layout effekti scroll etməsin. */
  const suppressAutoScrollRef = useRef(false);

  const scrollMessagesEnd = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = messageListRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior });
    });
  }, []);

  const fetchLocalizedCategories = useCallback(async (lang: string) => {
    setListLoading(true);
    try {
      const res = await getLocalizedCategories(lang);
      setLocalizedCategories(res);
    } catch {
      setLocalizedCategories([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  /** Kurs siyahısı: `categoryId` veriləndə backend `?category=<id>` ilə süzülür. */
  const fetchLocalizedCourses = useCallback(async (lang: string, categoryId?: string | number | null) => {
    setListLoading(true);
    try {
      const coursesRes = await getLocalizedCourses(lang, {
        categoryId: categoryId != null && String(categoryId).trim() !== "" ? categoryId : undefined,
      });
      setLocalizedCourses(coursesRes);
    } catch {
      setLocalizedCourses([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    historyHasMoreRef.current = historyHasMore;
  }, [historyHasMore]);
  useEffect(() => {
    historyNextBeforeIdRef.current = historyNextBeforeId;
  }, [historyNextBeforeId]);

  useEffect(() => {
    setMessages((prev) => {
      if (!prev.some((m) => m.id === "welcome")) return prev;
      const text = tHelp("helpCenterWelcome");
      return prev.map((m) => (m.id === "welcome" ? { ...m, text } : m));
    });
  }, [i18n.language]);

  useEffect(() => {
    let cancelled = false;
    initialScrollDoneRef.current = false;

    if (!isAuthenticated) {
      setHistoryInitialLoading(false);
      setHistoryHasMore(false);
      setHistoryNextBeforeId(null);
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text: tHelp("helpCenterWelcome"),
          time: now(),
        },
      ]);
      return () => {
        cancelled = true;
      };
    }

    (async () => {
      setHistoryInitialLoading(true);
      try {
        const data = await getChatHistory({ size: 20 });
        if (cancelled) return;

        if (data.courseId) {
          const cid = data.courseId;
          if (cancelled) return;
          const info = await getCourseShortInfoForChat(cid);
          if (cancelled) return;
          if (info) {
            const catId = info.category.categoryId;
            const catName = info.category.categoryName;
            const courseRow: GlobalCourse = { id: info.id, name: info.name };
            setLocalizedCategories((prev) => {
              let cats = [...prev];
              if (!cats.some((c) => String(c.id) === String(catId))) {
                cats = [{ id: catId, name: catName }, ...cats];
              }
              return cats;
            });
            setLocalizedCourses((prev) => {
              let crs = [...prev];
              if (!crs.some((c) => String(c.id) === String(info.id))) {
                crs = [courseRow, ...crs];
              }
              return crs;
            });
            setSelectionMode("category");
            setSelectedCategoryId(catId);
            commitSelectedCourse(courseRow);
          } else {
            commitSelectedCourse({ id: cid, name: "" });
          }
        }

        if (cancelled) return;
        if (data.messages.length === 0) {
          setMessages([
            {
              id: "welcome",
              sender: "bot",
              text: tHelp("helpCenterWelcome"),
              time: now(),
            },
          ]);
        } else {
          setMessages(data.messages.flatMap(mapHistoryRow));
        }
        setHistoryHasMore(data.hasMore);
        setHistoryNextBeforeId(data.nextBeforeId);
      } catch {
        if (!cancelled) {
          setMessages([
            {
              id: "welcome",
              sender: "bot",
              text: tHelp("helpCenterWelcome"),
              time: now(),
            },
            {
              id: newLocalId(),
              sender: "bot",
              text: tHelp("helpCenterHistoryLoadError"),
              time: now(),
            },
          ]);
          setHistoryHasMore(false);
          setHistoryNextBeforeId(null);
        }
      } finally {
        if (!cancelled) setHistoryInitialLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, commitSelectedCourse]);

  useEffect(() => {
    if (historyInitialLoading) return;
    requestAnimationFrame(() => {
      scrollMessagesEnd("smooth");
      initialScrollDoneRef.current = true;
    });
  }, [historyInitialLoading, scrollMessagesEnd]);

  useLayoutEffect(() => {
    if (historyInitialLoading) return;
    if (suppressAutoScrollRef.current) return;
    const el = messageListRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (dist < 96) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, historyInitialLoading]);

  useEffect(() => {
    if (historyInitialLoading) return;
    const el = messageListRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
  }, [message, historyInitialLoading]);

  const loadOlderMessages = useCallback(async () => {
    if (historyLoadingOlderRef.current) return;
    const beforeId = historyNextBeforeIdRef.current;
    if (beforeId == null || !historyHasMoreRef.current) return;

    const el = messageListRef.current;
    const prevScrollHeight = el?.scrollHeight ?? 0;
    const prevScrollTop = el?.scrollTop ?? 0;

    suppressAutoScrollRef.current = true;
    historyLoadingOlderRef.current = true;
    setHistoryLoadingMore(true);
    try {
      const data = await getChatHistory({ size: 20, beforeId });
      setMessages((prev) => {
        const seen = new Set(
          prev.filter((m) => m.serverTurnId != null).map((m) => m.serverTurnId as number),
        );
        const freshRows = data.messages.filter((row) => !seen.has(row.id));
        const prepended = freshRows.flatMap(mapHistoryRow);
        return [...prepended, ...prev];
      });
      setHistoryHasMore(data.hasMore);
      setHistoryNextBeforeId(data.nextBeforeId);
    } catch {
      /* sessiz — köhnə mesajlar artıq ekrandadır */
    } finally {
      setHistoryLoadingMore(false);
      requestAnimationFrame(() => {
        const node = messageListRef.current;
        if (node) {
          const delta = node.scrollHeight - prevScrollHeight;
          node.scrollTop = prevScrollTop + delta;
        }
        historyLoadingOlderRef.current = false;
        suppressAutoScrollRef.current = false;
      });
    }
  }, []);

  useEffect(() => {
    const el = messageListRef.current;
    if (!el) return;

    const onScroll = () => {
      if (!initialScrollDoneRef.current || historyInitialLoading) return;
      if (historyLoadingOlderRef.current || historyLoadingMore) return;
      if (!historyHasMoreRef.current || historyNextBeforeIdRef.current == null) return;
      if (el.scrollHeight <= el.clientHeight + 4 && el.scrollTop === 0) return;
      if (el.scrollTop > 80) return;
      void loadOlderMessages();
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [historyInitialLoading, historyLoadingMore, loadOlderMessages]);

  const categories = localizedCategories.length ? localizedCategories : data.categories;
  const allCourses = localizedCourses.length ? localizedCourses : data.courses;

  const coursesBySelectedCategory = useMemo(() => {
    if (selectedCategoryId == null) return [];
    type CourseWithCats = GlobalCourse & { categories?: { categoryId?: string | number }[] };
    const hasCategoryLinks = (allCourses as CourseWithCats[]).some(
      (c) => Array.isArray(c.categories) && c.categories.length > 0,
    );
    if (!hasCategoryLinks) return allCourses;
    return (allCourses as CourseWithCats[]).filter((c) =>
      c.categories?.some((item) => item?.categoryId === selectedCategoryId),
    );
  }, [allCourses, selectedCategoryId]);

  const visibleCourses =
    selectionMode === "category" ? coursesBySelectedCategory : allCourses;

  const pushMessages = (next: Omit<Message, "time">[]) => {
    const stamped = next.map((m) => ({ ...m, time: now() }));
    setMessages((prev) => [...prev, ...stamped]);
  };

  const handleSelectLanguage = async (lang: string) => {
    if (chatLoading || listLoading) return;
    if (!isSupportedLocale(lang)) return;

    setSelectedLang(lang);
    setSelectionMode(null);
    setSelectedCategoryId(null);
    commitSelectedCourse(null);
    setLocalizedCategories([]);
    setLocalizedCourses([]);

    pushMessages([
      {
        id: newLocalId(),
        sender: "user",
        text: languageOptions.find((item) => item.id === lang)?.label || lang,
      },
      {
        id: newLocalId(),
        sender: "bot",
        text: tHelp("helpCenterLanguageSelected"),
      },
    ]);
    scrollMessagesEnd("smooth");
  };

  const handleSelectMode = async (mode: "category" | "all") => {
    if (!selectedLang) return;

    setSelectionMode(mode);
    setSelectedCategoryId(null);
    commitSelectedCourse(null);

    if (mode === "category") {
      pushMessages([
        { id: newLocalId(), sender: "user", text: tHelp("helpCenterSelectByCategory") },
        {
          id: newLocalId(),
          sender: "bot",
          text: tHelp("helpCenterSelectCategoryPrompt"),
        },
      ]);
      scrollMessagesEnd("smooth");
      setLocalizedCourses([]);
      await fetchLocalizedCategories(selectedLang);
      return;
    }

    pushMessages([
      { id: newLocalId(), sender: "user", text: tHelp("helpCenterSelectFromAllCourses") },
      {
        id: newLocalId(),
        sender: "bot",
        text: tHelp("helpCenterAllCoursesPrompt"),
      },
    ]);
    scrollMessagesEnd("smooth");
    setLocalizedCategories([]);
    await fetchLocalizedCourses(selectedLang, null);
  };

  const handleSelectCategory = (category: GlobalCategory) => {
    setSelectedCategoryId(category.id);
    commitSelectedCourse(null);
    if (selectedLang && category.id != null && String(category.id).trim() !== "") {
      void fetchLocalizedCourses(selectedLang, category.id);
    }
    pushMessages([
      { id: newLocalId(), sender: "user", text: getEntityLabel(category) },
      {
        id: newLocalId(),
        sender: "bot",
        text: tHelp("helpCenterCategoryCoursesPrompt"),
      },
    ]);
    scrollMessagesEnd("smooth");
  };

  const askBackend = async ({
    course,
    customMessage,
  }: {
    course: GlobalCourse | null;
    customMessage: string | null;
  }) => {
    if (chatRequestInFlightRef.current || chatLoading) return;
    chatRequestInFlightRef.current = true;

    const lang = selectedLang ?? DEFAULT_CHAT_LANG;

    setChatLoading(true);
    const loadingId = newLocalId();
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        sender: "bot",
        text: tHelp("helpCenterGeneratingReply"),
        time: now(),
      },
    ]);
    scrollMessagesEnd("smooth");

    const courseIdForRequest =
      course != null && course.id != null && course.id !== ""
        ? course.id
        : activeCourseForChatRef.current?.id ?? null;

    try {
      const response = await getChatBotResponse({
        courseId: courseIdForRequest,
        lang,
        customMessage,
        userId: user?.id ?? null,
      });

      setMessages((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((m) => m.id === loadingId);
        if (idx !== -1) {
          updated[idx] = {
            ...updated[idx],
            text: String(response || tHelp("helpCenterReplyDefault")),
            time: now(),
          };
        }
        return updated;
      });
      scrollMessagesEnd("smooth");
    } catch (e) {
      const errText =
        e instanceof Error && e.message ? e.message : tHelp("helpCenterReplyError");
      setMessages((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((m) => m.id === loadingId);
        if (idx !== -1) {
          updated[idx] = {
            ...updated[idx],
            text: errText,
            time: now(),
          };
        }
        return updated;
      });
      scrollMessagesEnd("smooth");
    } finally {
      chatRequestInFlightRef.current = false;
      setChatLoading(false);
    }
  };

  const handleSelectCourse = async (course: GlobalCourse) => {
    if (!course?.id || chatLoading) return;

    const courseName = getEntityLabel(course);
    commitSelectedCourse(course);
    pushMessages([
      { id: newLocalId(), sender: "user", text: courseName },
      {
        id: newLocalId(),
        sender: "bot",
        text: tHelp("helpCenterCourseSelectedReply", { course: courseName }),
      },
    ]);
    scrollMessagesEnd("smooth");

    await askBackend({
      course,
      customMessage: null,
    });
  };

  const sendMessage = async (value: string) => {
    const userText = value.trim();
    if (!userText) return;

    pushMessages([{ id: newLocalId(), sender: "user", text: userText }]);
    setMessage("");
    scrollMessagesEnd("smooth");

    await askBackend({
      course: selectedCourse,
      customMessage: userText,
    });
  };

  const openCourseSheet = useCallback(() => {
    setSheetStep(selectedLang ? "mode" : "lang");
    setCourseSheetOpen(true);
  }, [selectedLang]);

  const sheetGoBack = useCallback(() => {
    if (sheetStep === "courses") {
      if (selectionMode === "category") {
        setSelectedCategoryId(null);
        setSheetStep("categories");
      } else {
        setSelectionMode(null);
        setSheetStep("mode");
      }
    } else if (sheetStep === "categories") {
      setSelectionMode(null);
      setSheetStep("mode");
    } else if (sheetStep === "mode") {
      setSheetStep("lang");
    } else {
      setCourseSheetOpen(false);
    }
  }, [sheetStep, selectionMode]);

  /** Sheet-i dərhal bağla ki, mobil cihazda cavab gözlənərkən söhbət görünsün. */
  const pickCourseFromSheet = (course: GlobalCourse) => {
    setCourseSheetOpen(false);
    void handleSelectCourse(course);
  };

  const sheetTitle =
    sheetStep === "lang"
      ? tHelp("helpCenterSheetTitleLang")
      : sheetStep === "mode"
        ? tHelp("helpCenterSheetTitleMode")
        : sheetStep === "categories"
          ? tHelp("helpCenterSheetTitleCategories")
          : tHelp("helpCenterSheetTitleCourses");

  const langChipClass = (active: boolean) =>
    cn(
      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
      active
        ? "gradient-primary border-transparent text-primary-foreground"
        : "border-border bg-secondary/80 text-secondary-foreground hover:bg-secondary",
    );

  const desktopSetup = (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold tracking-tight">{tHelp("helpCenterSidebarTitle")}</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {tHelp("helpCenterSidebarSubtitle")}
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground">{tHelp("helpCenterLanguageSection")}</p>
        <div className="flex flex-wrap gap-2">
          {languageOptions.map((langItem) => (
            <button
              key={langItem.id}
              type="button"
              disabled={chatLoading || listLoading}
              onClick={() => void handleSelectLanguage(langItem.id)}
              className={langChipClass(selectedLang === langItem.id)}
            >
              <span className="mr-1 font-semibold">{langItem.id.toUpperCase()}</span>
              {langItem.label}
            </button>
          ))}
        </div>

        {selectedLang && (
          <>
            <p className="pt-1 text-xs font-medium text-muted-foreground">{tHelp("helpCenterBrowseSection")}</p>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-9 w-full justify-start text-xs"
                disabled={chatLoading}
                onClick={() => void handleSelectMode("category")}
              >
                {tHelp("helpCenterSelectByCategory")}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-9 w-full justify-start text-xs"
                disabled={chatLoading}
                onClick={() => void handleSelectMode("all")}
              >
                {tHelp("helpCenterSelectFromAllCourses")}
              </Button>
            </div>
          </>
        )}

        {selectionMode === "category" && (
          <div className="space-y-2 rounded-lg border bg-background/80 p-3">
            <p className="text-xs font-medium text-muted-foreground">{tHelp("helpCenterCategoriesTitle")}</p>
            <div className="max-h-40 space-y-1 overflow-y-auto pr-1">
              {categories.map((category) => (
                <button
                  key={String(category.id)}
                  type="button"
                  disabled={chatLoading || listLoading}
                  onClick={() => handleSelectCategory(category)}
                  className="w-full rounded-md border border-transparent px-2 py-2 text-left text-xs transition-colors hover:border-border hover:bg-muted/60"
                >
                  {getEntityLabel(category)}
                </button>
              ))}
            </div>
          </div>
        )}

        {(selectionMode === "all" ||
          (selectionMode === "category" && selectedCategoryId != null)) && (
          <div className="space-y-2 rounded-lg border bg-background/80 p-3">
            <p className="text-xs font-medium text-muted-foreground">{tHelp("helpCenterCoursesTitle")}</p>
            <div className="max-h-48 space-y-1 overflow-y-auto pr-1">
              {loading.home || listLoading ? (
                <span className="text-xs text-muted-foreground">{tHelp("helpCenterListsLoading")}</span>
              ) : visibleCourses.length ? (
                visibleCourses.map((course) => (
                  <button
                    key={String(course.id)}
                    type="button"
                    disabled={chatLoading}
                    onClick={() => void handleSelectCourse(course)}
                    className="w-full rounded-md border border-transparent px-2 py-2 text-left text-xs transition-colors hover:border-border hover:bg-muted/60"
                  >
                    {getEntityLabel(course)}
                  </button>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">{tHelp("noTrainingsFound")}</span>
              )}
            </div>
          </div>
        )}

        {!selectedCourse && (
          <p className="border-t border-border/50 pt-3 text-[11px] leading-snug text-muted-foreground">
            {tHelp("helpCenterHintSidebar")}
          </p>
        )}
      </div>
    </div>
  );

  const compact = variant === "widget";
  const listWrap =
    variant === "page"
      ? "min-h-0 w-full flex-1 space-y-5 overflow-y-auto overscroll-y-contain px-1 py-4 sm:px-2 sm:py-5"
      : "min-h-0 w-full flex-1 space-y-3 overflow-y-auto overscroll-y-contain p-3";
  const avatarBot = compact ? "w-7 h-7" : "w-8 h-8";
  const avatarUser = compact ? "w-7 h-7" : "w-8 h-8";
  const iconBot = compact ? "w-4 h-4" : "w-4 h-4";
  const iconUser = compact ? "w-4 h-4" : "w-4 h-4";
  const bubblePad = compact ? "px-4 py-2.5" : "px-4 py-3";

  const pageComposerPad =
    variant === "page"
      ? "w-full shrink-0 border-t border-border/60 bg-background/95 pb-safe pt-3 shadow-[0_-6px_28px_-12px_rgba(15,23,42,0.12)] backdrop-blur-md dark:shadow-[0_-6px_28px_-12px_rgba(0,0,0,0.45)] sm:pt-4"
      : "w-full shrink-0 border-t px-3 pt-3 pb-safe";

  const rootClass = cn(
    "flex h-full min-h-0 w-full flex-1 overflow-hidden",
    variant === "page" ? "flex-col lg:flex-row" : "flex-col",
  );

  const innerShellClass =
    variant === "page"
      ? "flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 sm:px-6 lg:px-8"
      : "flex h-full min-h-0 w-full flex-col overflow-hidden";

  return (
    <div className={rootClass}>
      {variant === "page" && (
        <aside className="hidden min-h-0 w-[min(100%,18rem)] shrink-0 flex-col border-b border-border bg-muted/15 lg:flex lg:border-b-0 lg:border-e xl:w-80">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-4 xl:p-5">{desktopSetup}</div>
        </aside>
      )}

      <div className={innerShellClass}>
        <div
          className={cn(
            "flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden",
            variant === "page" &&
              "mx-auto max-w-3xl sm:rounded-2xl sm:border sm:border-border/50 sm:bg-card/25 sm:shadow-sm",
          )}
        >
        <div
          className={listWrap}
          ref={messageListRef}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
        {historyLoadingMore && (
          <div className="text-center text-xs text-muted-foreground py-2">
            {tHelp("helpCenterHistoryLoadOlder")}
          </div>
        )}

        {historyInitialLoading ? (
          <div
            className="flex flex-col gap-5 px-1 py-2"
            aria-busy="true"
            aria-label={tHelp("helpCenterHistoryLoading")}
          >
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-2">
                <Skeleton className={`${avatarBot} shrink-0 rounded-full`} />
                <div className="flex min-w-0 flex-1 flex-col gap-2 pt-0.5">
                  <Skeleton
                    className={cn("h-14 rounded-2xl rounded-bl-md", i === 1 ? "w-[72%]" : "w-[88%]")}
                  />
                </div>
              </div>
            ))}
            <p className="text-center text-xs text-muted-foreground">{tHelp("helpCenterHistoryLoading")}</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isGenerating = msg.sender === "bot" && msg.text === generatingText;
            return (
            <div key={msg.id}>
              <div
                className={`flex gap-2 animate-fade-in ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div
                    className={`${avatarBot} mt-0.5 flex shrink-0 items-center justify-center rounded-full bg-secondary ring-1 ring-border/60`}
                  >
                    <Bot className={`${iconBot} text-primary`} />
                  </div>
                )}
                <div
                  className={`max-w-[min(100%,20rem)] rounded-2xl ${bubblePad} text-sm sm:max-w-[75%] ${
                    msg.sender === "user"
                      ? "rounded-br-md bg-chat-user text-chat-user-foreground"
                      : "rounded-bl-md bg-chat-bubble text-chat-bubble-foreground"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <span className="whitespace-pre-wrap break-words">{msg.text}</span>
                  ) : isGenerating ? (
                    <TypingIndicator ariaLabel={generatingText} />
                  ) : (
                    renderMessageContent(msg.text, "bot")
                  )}
                  {!isGenerating && (
                  <p
                    className={`mt-1.5 text-[10px] tabular-nums ${
                      msg.sender === "user"
                        ? "text-chat-user-foreground/60"
                        : "text-muted-foreground"
                    }`}
                  >
                    {msg.time}
                  </p>
                  )}
                </div>
                {msg.sender === "user" && (
                  <div
                    className={`${avatarUser} mt-0.5 flex shrink-0 items-center justify-center rounded-full gradient-primary ring-1 ring-primary-foreground/20`}
                  >
                    <User className={`${iconUser} text-primary-foreground`} />
                  </div>
                )}
              </div>
            </div>
            );
          })
        )}
        </div>

        <div className={cn(pageComposerPad, variant === "page" && "px-1 sm:px-2")}>
          {selectedCourse && (
            <div className="mb-3 flex flex-col gap-2 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-transparent px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <div className="flex min-w-0 items-start gap-2.5 sm:items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {tHelp("helpCenterActiveCourseHint")}
                  </p>
                  <p className="truncate text-sm font-semibold leading-tight text-foreground">
                    {getEntityLabel(selectedCourse)}
                  </p>
                </div>
              </div>
              <div className="flex w-full min-w-0 shrink-0 flex-row items-stretch gap-2 sm:w-auto sm:items-center">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-10 min-h-10 min-w-0 flex-1 sm:h-9 sm:min-h-9 sm:flex-none"
                  onClick={openCourseSheet}
                >
                  {tHelp("helpCenterChangeCourse")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 min-h-10 w-10 shrink-0 sm:h-9 sm:min-h-9 sm:w-9"
                  disabled={chatLoading}
                  onClick={clearCourseSelectionFromComposer}
                  aria-label={tHelp("helpCenterClearCourseAria")}
                >
                  <X className="h-4 w-4 shrink-0" aria-hidden />
                </Button>
              </div>
            </div>
          )}
          {!selectedCourse && (
            <p
              className={cn(
                "mb-2 text-[11px] leading-relaxed text-muted-foreground",
                variant === "page" && "lg:hidden",
              )}
            >
              {tHelp("helpCenterHintMobile")}
            </p>
          )}
          <div
            className={cn(
              "min-w-0",
              variant === "page" &&
                "rounded-2xl border border-border/70 bg-muted/35 p-1.5 shadow-inner sm:p-2 dark:bg-muted/25",
            )}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void sendMessage(message);
              }}
              className="flex w-full min-w-0 items-center gap-2"
            >
              <Button
                type="button"
                variant="outline"
                onClick={openCourseSheet}
                aria-label={tHelp("helpCenterPickCourseAria")}
                className={cn(
                  "shrink-0 gap-1.5 border-dashed px-2.5 sm:px-3",
                  variant === "page" ? "h-11 min-h-11 lg:hidden" : "h-10 min-h-10",
                  variant === "widget" && "px-2",
                )}
              >
                <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
                <span className="max-w-[5rem] truncate text-xs font-medium sm:max-w-none">
                  {tHelp("helpCenterPickCourseButton")}
                </span>
              </Button>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={tHelp("helpCenterInputPlaceholder")}
                disabled={chatLoading || historyInitialLoading}
                className={cn(
                  "min-w-0 flex-1 border-0 bg-background/80 shadow-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-background/50",
                  variant === "page" ? "h-11 min-h-11" : "h-10 min-h-10",
                )}
              />
              <Button
                type="submit"
                size="icon"
                disabled={chatLoading || historyInitialLoading}
                aria-label={tHelp("helpCenterSendAria")}
                className={
                  variant === "page"
                    ? "h-11 min-h-11 w-11 shrink-0 gradient-primary shadow-sm"
                    : "h-10 min-h-10 w-10 shrink-0 gradient-primary shadow-sm"
                }
              >
                <Send className="h-4 w-4 text-primary-foreground" aria-hidden />
              </Button>
            </form>
          </div>
        </div>
        </div>
      </div>

      <Sheet open={courseSheetOpen} onOpenChange={setCourseSheetOpen}>
        <SheetContent
          side="bottom"
          closeAriaLabel={tHelp("helpCenterClosePickerAria")}
          className="flex h-[min(88dvh,640px)] flex-col rounded-t-2xl p-0 pb-safe"
        >
          <SheetHeader className="space-y-0 border-b border-border px-4 py-3 pr-14 text-left">
            <div className="flex flex-col gap-2">
              {sheetStep !== "lang" && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 w-fit gap-1.5 border-dashed px-3"
                  onClick={sheetGoBack}
                >
                  <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
                  <span>{tHelp("helpCenterSetupStepBack")}</span>
                </Button>
              )}
              <SheetTitle className="text-left text-base font-semibold leading-tight">{sheetTitle}</SheetTitle>
            </div>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-4">
            {sheetStep === "lang" && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{tHelp("helpCenterWelcome")}</p>
                <div className="grid gap-2">
                  {languageOptions.map((langItem) => (
                    <button
                      key={langItem.id}
                      type="button"
                      disabled={chatLoading || listLoading}
                      onClick={() =>
                        void handleSelectLanguage(langItem.id).then(() => setSheetStep("mode"))
                      }
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-left text-sm font-medium transition-colors",
                        selectedLang === langItem.id ? "border-primary bg-primary/5" : "hover:bg-muted/60",
                      )}
                    >
                      <span>
                        <span className="font-semibold text-primary">{langItem.id.toUpperCase()}</span>{" "}
                        {langItem.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sheetStep === "mode" && (
              <div className="grid gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="h-auto min-h-[3rem] w-full flex-col items-start gap-0.5 py-3 text-left"
                  disabled={chatLoading}
                  onClick={() =>
                    void handleSelectMode("category").then(() => setSheetStep("categories"))
                  }
                >
                  <span className="font-semibold">{tHelp("helpCenterSelectByCategory")}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {tHelp("helpCenterSelectCategoryPrompt")}
                  </span>
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="h-auto min-h-[3rem] w-full flex-col items-start gap-0.5 py-3 text-left"
                  disabled={chatLoading}
                  onClick={() => void handleSelectMode("all").then(() => setSheetStep("courses"))}
                >
                  <span className="font-semibold">{tHelp("helpCenterSelectFromAllCourses")}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {tHelp("helpCenterAllCoursesPrompt")}
                  </span>
                </Button>
              </div>
            )}

            {sheetStep === "categories" && (
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={String(category.id)}
                    type="button"
                    disabled={chatLoading || listLoading}
                    onClick={() => {
                      handleSelectCategory(category);
                      setSheetStep("courses");
                    }}
                    className="w-full rounded-xl border border-border px-4 py-3 text-left text-sm transition-colors hover:bg-muted/60"
                  >
                    {getEntityLabel(category)}
                  </button>
                ))}
              </div>
            )}

            {sheetStep === "courses" && (
              <div className="space-y-2">
                {loading.home || listLoading ? (
                  <p className="text-sm text-muted-foreground">{tHelp("helpCenterListsLoading")}</p>
                ) : visibleCourses.length ? (
                  visibleCourses.map((course) => (
                    <button
                      key={String(course.id)}
                      type="button"
                      disabled={chatLoading}
                      onClick={() => void pickCourseFromSheet(course)}
                      className="w-full rounded-xl border border-border px-4 py-3 text-left text-sm transition-colors hover:bg-muted/60"
                    >
                      {getEntityLabel(course)}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">{tHelp("noTrainingsFound")}</p>
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
