import React from "react";
import "./Benefits.css"; // Archivo CSS para los estilos
import {useNavigate} from "react-router-dom";

function Benefits() {
  const navigate = useNavigate();

  return (
    <section id="beneficios" className="benefits-section">
      <h2 className="benefits-title">Beneficios de Usar Vencemio</h2>
      <p className="benefits-subtitle">
        Una solución que beneficia a todos: consumidores, supermercados y el medio ambiente.
      </p>

      <div className="benefits-container">
        {/* Beneficio 1: Ahorra dinero en tus compras diarias */}
        <div className="benefit">
          <h3 className="benefit-title">Ahorra dinero en tus compras diarias</h3>
          <ul className="benefit-list">
            <li>Encuentra productos con descuentos de hasta el 60%.</li>
            <li>Accede a ofertas en alimentos, bebidas y productos de higiene sin comprometer la calidad.</li>
            <li>Aprovecha promociones exclusivas cerca de tu ubicación.</li>
          </ul>
          <div className="benefit-visual">🛒</div> {/* Ícono del carrito de compras */}
        </div>

        {/* Beneficio 2: Encuentra promociones cerca de ti */}
        <div className="benefit">
          <h3 className="benefit-title">Encuentra promociones cerca de ti</h3>
          <ul className="benefit-list">
            <li>Usa la geolocalización para localizar los supermercados más cercanos con ofertas disponibles.</li>
            <li>Explora las promociones de manera rápida y sencilla desde tu dispositivo móvil.</li>
            <li>Recibe notificaciones personalizadas de los productos que te interesan.</li>
          </ul>
          <div className="benefit-visual">📍</div> {/* Ícono del GPS */}
        </div>

        {/* Beneficio 3: Contribuye al cuidado del planeta */}
        <div className="benefit">
          <h3 className="benefit-title">Contribuye al cuidado del planeta</h3>
          <ul className="benefit-list">
            <li>Ayuda a reducir el desperdicio de alimentos al comprar productos próximos a vencer.</li>
            <li>Forma parte de un modelo de consumo más consciente y sostenible.</li>
            <li>Haz que tus compras tengan un impacto positivo en el medio ambiente.</li>
          </ul>
          <div className="benefit-visual">🌍</div> {/* Ícono del planeta */}
        </div>
      </div>

      {/* Llamado a la acción */}
      <div className="benefits-cta">
        <p>Con Vencemio, todos ganamos.</p>
        <button className="cta-button" onClick={() => navigate("/login")}>
          Únete Ahora
        </button>      
      </div>
    </section>
  );
}

export default Benefits;
