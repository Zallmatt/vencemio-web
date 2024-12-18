import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; // Si usas contexto para obtener el supermercado
import { Button } from '@mui/material'; // Usaremos Material UI para algunos botones y estilo
import './NotificationHistory.css'; // Estilos específicos de esta página
import { useNavigate } from 'react-router-dom';

const NotificationHistory = () => {
  const { superuser } = useContext(AuthContext); // Obtener datos del usuario logueado (superusuario)
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  
  // Obtener las notificaciones del servidor
  useEffect(() => {
    const fetchNotifications = async () => {
      if (superuser) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/notificaciones/bySuper/${superuser.cod_super}`
          );
          setNotifications(response.data);
        } catch (error) {
          console.error('Error al obtener las notificaciones:', error);
        }
      }
    };
    fetchNotifications();
  }, [superuser]); // Solo vuelve a ejecutar si el superusuario cambia

  // Función para eliminar una notificación
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/notificaciones/delete/${id}`);
      // Actualizar el estado para reflejar la eliminación en el frontend
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
      alert('Notificación eliminada');
    } catch (error) {
      console.error('Error al eliminar la notificación:', error);
      alert('Hubo un error al eliminar la notificación.');
    }
  };

  return (
    <div className="notification-history-page">
      <div className="notification-history-container">
        <h1 className="notification-history-title">Historial de Notificaciones</h1>

        <div className="notification-history-list">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="notification-card">
                <h3>{notification.nombre_producto}</h3>
                <p><strong>Días:</strong> {notification.dias.join(', ')}</p>
                <p><strong>Hora:</strong> {notification.hora}</p>
                <p><strong>Título:</strong> {notification.titulo}</p>
                <p><strong>Descripción:</strong> {notification.descripcion}</p>
                
                {/* Botón de eliminar */}
                <Button
                 className="delete-button"
                  onClick={() => handleDelete(notification.id)} // Llamada a la función de eliminación
                >
                  Eliminar
                </Button>
              </div>
            ))
          ) : (
            <p>No hay notificaciones disponibles.</p>
          )}
        </div>

        <Button
          className="back-button"
          onClick={() => navigate(-1)} // Redirige al dashboard o la página que desees
        >
          Volver
        </Button>
      </div>
    </div>
  );
};

export default NotificationHistory;
