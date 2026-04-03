import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { setupChatAuthInterceptors } from "@/lib/axios";
import { clearPersistedSession, loadStoredAccessToken, loadStoredUser, persistSession } from "@/lib/auth/storage";
import {
  type AuthCredentials,
  type AuthResponseDto,
  type AuthUser,
  refreshSession,
  signIn,
  signOut as signOutApi,
} from "@/lib/utils/api/auth";

type LoginResult =
  | { kind: "success" }
  | { kind: "requires_activation"; email: string };

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  initializing: boolean;
  login: (credentials: AuthCredentials) => Promise<LoginResult>;
  /** Persist access token + user after `verify-otp` (refresh cookie set by API). */
  applyAuthResponse: (data: AuthResponseDto) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mapLoginToUser(data: {
  id: number;
  firstName?: string;
  lastName?: string;
  role?: string[];
  email?: string;
}): AuthUser {
  return {
    id: data.id,
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    role: Array.isArray(data.role) ? data.role : [],
    email: data.email,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  const accessTokenRef = useRef<string | null>(null);
  accessTokenRef.current = accessToken;

  const applyAuthResponse = useCallback((data: AuthResponseDto) => {
    const u = mapLoginToUser(data);
    persistSession(data.accessToken, u);
    setUser(u);
    setAccessToken(data.accessToken);
  }, []);

  const clearAuth = useCallback(() => {
    clearPersistedSession();
    setUser(null);
    setAccessToken(null);
  }, []);

  const applyAuthResponseRef = useRef(applyAuthResponse);
  applyAuthResponseRef.current = applyAuthResponse;
  const clearAuthRef = useRef(clearAuth);
  clearAuthRef.current = clearAuth;

  const refreshAccessTokenForInterceptor = useCallback(async (): Promise<string | null> => {
    try {
      const data = await refreshSession();
      applyAuthResponseRef.current(data);
      return data.accessToken;
    } catch {
      clearAuthRef.current();
      return null;
    }
  }, []);

  useEffect(() => {
    setupChatAuthInterceptors({
      getAccessToken: () => accessTokenRef.current ?? loadStoredAccessToken(),
      refreshAccessToken: refreshAccessTokenForInterceptor,
      onAuthFailure: () => clearAuthRef.current(),
    });
  }, [refreshAccessTokenForInterceptor]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const storedToken = loadStoredAccessToken();
      const storedUser = loadStoredUser();
      if (storedToken && storedUser) {
        setAccessToken(storedToken);
        setUser(storedUser);
        try {
          const data = await refreshSession();
          if (!cancelled) applyAuthResponseRef.current(data);
        } catch {
          if (!cancelled) clearAuthRef.current();
        }
      }
      if (!cancelled) setInitializing(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (credentials: AuthCredentials): Promise<LoginResult> => {
    const data = await signIn(credentials);
    const status = String(data.status ?? "").toUpperCase();
    if (status === "REQUIRES_ACTIVATION" && data.email) {
      return { kind: "requires_activation", email: data.email };
    }
    if (status === "SUCCESS" && data.accessToken && data.id != null) {
      const u = mapLoginToUser({
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        email: data.email,
      });
      persistSession(data.accessToken, u);
      setUser(u);
      setAccessToken(data.accessToken);
      return { kind: "success" };
    }
    throw new Error("Unexpected login response");
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOutApi();
    } catch {
      /* still clear local session */
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(user && accessToken),
      initializing,
      login,
      applyAuthResponse,
      logout,
    }),
    [user, accessToken, initializing, login, applyAuthResponse, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
