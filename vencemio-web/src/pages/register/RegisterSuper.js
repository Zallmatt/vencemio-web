import React, { useState } from "react";
import axios from "axios";
import "./RegisterSuper.css"; // Archivo CSS para estilos

function RegisterSuper() {
  const [name, setName] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [provincia, setProvincia] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [ubicacion, setUbicacion] = useState({ latitud: "", longitud: "" });
  const [codSuper, setCodSuper] = useState(""); // Estado para cod_super

  // Generar cod_super dinámicamente
  const generateCodSuper = (cadena, direccion) => {
    if (cadena && direccion) {
      const cod = `${cadena.replace(/\s+/g, "").toLowerCase()}${direccion.replace(/\s+/g, "").toLowerCase()}`;
      setCodSuper(cod);
    } else {
      setCodSuper("");
    }
  };

  // Actualizar cod_super cuando cambien name o direccion
  const handleNameChange = (e) => {
    setName(e.target.value);
    generateCodSuper(e.target.value, direccion);
  };

  const handleDireccionChange = (e) => {
    setDireccion(e.target.value);
    generateCodSuper(name, e.target.value);
  };

  const getCoordinates = async () => {
    const address = `${direccion}, ${ciudad}, ${provincia}`;
    console.log(`Solicitando coordenadas para: ${address}`);
  
    try {
      // Solicitud al backend
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/google/geocode`, {
        params: { address },
      });
  
      setUbicacion({
        latitud: response.data.lat,
        longitud: response.data.lng,
      });
  
      alert(`Ubicación obtenida: Latitud: ${response.data.lat}, Longitud: ${response.data.lng}`);
    } catch (error) {
      console.error("Error obteniendo coordenadas:", error);
      alert("Hubo un problema al obtener la ubicación.");
    }
  };
  

  const handleRegister = async () => {
    try {
      if (!name || !direccion || !ciudad || !provincia || !email || !password) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
      }

      if (!ubicacion.latitud || !ubicacion.longitud) {
        alert("Por favor, obtén las coordenadas antes de registrar el supermercado.");
        return;
      }

      const data = {
        cadena: name,
        direccion,
        ciudad,
        provincia,
        email,
        telefono,
        ubicacion,
        estado: true,
        fecha_registro: new Date().toISOString(),
        password,
        cod_super: codSuper, // Enviar cod_super al backend
      };

      console.log("Datos enviados:", data);

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/superusers/register`, data);

      if (response.status === 201) {
        alert(`Supermercado registrado exitosamente con ID: ${response.data.id}`);
        setName("");
        setDireccion("");
        setCiudad("");
        setProvincia("");
        setEmail("");
        setTelefono("");
        setPassword("");
        setUbicacion({ latitud: "", longitud: "" });
        setCodSuper(""); // Limpiar cod_super
      } else {
        alert(response.data.message || "No se pudo registrar el supermercado.");
      }
    } catch (error) {
      console.error("Error al registrar supermercado:", error);
      alert("Hubo un problema al registrar el supermercado.");
    }
  };

  return (
    <div className="register-super-page">
      <div className="register-super-container">
        <h1 className="register-super-title">Registrar Supermercado</h1>
        <form
          className="register-super-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <label>Información Básica</label>
          <input
            type="text"
            placeholder="Nombre de la cadena"
            value={name}
            onChange={handleNameChange}
            required
          />
          <input
            type="text"
            placeholder="Provincia"
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Dirección"
            value={direccion}
            onChange={handleDireccionChange}
            required
          />
          <label>Datos de Contacto</label>
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p>
            Código Super: <strong>{codSuper || "N/A"}</strong>
          </p>
          <label>Ubicación</label>
          <button
            type="button"
            onClick={getCoordinates}
            className="get-coordinates-button"
          >
            Obtener Ubicación
          </button>
          <p className="lat-long-display">
            Latitud: {ubicacion.latitud || "N/A"}, Longitud: {ubicacion.longitud || "N/A"}
          </p>
          <button type="submit" className="register-button">
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterSuper;
