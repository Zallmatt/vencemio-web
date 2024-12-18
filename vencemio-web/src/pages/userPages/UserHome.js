import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../../components/Card/Card";
import RecentPurchases from "../../components/RecentPurchases";
import UserPreferences from "./UserPreferences";

import { useUser } from "../../context/UserContext";
import "./UserHome.css";

export default function UserHome() {
  const { user } = useUser(); // Obtener el usuario desde el contexto
  const [favorites, setFavorites] = useState([]); // Para almacenar los favoritos del usuario
  const [products, setProducts] = useState([]); // Todos los productos
  const [supermarkets, setSupermarkets] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedSuper, setSelectedSuper] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchName, setSearchName] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [nearbyProducts, setNearbyProducts] = useState([]); // Productos más cercanos
  const [productsBySupermarket, setProductsBySupermarket] = useState({});
  const [userPreferences, setUserPreferences] = useState([]); // Preferencias del usuario
  const navigate = useNavigate();
  const [showPreferences, setShowPreferences] = useState(false);

  const userUid = user?.uid; // Obtener el `uid` desde el contexto de usuario
  // Navegación al historial de compras
  const handleGoToHistory = () => {
    navigate("/historial-compras"); // Asegúrate que esta ruta exista en tu Router
  };

  // Función para cargar los scripts de Botpress
  useEffect(() => {
    const loadBotpressScripts = () => {
      // Script para el widget de Botpress
      const script1 = document.createElement("script");
      script1.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
      script1.async = true;
      document.body.appendChild(script1);

      // Script personalizado del bot
      const script2 = document.createElement("script");
      script2.src = "https://files.bpcontent.cloud/2024/12/11/17/20241211171207-TCRRU825.js";
      script2.async = true;
      document.body.appendChild(script2);

      return () => {
        // Limpieza al desmontar el componente
        document.body.removeChild(script1);
        document.body.removeChild(script2);
      };
    };

    loadBotpressScripts();
  }, []);
  
  // Función para obtener la distancia entre dos coordenadas
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Obtener la ubicación actual del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoadingLocation(false); // Ubicación obtenida
        },
        (err) => {
          console.error("Error al obtener la ubicación actual:", err);
          setIsLoadingLocation(false); // Si no se obtiene ubicación, dejamos de mostrar el loading
        }
      );
    } else {
      console.error("Geolocalización no soportada por este navegador.");
      setIsLoadingLocation(false); // Si geolocalización no está soportada
    }
  }, []);

  // Retrasar la carga de productos para esperar por la ubicación
  useEffect(() => {
    if (!isLoadingLocation) {
      setTimeout(() => {
        setShowLoadingScreen(false); // Después de 3 segundos, mostramos la pantalla de productos
      }, 3000);
    }
  }, [isLoadingLocation]);

  // Fetch de filtros y preferencias
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const superResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/superusers`);
        const superData = superResponse.data.reduce((acc, supermarket) => {
          acc[supermarket.cod_super] = {
            cadena: supermarket.cadena,
            direccion: `${supermarket.direccion}, ${supermarket.ciudad}, ${supermarket.provincia}`,
            lat: supermarket.ubicacion.latitud,
            lng: supermarket.ubicacion.longitud,
          };
          return acc;
        }, {});
        setSupermarkets(superData);

        const categoryResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/tipos_product`);
        const categoryData = categoryResponse.data.map((category) => category.nombre);
        setCategories(categoryData);

        // Verifica que el userUid esté disponible
        console.log("userUid:", userUid);

        // Obtener las preferencias del usuario solo si userUid está presente
        if (userUid) {
          const prefResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/preferences/${userUid}`);
          console.log("Preferencias del usuario:", prefResponse.data.preferences);
          setUserPreferences(prefResponse.data.preferences); // Guardar preferencias
        } else {
          console.log("No se encuentra userUid.");
        }

      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, [userUid]);

  const fetchProducts = useCallback(async () => {
    if (!currentLocation) return;
  
    try {
      let url = `${process.env.REACT_APP_API_URL}/api/productos`;
      if (selectedSuper && selectedCategory) {
        url = `${process.env.REACT_APP_API_URL}/api/productos/filter/${selectedSuper}/${selectedCategory}`;
      } else if (selectedSuper) {
        url = `${process.env.REACT_APP_API_URL}/api/productos/byCodSuper/${selectedSuper}`;
      } else if (selectedCategory) {
        url = `${process.env.REACT_APP_API_URL}/api/productos/byCategory/${selectedCategory}`;
      }
  
      const response = await axios.get(url);
      let fetchedProducts = response.data;
  
      // Filtrar productos no vencidos
      const today = new Date();
      fetchedProducts = fetchedProducts.filter((product) => {
        const expirationDate = new Date(product.fecha_vencimiento);
        return expirationDate >= today; // Solo productos con fecha >= hoy
      });
  
      // Ordenar los productos por proximidad
      fetchedProducts.sort((a, b) => {
        const superA = supermarkets[a.cod_super];
        const superB = supermarkets[b.cod_super];
        const distanceA = calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          superA.lat,
          superA.lng
        );
        const distanceB = calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          superB.lat,
          superB.lng
        );
        return distanceA - distanceB;
      });
  
      // Filtrar por nombre si hay algo escrito en searchName
      if (searchName) {
        fetchedProducts = fetchedProducts.filter((product) =>
          product.nombre.toLowerCase().includes(searchName.toLowerCase())
        );
      }
  
      // Agrupar los productos por supermercado
      const sortedBySupermarket = fetchedProducts.reduce((acc, product) => {
        const supermarket = supermarkets[product.cod_super]?.cadena || "Desconocido";
        if (!acc[supermarket]) acc[supermarket] = [];
        acc[supermarket].push(product);
        return acc;
      }, {});
  
      // Setear los productos
      setProducts(fetchedProducts);
      setNearbyProducts(fetchedProducts); // Productos más cercanos
      setProductsBySupermarket(sortedBySupermarket); // Productos agrupados por supermercado
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [selectedSuper, selectedCategory, searchName, currentLocation, supermarkets, userPreferences]);
  

  useEffect(() => {
    if (!isLoadingLocation && currentLocation) {
      fetchProducts();
    }
  }, [isLoadingLocation, fetchProducts, currentLocation]);

  // Filtrar productos para la sección de preferencias
  const filteredProductsByPreferences = products.filter((product) =>
    userPreferences.includes(product.cod_tipo)
  );

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/favorites/${userUid}`);
      console.log("Favoritos recibidos:", response.data); // Ver los favoritos que recibimos
      
      const today = new Date(); // Fecha actual
  
      // Filtrar productos no vencidos
      const validFavorites = response.data.filter((product) => {
        const expirationDate = new Date(product.fecha_vencimiento);
        return expirationDate >= today; // Solo productos con fecha >= hoy
      });
  
      setFavorites(validFavorites); // Actualiza el estado de favoritos
    } catch (error) {
      console.error("Error al obtener los favoritos:", error);
    }
  };
  

  useEffect(() => {
    if (userUid) {
      fetchFavorites();  // Llamar a la función solo cuando `userUid` esté disponible
    }
  }, [userUid]);  // El useEffect se dispara cuando el `userUid` cambia
  
  const handleFavoriteToggle = async (product, isFavorite) => {
    if (!user || !user.uid) {
      console.error("Error: El usuario no está definido.");
      return;
    }
  
    if (!product || !product.id) {
      console.error("Error: El producto no tiene un ID válido.");
      return;
    }
  
    try {
      if (isFavorite) {
        // Agregar a favoritos
        await axios.post(`${process.env.REACT_APP_API_URL}/api/favorites/add`, {
          userUid: user.uid,  // Usamos el UID del usuario
          productId: product.id,  // El ID del producto
        });
        setFavorites((prev) => [...prev, product]); // Actualiza el estado local de favoritos
      } else {
        // Eliminar de favoritos
        await axios.post(`${process.env.REACT_APP_API_URL}/api/favorites/remove`, {
          userUid: user.uid,
          productId: product.id,
        });
        setFavorites((prev) => prev.filter((fav) => fav.id !== product.id)); // Elimina del estado local de favoritos
      }
    } catch (error) {
      console.error("Error al manejar favoritos:", error);
    }
  };

  const handleGoToMap = () => {
    navigate("/map-screen");
  };

  return (
    <div className="user-home-container">
      <h1>Productos en descuento</h1>

      {showLoadingScreen ? (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Cargando ubicación...</p>
        </div>
      ) : (
        <>
          {/* Barra de Filtros */}
          <div className="filters">
            <div>
              <label htmlFor="supermarket">Filtrar por Supermercado:</label>
              <select
                id="supermarket"
                value={selectedSuper}
                onChange={(e) => setSelectedSuper(e.target.value)}
              >
                <option value="">Todos los supermercados</option>
                {Object.entries(supermarkets).map(([codSuper, data]) => (
                  <option key={codSuper} value={codSuper}>
                    {data.cadena}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="category">Filtrar por Categoría:</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="searchName">Buscar por Nombre:</label>
              <input
                type="text"
                id="searchName"
                placeholder="Buscar producto..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            <div>
              {/* Nuevo botón para el historial de compras */}
              <button onClick={handleGoToHistory} className="btn-history">
                Historial de Compras
              </button>
              <button onClick={() => setShowPreferences(true)} className="btn-edit-preferences">
                Editar Preferencias
              </button>

              {showPreferences && user?.uid && (
                <UserPreferences
                  userId={user.uid} // Pasar el UID del usuario
                  onClose={() => setShowPreferences(false)} // Cerrar la página
                />
              )}

              {showPreferences && !user?.uid && (
                <div>Cargando preferencias...</div>
              )}
            </div>

            <button onClick={handleGoToMap} className="mapa-button">
              Ver mapa
            </button>
          </div>
          <div className="favorites-section">
            <h2>Mis Favoritos</h2>
            <div className="product-list">
              {favorites.length > 0 ? (
                favorites.map((favorite) => (
                  <Card
                    key={favorite.id}
                    product={favorite}  // Usamos el producto completo
                    supermarket={supermarkets[favorite.cod_super]?.cadena || "N/A"}
                    address={supermarkets[favorite.cod_super]?.direccion || "N/A"}
                    onFavorite={handleFavoriteToggle}
                    initialFavoriteState={true} // Siempre favorito
                  />
                ))
              ) : (
                <p>No tienes productos en tus favoritos.</p>
              )}
            </div>
          </div>
          {/* Sección de productos según preferencias */}
          <div className="preferred-products">
            <h2>Productos según tus preferencias</h2>
            <div className="product-list">
              {filteredProductsByPreferences.length > 0 ? (
                filteredProductsByPreferences.map((product) => (
                  <Card
                    key={product.id}
                    product={product}
                    supermarket={supermarkets[product.cod_super]?.cadena || "N/A"}
                    address={supermarkets[product.cod_super]?.direccion || "N/A"}
                    onFavorite={handleFavoriteToggle}
                    initialFavoriteState={favorites.some(fav => fav.id === product.id)} // Mostrar el estado de favorito
                    />
                ))
              ) : (
                <p>No hay productos que coincidan con tus preferencias.</p>
              )}
            </div>
          </div>
          
          {/* Sección de productos más cercanos */}
          <div className="nearby-products">
            <h2>Productos más cercanos</h2>
            <div className="product-list">
              {nearbyProducts.map((product) => (
                <Card
                  key={product.id}
                  product={product}
                  supermarket={supermarkets[product.cod_super]?.cadena || "N/A"}
                  address={supermarkets[product.cod_super]?.direccion || "N/A"}
                  onFavorite={handleFavoriteToggle}
                  initialFavoriteState={favorites.some(fav => fav.id === product.id)} // Mostrar el estado de favorito
                />
              ))}
            </div>
          </div>

          {/* Sección de productos por supermercado */}
          <div className="products-by-supermarket">
            <h2>Productos por Supermercado</h2>
            {Object.entries(productsBySupermarket).map(([supermarket, products]) => (
              <div key={supermarket}>
                <h3>{supermarket}</h3>
                <div className="product-list">
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      product={product}
                      supermarket={supermarkets[product.cod_super]?.cadena || "N/A"}
                      address={supermarkets[product.cod_super]?.direccion || "N/A"}
                      onFavorite={handleFavoriteToggle}
                      initialFavoriteState={favorites.some(fav => fav.id === product.id)} // Mostrar el estado de favorito
                      />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
