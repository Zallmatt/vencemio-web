import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Card.css";

const Card = ({
  product,
  supermarket,
  address,
  onClick,
  onFavorite,
  initialFavoriteState,
}) => {
  const {
    nombre,
    precio,
    precio_descuento,
    porcentaje_descuento,
    fecha_vencimiento,
    imagen,
    stock,
    id,
  } = product;

  // Estado local para favorito
  const [isFavorite, setIsFavorite] = useState(initialFavoriteState);
  const navigate = useNavigate();

  // Función para manejar la acción de "Comprar"
  const handleBuyClick = () => {
    navigate(`/comprar/${id}`);
  };

  // Función para manejar el favorito
  const handleFavoriteClick = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    if (onFavorite) onFavorite(product, newFavoriteState);
  };

  // Función para calcular días restantes ajustados a UTC
  const calculateRemainingDays = (fecha_vencimiento) => {
    const [year, month, day] = fecha_vencimiento.split("-");
    const expirationUTC = Date.UTC(year, month - 1, day);
    const today = new Date();
    const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

    const diffTime = expirationUTC - todayUTC;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const remainingDays = calculateRemainingDays(fecha_vencimiento);

  // Función para formatear la fecha a DD/MM/YYYY
  const formatDateToUTC = (fecha_vencimiento) => {
    const [year, month, day] = fecha_vencimiento.split("-");
    return `${day}/${month}/${year}`;
  };

  // Redondear precios a 2 decimales
  const formattedPrecio = precio ? parseFloat(precio).toFixed(2) : "0.00";
  const formattedPrecioDescuento = precio_descuento
    ? parseFloat(precio_descuento).toFixed(2)
    : "0.00";

  // Formateo del stock
  const formattedStock = stock ? `Stock: ${stock}` : "Sin stock disponible";

  return (
    <div className="card">
      {/* Badge de descuento */}
      <div className="card-discount-badge">
        {Math.round(porcentaje_descuento)}% OFF
      </div>

      {/* Imagen */}
      <img
        src={imagen || "/default-image.jpg"}
        alt={nombre}
        className="card-image"
      />

      {/* Título */}
      <h3 className="card-title">{nombre}</h3>

      {/* Ubicación */}
      <p className="card-address">
        📍 {supermarket} - {address}
      </p>

      {/* Precios */}
      <div className="card-prices">
        <p className="card-original-price">${formattedPrecio}</p>
        <p className="card-discounted-price">${formattedPrecioDescuento}</p>
      </div>

      {/* Fecha de vencimiento */}
      <p
        className="card-expiration"
        title={`Fecha de vencimiento: ${formatDateToUTC(fecha_vencimiento)}`}
      >
        vto - {formatDateToUTC(fecha_vencimiento)} ({remainingDays} días restantes)
      </p>

      {/* Stock */}
      <p className="card-stock">{formattedStock}</p>

      {/* Acciones */}
      <div className="card-actions">
        <button
          className={`favorite-button ${isFavorite ? "favorited" : ""}`}
          onClick={handleFavoriteClick}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
        <button className="buy-button" onClick={handleBuyClick}>
          Comprar
        </button>
      </div>
    </div>
  );
};

export default Card;
