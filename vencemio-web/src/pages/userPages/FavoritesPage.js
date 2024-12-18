import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card/Card";
import { useUser } from "../../context/UserContext";
import "./FavoritesPage.css";

const FavoritesPage = () => {
  const { favorites, setFavorites } = useUser();
  const navigate = useNavigate();

  const handleRemoveFavorite = (product) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== product.id));
  };

  return (
    <div className="favorites-container">
      <h1>Mis Favoritos</h1>
      {favorites.length === 0 ? (
        <p className="no-favorites-message">No tienes productos en favoritos.</p>
      ) : (
        <div className="favorites-list">
          {favorites.map((product) => (
            <Card
              key={product.id}
              product={product}
              supermarket={product.supermarket}
              address={product.address}
              onFavorite={() => handleRemoveFavorite(product)}
            />
          ))}
        </div>
      )}
      <button className="back-button" onClick={() => navigate("/user-home")}>
        Volver a la Página Principal
      </button>
    </div>
  );
};

export default FavoritesPage;
