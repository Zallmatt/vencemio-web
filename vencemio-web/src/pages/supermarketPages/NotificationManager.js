import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; // Suponiendo que tienes un contexto de autenticación
import './NotificationManager.css'; // Importa el CSS aquí
import { useNavigate } from "react-router-dom";


const NotificationManager = () => {
  const { superuser } = useContext(AuthContext); // Obtener datos del usuario logueado (superusuario)
  const [productos, setProductos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(''); // Almacenar el id del producto
  const [nombreProducto, setNombreProducto] = useState(''); // Almacenar el nombre del producto
  const [titulo, setTitulo] = useState('');
  const [cuerpo, setCuerpo] = useState('');
  const [dias, setDias] = useState([]);
  const [hora, setHora] = useState('');
  const [notificaciones, setNotificaciones] = useState([]); // Estado para almacenar las notificaciones
  const navigate = useNavigate();

  // Días de la semana
  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  // Obtener productos de la API, filtrados por el supermercado del superusuario
  useEffect(() => {
    const fetchProductos = async () => {
      if (superuser) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/productos/byCodSuper/${superuser.cod_super}`
          );
          setProductos(response.data);
        } catch (error) {
          console.error('Error al obtener productos:', error);
        }
      }
    };
    fetchProductos();
  }, [superuser]); // Solo vuelve a ejecutar si el superusuario cambia

  // Manejar cambios en los campos
  const handleProductoChange = (event) => {
    const productId = event.target.value; // Guardar el id del producto
    const product = productos.find(p => p.id === productId); // Buscar el producto por su id
    setSelectedProduct(productId);
    setNombreProducto(product.nombre); // Guardar el nombre del producto
  };
  const handleTituloChange = (event) => setTitulo(event.target.value);
  const handleCuerpoChange = (event) => setCuerpo(event.target.value);
  const handleHoraChange = (event) => setHora(event.target.value);

  const handleNotifications = () => {
    navigate("/notification-history");
  };

  const handleDiaToggle = (dia) => {
    if (dias.includes(dia)) {
      setDias(dias.filter((d) => d !== dia));
    } else {
      setDias([...dias, dia]);
    }
  };

  const handleSubmit = async () => {
    const nuevaNotificacion = {
      nombre_producto: nombreProducto, // Enviar el nombre del producto
      id_producto: selectedProduct, // Enviar el id del producto
      titulo,
      descripcion: cuerpo,
      dias,
      hora,
      cod_super: superuser.cod_super,
    };
    try {
      await axios.post('${process.env.REACT_APP_API_URL}/api/notificaciones/add', nuevaNotificacion);
      console.log('Notificación creada:', nuevaNotificacion);
    } catch (error) {
      console.error('Error al crear la notificación:', error);
    }
  };

  return (
    <div className="notification-manager-page">
      <div className="notification-manager-container">
        <h1 className="notification-manager-title">Gestión de Notificaciones</h1>

        {/* Formulario de notificación */}
        <form className="notification-manager-form">
          {/* Campo para seleccionar producto */}
          <FormControl fullWidth>
            <InputLabel>Seleccionar Producto</InputLabel>
            <Select value={selectedProduct} onChange={handleProductoChange}>
              {productos.map((producto) => (
                <MenuItem key={producto.id} value={producto.id}> {/* Usamos el id del producto */}
                  {producto.nombre} {/* Nombre del producto */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Campo para el título de la notificación */}
          <TextField
            label="Título de la Notificación"
            variant="outlined"
            fullWidth
            value={titulo}
            onChange={handleTituloChange}
          />

          {/* Campo para el cuerpo de la notificación */}
          <TextField
            label="Cuerpo de la Notificación"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={cuerpo}
            onChange={handleCuerpoChange}
          />

          {/* Selección de días de la semana */}
          <div className="notification-manager-checkbox-group">
            <h4>Días de la Semana</h4>
            {diasSemana.map((dia) => (
              <FormControlLabel
                key={dia}
                control={
                  <Checkbox
                    checked={dias.includes(dia)}
                    onChange={() => handleDiaToggle(dia)}
                  />
                }
                label={dia}
              />
            ))}
          </div>

          {/* Campo para seleccionar la hora */}
          <TextField
            label="Hora"
            type="time"
            variant="outlined"
            fullWidth
            value={hora}
            onChange={handleHoraChange}
            InputLabelProps={{ shrink: true }}
          />

          {/* Botón para crear la notificación */}
          <Button
            className="notification-manager-button"
            onClick={handleSubmit}
          >
            Crear Notificación
          </Button>
        </form>

        {/* Botón para ver las notificaciones */}
        <Button
          className="view-notifications-button"
          onClick={handleNotifications}
        >
          Ver Notificaciones
        </Button>
      </div>
    </div>
  );
};

export default NotificationManager;
