import { createContext, useState, useCallback, useEffect } from "react";
import * as authApi from "../api/authApi";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("pace_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("pace_token"));
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Validate the stored token against the API once on load.
    if (!token) {
      setInitializing(false);
      return;
    }
    authApi
      .getMe()
      .then(({ user: freshUser }) => {
        setUser(freshUser);
        localStorage.setItem("pace_user", JSON.stringify(freshUser));
      })
      .catch(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("pace_token");
        localStorage.removeItem("pace_user");
      })
      .finally(() => setInitializing(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistSession = useCallback((data) => {
    localStorage.setItem("pace_token", data.token);
    localStorage.setItem("pace_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const login = useCallback(
    async (credentials) => {
      const data = await authApi.login(credentials);
      persistSession(data);
      return data.user;
    },
    [persistSession]
  );

  const register = useCallback(
    async (payload) => {
      const data = await authApi.register(payload);
      persistSession(data);
      return data.user;
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("pace_token");
    localStorage.removeItem("pace_user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, initializing, login, register, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}
