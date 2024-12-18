import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios"; // Para hacer peticiones HTTP

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginUser = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user_token", token);
    localStorage.setItem("user_data", JSON.stringify(userData));
    setIsAuthenticated(true);
  };

  const logoutUser = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_data");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("user_token");
    if (storedToken) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/users/uid/${storedToken}`)
        .then((response) => {
          setUser({
            id: response.data.id, // ID del documento Firestore
            uid: response.data.uid, // UID del usuario
            nombre: response.data.nombre,
            apellido: response.data.apellido,
            email: response.data.email,
            preference: response.data.preference || [],
          });
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.error("Error al cargar usuario:", error);
          logoutUser();
        });
    }
  }, []);
  

  return (
    <UserContext.Provider value={{ user, isAuthenticated, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
