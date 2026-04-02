import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  time: string;
}

const AUTO_REPLIES: Record<string, string> = {
  hello: "Hi there! 👋 How can I help you with your learning today?",
  help: "I can assist you with:\n• Course navigation\n• Technical issues\n• Account settings\n• General questions\n\nJust type your question!",
  course: "You can browse all courses from your dashboard. Use the filter chips to narrow down by category. Need help with a specific course?",
  progress: "Your progress is saved automatically. You can see it on each course card and in the stats bar at the top of your dashboard.",
  default: "Thanks for your message! Our support team typically responds within a few minutes. Is there anything specific I can help with?",
};

const getReply = (text: string): string => {
  const lower = text.toLowerCase();
  for (const [key, reply] of Object.entries(AUTO_REPLIES)) {
    if (key !== "default" && lower.includes(key)) return reply;
  }
  return AUTO_REPLIES.default;
};

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "👋 Welcome to LearnHub Help Centre! How can I assist you today?",
      sender: "bot",
      time: now(),
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), text: input, sender: "user", time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate bot reply
    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        text: getReply(input),
        sender: "bot",
        time: now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-primary shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center"
      >
        {open ? (
          <X className="w-6 h-6 text-primary-foreground" />
        ) : (
          <MessageCircle className="w-6 h-6 text-primary-foreground" />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl border bg-card overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="gradient-primary px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-foreground text-sm">Help Centre</h3>
                <p className="text-primary-foreground/70 text-xs">Online • Typically replies instantly</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 animate-fade-in ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-chat-user text-chat-user-foreground rounded-br-md"
                      : "bg-chat-bubble text-chat-bubble-foreground rounded-bl-md"
                  }`}
                >
                  {msg.text}
                  <p
                    className={`text-[10px] mt-1 ${
                      msg.sender === "user" ? "text-chat-user-foreground/60" : "text-muted-foreground"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 h-10 bg-secondary/50 border-0"
              />
              <Button type="submit" size="icon" className="h-10 w-10 gradient-primary shrink-0">
                <Send className="w-4 h-4 text-primary-foreground" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
