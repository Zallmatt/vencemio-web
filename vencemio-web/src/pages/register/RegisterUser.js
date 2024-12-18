import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Navegación
import "./RegisterUser.css"; // Estilos

function RegisterPage() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!name || !lastName || !email || !password) {
      alert("Por favor, completa todos los campos");
      return;
    }

    if (!email.includes("@")) {
      alert("Por favor, ingresa un correo válido");
      return;
    }

    try {
      // Hacer la solicitud a la API
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: name,
          apellido: lastName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registro exitoso");
        navigate("/login"); // Redirige al login tras el registro
      } else {
        alert(data.message || "Hubo un problema al registrarse");
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Ocurrió un error en el servidor. Intenta nuevamente.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1 className="register-title">Crea tu Cuenta</h1>
        <form onSubmit={handleRegister} className="register-form">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingresa tu nombre"
          />
          <label htmlFor="lastName">Apellido</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Ingresa tu apellido"
          />
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo"
          />
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Crea una contraseña"
          />
          <button type="submit" className="register-button">
            Registrarse
          </button>
        </form>
        <button className="login-button" onClick={() => navigate("/login")}>
          Ya tienes una cuenta? Inicia sesión
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;
