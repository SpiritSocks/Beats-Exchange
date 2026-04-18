import { createContext, useContext, useState } from "react";

interface AuthContextValue {
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextValue>({
  token: null,
  setToken: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null,
  );

  const setToken = (t: string | null) => {
    if (t) {
      localStorage.setItem("authToken", t);
    } else {
      localStorage.removeItem("authToken");
    }
    setTokenState(t);
  };

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
