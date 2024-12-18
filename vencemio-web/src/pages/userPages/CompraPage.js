import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { jsPDF } from "jspdf";
import "./CompraPage.css";


const CompraPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [superuserDetails, setSuperuserDetails] = useState(null);
  const [userData, setUserData] = useState(null);

  const { user, isAuthenticated } = useUser();
  const userUid = user?.uid;

  useEffect(() => {
    const fetchProductAndUser = async () => {
      try {
        // Obtener datos del producto
        const productResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/productos/${id}`);
        if (!productResponse.ok) {
          throw new Error('Error al obtener el producto');
        }
        const productData = await productResponse.json();
        setProduct(productData);
  
        // Obtener detalles del supermercado
        const superuserResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/superusers/cod_super/${productData.cod_super}`
        );
        if (superuserResponse.ok) {
          const superuserData = await superuserResponse.json();
          setSuperuserDetails(superuserData);
        }
  
        // Obtener datos del usuario
        if (userUid) {
          const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/users/uid/${userUid}`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUserData(userData); // Guardar datos del usuario en el estado
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProductAndUser();
  }, [id, userUid]);
  

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0 && value <= product.stock) {
      setCantidad(value);
    } else if (value > product.stock) {
      alert("La cantidad no puede superar el stock disponible.");
    }
  };

  const handleBuy = async () => {
    if (!product || cantidad <= 0 || cantidad > product.stock) {
      alert("Por favor selecciona una cantidad válida.");
      return;
    }
  
    setIsProcessing(true);
    try {
      const orderData = {
        cantidad,
        producto_id: id,
        user_id: userUid,
        forma_pago: "Efectivo",
      };
  
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ventas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) throw new Error("Error al procesar la compra.");
  
      const data = await response.json();
      const orderNumber = data.numero_orden;
  
      // Calcular total
      const total = parseFloat(product.precio_descuento) * cantidad;
  
      // Actualizar el stock localmente
      setProduct((prev) => ({ ...prev, stock: prev.stock - cantidad }));
  
      alert(`¡Compra exitosa! Número de orden: ${orderNumber}`);
  
      // Generar PDF
      generatePDF(orderData, total, orderNumber, userData?.nombre, superuserDetails);
    } catch (err) {
      console.error(err.message);
      alert("Hubo un error al procesar la compra.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  
  const fetchUpdatedProduct = async () => {
    try {
      const productResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/productos/${id}`);
      if (!productResponse.ok) {
        throw new Error("Error al obtener el producto actualizado");
      }
      const updatedProduct = await productResponse.json();
      setProduct(updatedProduct); // Actualiza el estado del producto
    } catch (err) {
      console.error("Error al actualizar los datos del producto:", err);
    }
  };


  const generatePDF = (orderData, total, orderNumber, buyerName = "N/A", superuser = {}) => {
    const doc = new jsPDF();
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Orden de Compra", 105, 20, { align: "center" });
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Tienda: ${superuser.cadena || "N/A"}`, 20, 35);
    doc.text(`Dirección: ${superuser.direccion || "N/A"}`, 20, 42);
    doc.text(`Teléfono: ${superuser.telefono || "N/A"}`, 20, 49);
    doc.text(`Número de Orden: ${orderNumber}`, 20, 56);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 63);
  
    doc.line(20, 68, 190, 68);
  
    doc.setFont("helvetica", "bold");
    doc.text("Datos del Comprador:", 20, 77);
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${buyerName}`, 20, 85);
  
    doc.line(20, 90, 190, 90);
  
    doc.setFont("helvetica", "bold");
    doc.text("Detalles de la Compra:", 20, 99);
    doc.setFont("helvetica", "normal");
    doc.text(`Producto: ${product.nombre || "N/A"}`, 20, 107);
    doc.text(`Cantidad: ${orderData.cantidad}`, 20, 114);
    doc.text(`Precio unitario: $${parseFloat(product.precio_descuento).toFixed(2)}`, 20, 121);
    doc.text(`Total: $${total.toFixed(2)}`, 20, 128);
  
    doc.line(20, 133, 190, 133);
  
    doc.setFont("helvetica", "bold");
    doc.text("Forma de Pago:", 20, 142);
    doc.setFont("helvetica", "normal");
    doc.text(`Método: ${orderData.forma_pago || "N/A"}`, 20, 150);
  
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100);
    doc.text("Gracias por su compra. Guarde esta orden como comprobante.", 20, 170);
  
    doc.save(`orden_compra_${orderNumber}.pdf`);
  };
  
  

  if (loading) {
    return <p className="loading">Cargando detalles del producto...</p>;
  }

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  return (
    <div className="compra-page">
      <h1 className="compra-title">Compra del Producto</h1>
      {product ? (
        <div className="product-container">
          <img
            src={product.imagen || "/default-image.jpg"}
            alt={product.nombre}
            className="product-image"
          />
          <div className="product-details">
            <h2 className="product-name">{product.nombre}</h2>
            <p className="product-price">
              Precio unitario: <span>${product.precio.toFixed(2)}</span>
            </p>
            <p className="product-discount-price">
              Precio con descuento: <span>${product.precio_descuento.toFixed(2)}</span>
            </p>

            {/* Información del supermercado */}
            {superuserDetails && (
              <div className="superuser-details">
                <p><strong>Supermercado:</strong> {superuserDetails.cadena}</p>
                <p><strong>Dirección:</strong> {superuserDetails.direccion}</p>
              </div>
            )}

            <div className="product-quantity">
              <label htmlFor="cantidad">Cantidad:</label>
              <input
                type="number"
                id="cantidad"
                value={cantidad}
                onChange={handleCantidadChange}
                min="1"
              />
            </div>
            <p className="product-stock">Stock disponible: {product.stock}</p>
            <p className="product-total">
              Total: <span>${(product.precio_descuento * cantidad).toFixed(2)}</span>
            </p>
            <button
              className="buy-button"
              onClick={handleBuy}
              disabled={isProcessing || cantidad <= 0 || cantidad > product.stock}
            >
              {isProcessing ? "Procesando..." : "Proceder con la compra"}
            </button>
          </div>
        </div>
      ) : (
        <p className="not-found">Producto no encontrado.</p>
      )}
    </div>
  );
};

export default CompraPage;
