import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./ProductEditForm.css";

export default function ProductEditForm() {
  const { id } = useParams();
  const { superuser } = useContext(AuthContext); // Contexto del supermercado
  const [product, setProduct] = useState({});
  const [tiposProducto, setTiposProducto] = useState([]);
  const [fechaAviso, setFechaAviso] = useState(0); // Días de aviso
  const [tipoStats, setTipoStats] = useState({
    promedioPrecio: 0,
    promedioDescuento: 0,
    cantidadProductos: 0,
    promedioDiasAviso: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/productos/${id}`);
        const fetchedProduct = response.data;

        if (fetchedProduct.fecha_vencimiento) {
          fetchedProduct.fecha_vencimiento = fetchedProduct.fecha_vencimiento.substr(0, 10);
        }
        setProduct(fetchedProduct);

        if (fetchedProduct.fecha_avisado) {
          const avisoFecha = new Date(fetchedProduct.fecha_avisado);
          const diffInTime =
            avisoFecha.getTime() - new Date(fetchedProduct.fecha_vencimiento).getTime();
          setFechaAviso(diffInTime / (1000 * 3600 * 24));
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };

    const fetchTiposProducto = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tipos_product`);
        setTiposProducto(response.data);
      } catch (error) {
        console.error("Error al obtener tipos de producto:", error);
      }
    };

    fetchProduct();
    fetchTiposProducto();
  }, [id]);

  useEffect(() => {
    const fetchTipoStats = async () => {
      if (product.cod_tipo && superuser) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/productos/filter/${superuser.cod_super}/${product.cod_tipo}`
          );

          const productos = response.data;
          const precios = productos.map((prod) => prod.precio_descuento);
          const descuentos = productos.map((prod) => prod.porcentaje_descuento);
          const diasAviso = productos.map((prod) => prod.fecha_aviso_vencimiento);

          const promedioPrecio =
            precios.reduce((acc, price) => acc + price, 0) / precios.length || 0;
          const promedioDescuento =
            descuentos.reduce((acc, discount) => acc + discount, 0) / descuentos.length || 0;
          const promedioDiasAviso =
            diasAviso.reduce((acc, dias) => acc + dias, 0) / diasAviso.length || 0;

          setTipoStats({
            promedioPrecio,
            promedioDescuento,
            cantidadProductos: productos.length,
            promedioDiasAviso,
          });
        } catch (error) {
          console.error("Error al obtener estadísticas del tipo:", error);
        }
      }
    };

    fetchTipoStats();
  }, [product.cod_tipo, superuser]);


  // Actualización dinámica de precios y descuentos
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedProduct = { ...product, [name]: value };

    if (name === "precio") {
      const newPrice = parseFloat(value) || 0;
      updatedProduct.precio_descuento = (
        newPrice -
        (newPrice * (product.porcentaje_descuento || 0)) / 100
      ).toFixed(2);
    }

    if (name === "precio_descuento") {
      const newDiscountPrice = parseFloat(value) || 0;
      updatedProduct.porcentaje_descuento = (
        ((product.precio - newDiscountPrice) / product.precio) *
        100
      ).toFixed(2);
    }

    if (name === "porcentaje_descuento") {
      const newPercentage = parseFloat(value) || 0;
      updatedProduct.precio_descuento = (
        product.precio -
        (product.precio * newPercentage) / 100
      ).toFixed(2);
    }

    setProduct(updatedProduct);
  };
  const handleFechaAvisoChange = (e) => {
    setFechaAviso(e.target.value);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    const fechaVencimiento = new Date(product.fecha_vencimiento);
    fechaVencimiento.setDate(fechaVencimiento.getDate() - fechaAviso);

    const updatedProduct = {
      ...product,
      fecha_avisado: fechaVencimiento.toISOString(),
      fecha_aviso_vencimiento: fechaAviso,
    };

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/productos/${id}`, updatedProduct);
      alert("Producto actualizado exitosamente.");
      navigate("/super-dashboard");
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  return (
    <div className="product-edit-form-page">
      <div className="product-edit-form-container">
        <h1 className="product-edit-form-title">Editar Producto</h1>
        <div className="product-edit-main-container">
          {/* Formulario */}
          <form className="product-edit-form" onSubmit={handleUpdateProduct}>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={product.nombre || ""}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="codigo_barra"
              placeholder="Código de Barra"
              value={product.codigo_barra || ""}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="precio"
              placeholder="Precio"
              value={product.precio || ""}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="precio_descuento"
              placeholder="Precio Descuento"
              value={product.precio_descuento || ""}
              onChange={handleChange}
            />
            <input
              type="number"
              name="porcentaje_descuento"
              placeholder="Porcentaje Descuento"
              value={product.porcentaje_descuento || ""}
              onChange={handleChange}
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={product.stock || ""}
              onChange={handleChange}
              required
            />
            <label>Tipo de Producto:</label>
            <select
              name="cod_tipo"
              value={product.cod_tipo || ""}
              onChange={handleChange}
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
              name="fecha_vencimiento"
              value={product.fecha_vencimiento || ""}
              onChange={handleChange}
              required
            />
            <label>Tiempo de Aviso (días antes del vencimiento):</label>
            <input
              type="number"
              name="fecha_aviso_vencimiento"
              value={fechaAviso || ""}
              onChange={handleFechaAvisoChange}
              required
            />
            <input
              type="text"
              name="imagen"
              placeholder="URL de la Imagen"
              value={product.imagen || ""}
              onChange={handleChange}
            />
            <div className="product-edit-form-switch">
              <label>Estado:</label>
              <input
                type="checkbox"
                name="estado"
                checked={product.estado || false}
                onChange={(e) => setProduct({ ...product, estado: e.target.checked })}
              />
            </div>
            <button type="submit" className="product-edit-form-button">
              Actualizar Producto
            </button>
          </form>

          {/* Estadísticas */}
          <div className="tipo-stats">
            <h3>Estadísticas del Tipo</h3>
            <p>Precio Promedio: ${tipoStats.promedioPrecio.toFixed(2)}</p>
            <p>Descuento Promedio: {tipoStats.promedioDescuento.toFixed(2)}%</p>
            <p>Cantidad de Productos: {tipoStats.cantidadProductos}</p>
            <p>Días de Aviso: {tipoStats.promedioDiasAviso.toFixed(0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
