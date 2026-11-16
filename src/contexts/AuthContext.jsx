import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../api/axios";

// Reads the "exp" claim (ms since epoch) without verifying; the server verifies.
function getTokenExpiry(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(base64));
    return typeof exp === "number" ? exp * 1000 : null;
  } catch {
    return null;
  }
}

const MAX_TIMEOUT_MS = 2 ** 31 - 1; // setTimeout limit (~24.8 days)

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  const sessionEnding = useRef(false);

  // Called when the token expires or the server rejects it (401), e.g. after
  // an admin deactivates the account.
  const endSession = useCallback(
    (message) => {
      if (sessionEnding.current) return;
      sessionEnding.current = true;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setAuthToken(null);
      setToken(null);
      setRole(null);
      navigate("/login", { replace: true });
      if (message) alert(message);
    },
    [navigate]
  );

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setRole(localStorage.getItem("role"));
  }, []);

  // Log out when the token's expiry time is reached
  useEffect(() => {
    if (!token) return;
    sessionEnding.current = false;
    setAuthToken(token);
    const expiresAt = getTokenExpiry(token);
    if (!expiresAt) return;
    const remaining = expiresAt - Date.now();
    if (remaining <= 0) {
      endSession("Your session has expired. Please log in again.");
      return;
    }
    const timer = setTimeout(
      () => endSession("Your session has expired. Please log in again."),
      Math.min(remaining, MAX_TIMEOUT_MS)
    );
    return () => clearTimeout(timer);
  }, [token, endSession]);

  // Log out on any 401 from the backend, for both fetch and axios calls
  useEffect(() => {
    const handle401 = async (status, readMessage) => {
      if (status !== 401 || !localStorage.getItem("token")) return;
      const serverMessage = await readMessage().catch(() => null);
      endSession(
        serverMessage === "This account has been deactivated"
          ? "Your account has been deactivated. Please contact an administrator."
          : "Your session has expired. Please log in again."
      );
    };

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 401) {
        handle401(401, async () => (await response.clone().json())?.message);
      }
      return response;
    };

    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        handle401(error.response?.status, async () => error.response?.data?.message);
        return Promise.reject(error);
      }
    );

    return () => {
      window.fetch = originalFetch;
      api.interceptors.response.eject(interceptor);
    };
  }, [endSession]);

  const login = async (formData, setFormData) => {
    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "https://learning-management-system-backend-5aet.onrender.com";
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok && data.success) {
        // Store token and role
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.data.role);
        setToken(data.token);
        setRole(data.data.role);
        setAuthToken(data.token);

        if (typeof setFormData === "function") {
          setFormData({
            name: "",
            email: "",
            password: "",
            role: "",
          });
        }

        // Navigate based on role
        if (data.data.role === "Teacher") {
          navigate("/teacher/home");
        } else if (data.data.role === "Admin") {
          navigate("/admin/dashboard");
        } else if (data.data.role === "SuperAdmin") {
          navigate("/superadmin");
        } else if (data.data.role === "Student") {
          navigate("/student/home");
        } else {
          navigate("/");
        }
      } else {
        alert("Login Error: " + (data.message || "Invalid credentials"));
      }
    } catch (error) {
      console.log("Login error:", error);
      alert("Error during login: " + (error.message || "Please try again."));
    }
  };

  const logout = (setIsMenuOpen) => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    if (typeof setIsMenuOpen === "function") {
      setIsMenuOpen(false);
    }
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ login, logout, token, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
