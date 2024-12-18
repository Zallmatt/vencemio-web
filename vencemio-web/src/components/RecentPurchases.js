import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import "./RecentPurchases.css";


const RecentPurchases = () => {
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const userUid = user?.uid;

  useEffect(() => {
    const fetchRecentPurchases = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/productos`);
        if (!response.ok) {
          throw new Error("Error al obtener las compras recientes.");
        }
        const data = await response.json();
        setRecentPurchases(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userUid) {
      fetchRecentPurchases();
    }
  }, [userUid]);

  if (loading) {
    return <p className="loading">Cargando tus compras recientes...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (recentPurchases.length === 0) {
    return <p className="no-purchases">No tienes compras recientes.</p>;
  }

  return (
    <div className="recent-purchases">
      <h2>Tus Compras Recientes</h2>
      <div className="purchase-list">
        {recentPurchases.map((purchase) => (
          <div key={purchase.id} className="purchase-item">
            <p><strong>Producto:</strong> {purchase.producto_id}</p>
            <p><strong>Cantidad:</strong> {purchase.cantidad}</p>
            <p className="total"><strong>Total:</strong> ${purchase.total.toFixed(2)}</p>
            <p><strong>Fecha:</strong> {new Date(purchase.fecha).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
      <Link to="/historial-compras" className="view-all">
        Ver todo el historial
      </Link>
    </div>
  );
};

export default RecentPurchases;
