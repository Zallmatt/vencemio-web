import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserPreferences.css";
import { useUser } from "../../context/UserContext";

const UserPreferences = ({ onClose }) => {
  const { user } = useUser(); // Obtiene el usuario desde el contexto

  const [categories, setCategories] = useState([]); // Categorías desde la API
  const [selectedCategories, setSelectedCategories] = useState([]); // Preferencias seleccionadas
  const [isSaving, setIsSaving] = useState(false);

  // Obtener las categorías y preferencias
  useEffect(() => {
    const fetchCategoriesAndPreferences = async () => {
      try {
        // Fetch de categorías
        const categoriesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/tipos_product`);
        const fetchedCategories = categoriesResponse.data.map((cat) => ({
          name: cat.nombre.trim(), // Mantén el nombre original
          id: cat.id,
        }));
        setCategories(fetchedCategories);

        // Fetch de preferencias del usuario
        const preferencesResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/preferences/${user.uid}`
        );
        const userPrefs = preferencesResponse.data.preferences || [];

        console.log("Categorías desde API:", fetchedCategories);
        console.log("Preferencias del usuario:", userPrefs);

        // Comparar y setear categorías seleccionadas
        const matchedPreferences = userPrefs
          .map((pref) => pref.trim()) // Solo aplica trim si es necesario
          .filter((pref) => fetchedCategories.some((cat) => cat.name === pref));
      
        setSelectedCategories(matchedPreferences);
      } catch (error) {
        console.error("Error al obtener categorías o preferencias:", error);
      }
    };

    fetchCategoriesAndPreferences();
  }, [user.uid]); // user.uid como dependencia

  // Guardar las preferencias
  const savePreferences = async () => {
    try {
      setIsSaving(true);
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/preferences/uid/${user.uid}`,
        { preferences: selectedCategories }
      );
      alert("Preferencias actualizadas con éxito.");
      onClose();
    } catch (error) {
      console.error("Error al actualizar preferencias:", error);
      alert("Hubo un problema al actualizar las preferencias.");
    } finally {
      setIsSaving(false);
    }
  };

  // Seleccionar o deseleccionar categorías
  const toggleCategory = (name) => {
    setSelectedCategories((prev) => {
      if (prev.includes(name)) {
        return prev.filter((cat) => cat !== name);
      } else if (prev.length < 3) {
        return [...prev, name];
      } else {
        alert("Solo puedes seleccionar hasta 3 categorías.");
        return prev;
      }
    });
  };

  return (
    <div className="preferences-container">
      <h1>Selecciona hasta 3 categorías</h1>
      <div className="categories-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`category-card ${
              selectedCategories.includes(category.name) ? "selected" : ""
            }`}
            onClick={() => toggleCategory(category.name)}
          >
            <p>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</p>
          </div>
        ))}
      </div>
      <button className="save-button" onClick={savePreferences} disabled={isSaving}>
        {isSaving ? "Guardando..." : "Guardar y Continuar"}
      </button>
    </div>
  );
};

export default UserPreferences;
