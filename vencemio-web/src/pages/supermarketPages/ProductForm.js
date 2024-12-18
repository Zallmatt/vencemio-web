import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./ProductForm.css";

export default function ProductForm() {
  const { superuser } = useContext(AuthContext);
  const [nombre, setNombre] = useState("");
  const [codigoBarra, setCodigoBarra] = useState("");
  const [precio, setPrecio] = useState("");
  const [precioDescuento, setPrecioDescuento] = useState("");
  const [porcentajeDescuento, setPorcentajeDescuento] = useState("");
  const [stock, setStock] = useState("");
  const [idTipo, setIdTipo] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [fechaAvisoVencimiento, setFechaAvisoVencimiento] = useState(""); // Campo para la fecha de aviso
  const [imagenURL, setImagenURL] = useState("");
  const [estado, setEstado] = useState(true);
  const [tiposProducto, setTiposProducto] = useState([]);
  const [tipoStats, setTipoStats] = useState({
    nombre: "",
    promedioPrecio: 0,
    promedioDescuento: 0,
    cantidadProductos: 0,
    aviso_dias: 0
  });
  const [codigoBarraError, setCodigoBarraError] = useState(""); // Para almacenar el error de código de barras
  const [codigoBarraExistente, setCodigoBarraExistente] = useState(false); // Nuevo estado para saber si el código de barras ya existe
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTiposProducto = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tipos_product`);
        setTiposProducto(response.data);
      } catch (error) {
        console.error("Error al obtener tipos de producto:", error);
        alert("No se pudieron cargar los tipos de producto.");
      }
    };
    fetchTiposProducto();
  }, []);

  useEffect(() => {
    const fetchTipoStats = async () => {
      if (idTipo && superuser && tiposProducto.length > 0) {
        try {
          // Llamar a la API para obtener productos filtrados por supermercado y tipo de producto
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/productos/filter/${superuser.cod_super}/${idTipo}`
          );
  
          const productos = response.data;
  
          // Buscar el tipo de producto por cod_tipo
          const tipo = tiposProducto.find((tipo) => tipo.cod_tipo === idTipo);
          const nombre = tipo ? tipo.nombre : '';
  
          // Calcular estadísticas
          const precios = productos.map((prod) => prod.precio_descuento);
          const descuentos = productos.map((prod) => prod.porcentaje_descuento);
          const dias_aviso = productos.map((prod) => prod.fecha_aviso_vencimiento);
  
          const promedioPrecio =
            precios.reduce((acc, price) => acc + price, 0) / precios.length || 0;
          const promedioDescuento =
            descuentos.reduce((acc, discount) => acc + discount, 0) / descuentos.length || 0;
          const promedioDiasAviso =
            dias_aviso.reduce((acc, dias) => acc + dias, 0) / dias_aviso.length || 0;
  
          setTipoStats({
            nombre,
            promedioPrecio,
            promedioDescuento,
            promedioDiasAviso,
            cantidadProductos: productos.length,
          });
        } catch (error) {
          console.error("Error al obtener estadísticas del tipo:", error);
        }
      }
    };
  
    fetchTipoStats();
  }, [idTipo, superuser, tiposProducto]); // Asegúrate de incluir tiposProducto como dependencia
  
  const handlePrecioDescuentoChange = (value) => {
    setPrecioDescuento(value);
    if (precio) {
      const porcentaje = 100 - (value / precio) * 100;
      setPorcentajeDescuento(porcentaje.toFixed(2));
    }
  };

  
  const handlePorcentajeChange = (value) => {
    setPorcentajeDescuento(value);
    if (precio) {
      const nuevoPrecio = precio - (precio * value) / 100;
      setPrecioDescuento(nuevoPrecio.toFixed(2));
    }
  };

  const validateCodigoBarra = async (value) => {
    // Asegurarse de que sea un número de 13 caracteres
    const regex = /^\d{13}$/;
    if (regex.test(value)) {
      setCodigoBarra(value);
      setCodigoBarraError(""); // Limpiar error si el código es válido
      await checkCodigoBarraExistente(value); // Verificar si el código ya existe
    } else {
      setCodigoBarraError("El código de barra debe ser un número de 13 dígitos.");
      setCodigoBarraExistente(false); // Reiniciar el estado si el formato es incorrecto
    }
  };

  // Función para verificar si el código de barra ya existe
  const checkCodigoBarraExistente = async (codigo) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/productos/byCodSuper/${superuser.cod_super}`);
      const productos = response.data;

      const codigoDuplicado = productos.some((producto) => producto.codigo_barra === codigo);
      if (codigoDuplicado) {
        setCodigoBarraExistente(true); // Código de barra ya existe
        setCodigoBarraError("Este código de barra ya está registrado.");
      } else {
        setCodigoBarraExistente(false); // El código de barra no existe
        setCodigoBarraError(""); // Limpiar error si el código no existe
      }
    } catch (error) {
      console.error("Error al verificar el código de barras:", error);
      alert("No se pudo verificar el código de barra.");
    }
  };

  const handleCodigoBarraChange = (e) => {
    const value = e.target.value;

    // Solo permite números y limita la longitud a 13 caracteres
    if (/^\d*$/.test(value) && value.length <= 13) {
      setCodigoBarra(value);
      setCodigoBarraError(""); // Limpiar error mientras escribe si es válido
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const productData = {
      nombre,
      codigo_barra: codigoBarra,
      precio: parseFloat(precio),
      precio_descuento: parseFloat(precioDescuento),
      porcentaje_descuento: parseFloat(porcentajeDescuento),
      stock: parseInt(stock),
      cod_tipo: idTipo,
      cod_super: superuser.cod_super,
      estado,
      fecha_vencimiento: new Date(fechaVencimiento).toISOString(),
      fecha_aviso_vencimiento: parseInt(fechaAvisoVencimiento), // Guardamos el número de días para la alerta
      imagen: imagenURL,
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/productos/add`, productData);
      alert("Producto agregado exitosamente.");
      navigate("/super-dashboard");
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("No se pudo agregar el producto. Intenta nuevamente.");
    }
  };

  return (
    <div className="productForm-page">
      <h1 className="product-form-title">Agregar Producto</h1>
      <div className="product-form-container">
        <div className="product-form">
          <form className="product-form" onSubmit={handleAddProduct}>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Código de Barra"
              value={codigoBarra}
              onChange={handleCodigoBarraChange}
              onBlur={() => validateCodigoBarra(codigoBarra)}
              required
            />
            {codigoBarraError && <p className="error-message">{codigoBarraError}</p>}
            <input
              type="number"
              placeholder="Precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Porcentaje Descuento"
              value={porcentajeDescuento}
              onChange={(e) => handlePorcentajeChange(e.target.value)}
            />
            <input
              type="number"
              placeholder="Precio Descuento"
              value={precioDescuento}
              onChange={(e) => handlePrecioDescuentoChange(e.target.value)}
            />
            <input
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
            <label>Tipo de Producto:</label>
            <select
              value={idTipo}
              onChange={(e) => setIdTipo(e.target.value)}
              required
            >
              <option value="">Seleccione un tipo</option>
              {tiposProducto.map((tipo) => (
                <option key={tipo.id} value={tipo.nombre}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
            <label>Fecha de Vencimiento:</label>
            <input
              type="date"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
              required
            />
            <label>¿Con cuántos días de anticipación desea recibir la alerta?</label>
            <input
              type="number"
              placeholder="Días de anticipación"
              value={fechaAvisoVencimiento}
              onChange={(e) => setFechaAvisoVencimiento(e.target.value)}
              min="1"
              required
            />
            <input
              type="text"
              placeholder="URL de la Imagen"
              value={imagenURL}
              onChange={(e) => setImagenURL(e.target.value)}
            />
            <div className="product-form-switch">
              <label>Estado:</label>
              <input
                type="checkbox"
                checked={estado}
                onChange={() => setEstado(!estado)}
              />
            </div>
            <button type="submit" className="product-form-button">
              Agregar Producto
            </button>
          </form>
        </div>

        <div className="tipo-stats">
          <h3>Estadísticas del Tipo</h3>
          <p>Precio Promedio: ${tipoStats.promedioPrecio?.toFixed(2)}</p>
          <p>Descuento Promedio: {tipoStats.promedioDescuento?.toFixed(2)}%</p>
          <p>Cantidad de Productos: {tipoStats.cantidadProductos}</p>
          <p>Días de Aviso: {tipoStats.promedioDiasAviso?.toFixed(0)}</p>
        </div>
      </div>
    </div>

  );
}
