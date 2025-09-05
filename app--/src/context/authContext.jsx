import { createContext, useEffect, useState } from "react";
import { checkAuthStatus, loginUser, logoutUser, registerUser } from "../helpers/api-communicators";
import { useContext } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // On page load, check localStorage for token and user info
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);

    if (data?.token && data?.user) {
      // Store token and user info
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      setIsLoggedIn(true);

      return data; // optional, in case component wants it
    }
  };

  const signUp = async (name, email, password) => {
    const data = await registerUser(name, email, password);

    if (data?.token && data?.user) {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      setIsLoggedIn(true);

      return data;
    }
  };

  const logout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    setUser(null);
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  const value = {
    user,
    isLoggedIn,
    login,
    signUp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
