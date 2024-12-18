import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { jsPDF } from "jspdf";
import "./PurchaseHistoryPage.css";

const PurchaseHistoryPage = () => {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [products, setProducts] = useState({});
  const [supermarkets, setSupermarkets] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [userName, setUserName] = useState(""); // Nuevo estado para el nombre del comprador

  const { user } = useUser();
  const userUid = user?.uid;

  useEffect(() => {
    const fetchData = async () => {
      if (!userUid) {
        setError("Usuario no autenticado.");
        setLoading(false);
        return;
      }
  
      try {
        const [historyRes, productsRes, supermarketsRes, userRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/api/ventas/history/${userUid}`),
          fetch(`${process.env.REACT_APP_API_URL}/api/productos`),
          fetch(`${process.env.REACT_APP_API_URL}/api/superusers`),
          fetch(`${process.env.REACT_APP_API_URL}/api/users/uid/${userUid}`), // Nueva llamada para el nombre del usuario
        ]);
  
        if (!historyRes.ok || !productsRes.ok || !supermarketsRes.ok || !userRes.ok) {
          throw new Error("Error al obtener los datos.");
        }
  
        const [historyData, productsData, supermarketsData, userData] = await Promise.all([
          historyRes.json(),
          productsRes.json(),
          supermarketsRes.json(),
          userRes.json(),
        ]);
  
        setPurchaseHistory(historyData);
        setFilteredHistory(historyData);
  
        const productMap = {};
        productsData.forEach((product) => {
          productMap[product.id] = {
            nombre: product.nombre,
            imagen: product.imagen,
            precio_descuento: product.precio_descuento,
          };
        });
        setProducts(productMap);
  
        const supermarketMap = {};
        supermarketsData.forEach((supermarket) => {
          supermarketMap[supermarket.cod_super] = {
            cadena: supermarket.cadena,
            direccion: supermarket.direccion,
          };
        });
        setSupermarkets(supermarketMap);
  
        setUserName(`${userData.nombre} ${userData.apellido}`); // Guardar el nombre completo del usuario
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [userUid]);

  // Función para generar el PDF
  const generatePDF = (purchase, product, supermarket, buyerName = "N/A") => {
    const total = parseFloat(purchase.total);
    const doc = new jsPDF();
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Orden de Compra", 105, 20, { align: "center" });
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Tienda: ${supermarket.cadena || "N/A"}`, 20, 35);
    doc.text(`Dirección: ${supermarket.direccion || "N/A"}`, 20, 42);
    doc.text(`Número de Orden: ${purchase.numero_orden}`, 20, 49);
    doc.text(`Fecha: ${new Date(purchase.fecha).toLocaleDateString()}`, 20, 56);
  
    doc.line(20, 62, 190, 62);
  
    doc.setFont("helvetica", "bold");
    doc.text("Datos del Comprador:", 20, 70);
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${buyerName}`, 20, 78);
  
    doc.line(20, 84, 190, 84);
  
    doc.setFont("helvetica", "bold");
    doc.text("Detalles de la Compra:", 20, 92);
    doc.setFont("helvetica", "normal");
    doc.text(`Producto: ${product.nombre || "N/A"}`, 20, 100);
    doc.text(`Cantidad: ${purchase.cantidad}`, 20, 108);
    doc.text(`Precio unitario: $${product.precio_descuento.toFixed(2)}`, 20, 116);
    doc.text(`Total: $${total.toFixed(2)}`, 20, 124);
  
    doc.line(20, 130, 190, 130);
  
    doc.setFont("helvetica", "bold");
    doc.text("Forma de Pago:", 20, 138);
    doc.setFont("helvetica", "normal");
    doc.text(`Método: ${purchase.forma_pago || "N/A"}`, 20, 146);
  
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100);
    doc.text("Gracias por su compra. Guarde esta orden como comprobante.", 20, 160);
  
    doc.save(`orden_compra_${purchase.numero_orden}.pdf`);
  };
  

  if (loading) return <p className="loading">Cargando historial de compras...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="purchase-history-page">
      <h1 className="page-title">Historial de Compras</h1>
  
      {/* Contenedor de compras */}
      <div className="purchase-container">
        {filteredHistory.map((purchase) => {
          const product = products[purchase.producto_id] || {};
          const supermarket = supermarkets[purchase.cod_super] || {};
  
          return (
            <div key={purchase.id} className="purchase-card small-card">
              <img
                src={product.imagen || "default-placeholder.png"}
                alt={product.nombre || "Producto"}
                className="purchase-image"
              />
              <div className="purchase-details">
                <h3 className="product-name">{product.nombre || "Producto desconocido"}</h3>
                <p>
                  <strong>Número de Orden:</strong> {purchase.numero_orden}
                </p>
                <p>
                  <strong>Supermercado:</strong> {supermarket.cadena || "Desconocido"}
                </p>
                <p>
                  <strong>Dirección:</strong> {supermarket.direccion || "N/A"}
                </p>
                <p>
                  <strong>Cantidad:</strong> {purchase.cantidad}
                </p>
                <p>
                  <strong>Total:</strong> ${purchase.total.toFixed(2)}
                </p>
                <p>
                  <strong>Fecha:</strong> {new Date(purchase.fecha).toLocaleDateString()}
                </p>
                <div className="button-container">
                  <button className="download-button" onClick={() => generatePDF(purchase, product, supermarket)}>
                    Descargar Comprobante
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );  
};

export default PurchaseHistoryPage;
