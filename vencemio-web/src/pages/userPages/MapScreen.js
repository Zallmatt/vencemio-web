import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScriptNext, Marker, InfoWindow } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para redirigir
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultCenter = { lat: -27.4675279, lng: -58.8263367 };

const MapScreen = () => {
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const navigate = useNavigate(); // Hook para redirigir

  const getSupermarketIcon = (supermarketName) => {
    const normalizeName = (name) =>
      name.toLowerCase().replace(/\s+/g, "").replace(/[áéíóúñ]/g, (match) => {
        const map = { á: "a", é: "e", í: "i", ó: "o", ú: "u", ñ: "n" };
        return map[match];
      });

    const icons = {
      impulso: "/assets/logo_impulso.png",
      carrefour: "/assets/logo_carrefour.png",
      elsuper: "/assets/logo_elsuper.png",
      supermax: "/assets/logo_supermax.png",
      lareina: "/assets/logo_lareina.png",
    };

    return icons[normalizeName(supermarketName)] || null; // Si no tiene icono, devolver null
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/superusers`);
        const data = response.data.map((superuser) => ({
          id: superuser.id,
          lat: superuser.ubicacion.latitud,
          lng: superuser.ubicacion.longitud,
          name: superuser.cadena,
          address: superuser.direccion,
          ciudad: superuser.ciudad,
          telefono: superuser.telefono,
        }));
        setLocations(data);
      } catch (err) {
        console.error("Error al cargar las ubicaciones:", err);
        setError("No se pudieron cargar las ubicaciones.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.error("Error al obtener la ubicación actual:", err);
          setError("No se pudo obtener tu ubicación.");
        }
      );
    } else {
      setError("La geolocalización no está soportada por este navegador.");
    }
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ position: "relative" }}> {/* Contenedor para posicionar el botón */}
      {/* Botón para volver */}
      <button
        style={{
          position: "absolute",
          top: "100px",
          left: "10px",
          zIndex: 1000,
          padding: "10px 15px",
          backgroundColor: "#1c802d",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
        }}
        onClick={() => navigate("/user-home")} // Navega a /user-home
      >
        Volver
      </button>

      {/* Mapa */}
      <LoadScriptNext
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
        onLoad={() => setMapLoaded(true)}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentLocation || defaultCenter}
          zoom={currentLocation ? 16 : 14}
          onLoad={() => setMapLoaded(true)}
          options={{
            styles: [
              {
                featureType: "all",
                elementType: "geometry",
                stylers: [
                  { visibility: "simplified" }
                ],
              },
              {
                featureType: "poi",
                elementType: "labels.icon",
                stylers: [{ visibility: "off" }],  // Desactivar iconos de puntos de interés
              },
              {
                featureType: "road",
                elementType: "labels.icon",
                stylers: [{ visibility: "off" }],  // Desactivar iconos de carreteras
              },
              {
                featureType: "transit",
                elementType: "labels.icon",
                stylers: [{ visibility: "off" }],  // Desactivar iconos de transporte
              },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [
                  { visibility: "on" },    // Mantener las carreteras visibles
                ],
              },
              {
                featureType: "administrative",
                elementType: "geometry",
                stylers: [
                  { visibility: "on" },    // Mantener las fronteras administrativas
                ],
              },
              {
                featureType: "landscape",
                elementType: "geometry",
                stylers: [
                  { color: "#f1f1f1" },   // Color de las áreas de paisaje
                  { visibility: "on" },    // Mantener paisajes visibles
                ],
              },
              {
                featureType: "poi",
                elementType: "geometry",
                stylers: [
                  { visibility: "off" },   // Desactivar los puntos de interés
                ],
              },
            ],
          }}
        >
          {mapLoaded && (
            <>
              {currentLocation && (
                <Marker
                  position={currentLocation}
                  icon={{
                    url: "https://maps.gstatic.com/mapfiles/ms2/micons/man.png",
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                />
              )}

              {locations.map((location) => {
                const icon = getSupermarketIcon(location.name); // Obtener icono si existe
                return (
                  icon && (
                    <Marker
                      key={location.id}
                      position={{ lat: location.lat, lng: location.lng }}
                      icon={{
                        url: icon,
                        scaledSize: new window.google.maps.Size(40, 40),
                      }}
                      onClick={() => setSelected(location)}
                    />
                  )
                );
              })}

              {selected && (
                <InfoWindow
                  position={{ lat: selected.lat, lng: selected.lng }}
                  onCloseClick={() => setSelected(null)}
                  options={{ disableAutoPan: true, closeBoxURL: '' }} // Deshabilita el botón predeterminado
                >
                  <div
                    style={{
                      fontFamily: "Arial, sans-serif",
                      padding: "10px",
                      textAlign: "center",
                      backgroundColor: "#fff8e1",
                      borderRadius: "10px",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                      maxWidth: "250px",
                    }}
                  >
                    <img
                      src={getSupermarketIcon(selected.name)}
                      alt={selected.name}
                      style={{
                        width: "50px",
                        marginBottom: "10px",
                        borderRadius: "50%",
                        border: "2px solid #1c802d",
                      }}
                    />
                    <h3 style={{ margin: "0", fontSize: "16px", color: "#2c3e50" }}>
                      {selected.name}
                    </h3>
                    <p style={{ margin: "5px 0", fontSize: "14px", color: "#34495e" }}>
                      <strong>Dirección:</strong> {selected.address}
                    </p>
                    <p style={{ margin: "5px 0", fontSize: "14px", color: "#34495e" }}>
                      <strong>Ciudad:</strong> {selected.ciudad}
                    </p>
                    <p style={{ margin: "5px 0", fontSize: "14px", color: "#34495e" }}>
                      <strong>Teléfono:</strong> {selected.telefono}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </>
          )}
        </GoogleMap>
      </LoadScriptNext>
    </div>
  );
};

export default MapScreen;
