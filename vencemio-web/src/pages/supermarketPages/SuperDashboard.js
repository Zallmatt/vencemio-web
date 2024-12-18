import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import CardSuper from "../../components/Card/CardSuper";
import "./SuperDashboard.css";

export default function SuperDashboard() {
  const { logout, superuser } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [expiringProducts, setExpiringProducts] = useState([]); // Productos que están cerca del vencimiento
  const navigate = useNavigate();

  // Verificar autenticación
  useEffect(() => {
    if (!superuser) {
      navigate("/login-super");
    }
  }, [superuser, navigate]);

  // Fetch de productos
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/productos/byCodSuper/${superuser.cod_super}`
      );
      setProducts(response.data);
      setFilteredProducts(response.data);
      checkExpiringProducts(response.data); // Comprobar productos con vencimiento cercano
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch de categorías
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tipos_product`);
      setCategories(response.data.map((category) => category.nombre)); // Usamos "nombre" en lugar de "codigo"
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  useEffect(() => {
    if (superuser) {
      fetchProducts();
      fetchCategories();
    }
  }, [superuser]);

  // Filtrar productos por categoría
  const handleFilterCategory = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    if (category) {
      const filtered = products.filter(
        (product) =>
          product.cod_tipo?.toLowerCase().trim() === category.toLowerCase().trim()
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products); // Mostrar todos si no hay categoría seleccionada
    }
  };

  // Función para manejar la eliminación del producto// Función para manejar la eliminación del producto
  const handleDeleteProduct = async (productId) => {
    try {
      // Realizar la solicitud DELETE al backend
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/productos/${productId}`);

      // Filtrar el producto eliminado de las listas locales
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
      setFilteredProducts((prevFilteredProducts) =>
        prevFilteredProducts.filter((product) => product.id !== productId)
      );
      
      // También eliminar el producto de la lista de productos próximos a vencer
      setExpiringProducts((prevExpiringProducts) =>
        prevExpiringProducts.filter((product) => product.id !== productId)
      );

      alert("Producto eliminado exitosamente.");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Hubo un problema al eliminar el producto.");
    }
  };

  // Función para calcular productos cercanos al vencimiento
  const checkExpiringProducts = (products) => {
    const currentDate = new Date();
    const expiringSoon = products.filter((product) => {
      const avisoDate = new Date(product.fecha_avisado);
      return avisoDate <= currentDate; // Productos cuya fecha de aviso es hoy o en el pasado
    });
    setExpiringProducts(expiringSoon);
  };

  const handleAddProduct = () => {
    navigate("/product-form");
  };

  // Función para manejar la redirección a la gestión de notificaciones
  const handleGoToNotifications = () => {
    navigate("/notification-manager");
  };
  // Función para manejar la redirección a las estadísticas
  const handleGoToStatistics = () => {
    navigate("/estadisticas");
  };

  const handleLogout = () => {
    logout();
    navigate("/login-super");
  };

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard del Supermercado</h1>

     {/* Contenedor para los filtros y botones */}
     <div className="controls">
        <div className="filter-section">
          <label htmlFor="categoryFilter">Filtrar por categoría:</label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={handleFilterCategory}
            className="filter-select"
          >
            <option value="">Todas las categorías</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="action-buttons">
          <button onClick={handleAddProduct} className="add-product-button">
            Agregar Producto
          </button>
          <button onClick={handleGoToNotifications} className="notification-button">
            Notificaciones
          </button>
          <button onClick={handleGoToStatistics} className="statistics-button">
            Estadísticas
          </button>
        </div>
      </div>
      {/* Mostrar alerta para productos con vencimiento cercano */}
      {expiringProducts.length > 0 && (
        <div className="expiring-alert">
          <h2>¡Alerta de Vencimiento!</h2>
          <p>{expiringProducts.length} productos están próximos a vencer. ¡Revísalos!</p>
          <div className="expiring-product-list">
            {expiringProducts.map((product) => (
              <CardSuper
                key={product.id}
                product={product}
                onEdit={() => navigate(`/edit-product/${product.id}`)}
                onDelete={() => handleDeleteProduct(product.id)} // Llamamos a handleDeleteProduct para eliminar
              />
            ))}
          </div>
        </div>
      )}

      {/* Lista de productos */}
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <CardSuper
              key={product.id}
              product={product}
              onEdit={() => navigate(`/edit-product/${product.id}`)}
              onDelete={() => handleDeleteProduct(product.id)} // Llamamos a handleDeleteProduct para eliminar
            />
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>
      <button onClick={handleLogout} className="logout-button">
        Cerrar Sesión
      </button>
    </div>
  );
}
