import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // const fetchUser = async () => {
  //   try {
  //     const res = await api.get("/auth/me");
  //     if (res.data?.user) {
  //       setUser(res.data.user);
  //     } else {
  //       setUser(null);
  //     }
  //   } catch {
  //     setUser(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchUser = async () => {
  try {
    const res = await api.get("/auth/me");

    if (res.data?.user) {
      setUser(res.data.user);
      return;
    }

    setUser(null);
  } catch {
    setTimeout(async () => {
      try {
        const retry = await api.get("/auth/me");
        if (retry.data?.user) setUser(retry.data.user);
      } catch {
        setUser(null);
      }
    }, 400);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchUser();
  }, []);

  // Re-fetch user when returning from OAuth (e.g. login=success in URL)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("login") === "success") {
      fetchUser();
    }
  }, []);

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
