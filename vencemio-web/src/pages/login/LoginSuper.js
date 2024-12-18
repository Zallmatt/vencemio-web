import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Usar AuthContext
import "./LoginSuper.css";

function LoginSuper() {
  const { loginSuper } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login-super`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        loginSuper(data.super, data.token); // Inicializa el contexto del supermercado
        alert("Inicio de sesión exitoso");
        navigate("/super-dashboard");
      } else {
        alert(data.message || "Credenciales inválidas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Hubo un problema con el inicio de sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-super">
      <div className="login-super-container">
        <h1 className="login-title">Iniciar Sesión - Supermercado</h1>
        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingrese su correo"
            required
          />
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
            required
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>
        <button
          className="register-button"
          onClick={() => navigate("/register-super")} // Navega a la página de registro
        >
          ¿No tienes cuenta? Crear cuenta
        </button>
      </div>
    </div>
  );
}

export default LoginSuper;
