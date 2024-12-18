import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [superuser, setSuperuser] = useState(null);

  const loginSuper = (superData, token) => {
    setSuperuser(superData);
    localStorage.setItem("super_token", token);
  };

  const logoutSuper = () => {
    setSuperuser(null);
    localStorage.removeItem("super_token");
  };

  // Cargar datos del superuser si el token existe
  useEffect(() => {
    const storedToken = localStorage.getItem("super_token");
    if (storedToken) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/auth/me-super`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((response) => setSuperuser(response.data))
        .catch(() => {
          localStorage.removeItem("super_token");
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ superuser, loginSuper, logoutSuper }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
