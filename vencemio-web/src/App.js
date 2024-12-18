import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./layouts/Header";
import LoginCliente from "./pages/login/LoginCliente";
import LoginSuper from "./pages/login/LoginSuper";
import RegisterUser from "./pages/register/RegisterUser";
import RegisterSuper from "./pages/register/RegisterSuper";
import SuperDashboard from "./pages/supermarketPages/SuperDashboard";
import ProductForm from "./pages/supermarketPages/ProductForm";
import ProductEditForm from "./pages/supermarketPages/ProductEditForm";
import MapScreen from "./pages/userPages/MapScreen";
import UserHome from "./pages/userPages/UserHome";
import PrincipalPageComercio from "./pages/PrincipalPageComercio";
import PrincipalPageComprador from "./pages/PrincipalPageComprador";
import FavoritesPage from "./pages/userPages/FavoritesPage";
import NotificationManager from "./pages/supermarketPages/NotificationManager";
import NotificationHistory from "./pages/supermarketPages/NotificationHistory";
import ProductStatistics from "./pages/supermarketPages/ProductStatistics";
import CompraPage from "./pages/userPages/CompraPage";
import PurchaseHistoryPage from "./pages/userPages/PurchaseHistoryPage";
import { UserProvider } from "./context/UserContext";
import { AuthProvider } from "./context/AuthContext"; // Importa AuthProvider

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/principal-comprador" />} />
            <Route path="/login" element={<LoginCliente />} />
            <Route path="/register-user" element={<RegisterUser />} />
            <Route path="/register-super" element={<RegisterSuper />} />
            <Route path="/login-super" element={<LoginSuper />} />
            <Route path="/super-dashboard" element={<SuperDashboard />} />
            <Route path="/product-form" element={<ProductForm />} />
            <Route path="/edit-product/:id" element={<ProductEditForm />} />
            <Route path="/map-screen" element={<MapScreen />} />
            <Route path="/user-home" element={<UserHome />} />
            <Route path="/principal-comercio" element={<PrincipalPageComercio />} />
            <Route path="/principal-comprador" element={<PrincipalPageComprador />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/notification-manager" element={<NotificationManager />} />
            <Route path="/notification-history" element={<NotificationHistory />} />
            <Route path="/estadisticas" element={<ProductStatistics />} />
            <Route path="/comprar/:id" element={<CompraPage />} />
            <Route path="/historial-compras" element={<PurchaseHistoryPage />} />
          </Routes>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
