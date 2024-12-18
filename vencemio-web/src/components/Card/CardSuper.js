import React from "react";
import "./CardSuper.css";

const CardSuper = ({ product, onEdit, onDelete }) => {
  const {
    nombre,
    precio,
    precio_descuento,
    porcentaje_descuento,
    fecha_vencimiento,
    imagen,
    stock,
  } = product;

  // Función para calcular días restantes ajustando fechas a UTC
  const calculateRemainingDays = (fecha_vencimiento) => {
    const [year, month, day] = fecha_vencimiento.split("-"); // Extraer componentes de la fecha
    const expirationUTC = Date.UTC(year, month - 1, day); // Crear fecha en UTC (meses son 0-indexados)
    
    const today = new Date();
    const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

    const diffTime = expirationUTC - todayUTC; // Diferencia en milisegundos
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const remainingDays = calculateRemainingDays(fecha_vencimiento);

  // Función para formatear la fecha en UTC sin desfase
  const formatDateToUTC = (fecha_vencimiento) => {
    const [year, month, day] = fecha_vencimiento.split("-");
    return `${day}/${month}/${year}`; // Formato DD/MM/YYYY
  };

  // Definir el mensaje de stock
  const stockMessage = stock > 0 ? `En stock: ${stock} unidades` : "Agotado";

  // Redondear los precios a 2 decimales
  const formattedPrecio = precio ? parseFloat(precio).toFixed(2) : "0.00";
  const formattedPrecioDescuento = precio_descuento
    ? parseFloat(precio_descuento).toFixed(2)
    : "0.00";

  // Estilización condicional para el stock
  const stockClass = stock > 0 ? "in-stock" : "out-of-stock";

  return (
    <div className="card">
      {/* Badge de descuento */}
      <div className="card-discount-badge">
        {Math.round(porcentaje_descuento)}% OFF
      </div>

      {/* Imagen del producto */}
      <img
        src={imagen || "/default-image.jpg"}
        alt={nombre}
        className="card-image"
      />

      {/* Título del producto */}
      <h3 className="card-title">{nombre}</h3>

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

      {/* Mostrar el stock con estilización condicional */}
      <p className={`card-stock ${stockClass}`}>{stockMessage}</p>

      {/* Acciones: Editar y Eliminar */}
      <div className="card-actions">
        <button className="edit-button" onClick={onEdit}>
          Editar
        </button>
        <button className="delete-button" onClick={onDelete}>
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default CardSuper;
