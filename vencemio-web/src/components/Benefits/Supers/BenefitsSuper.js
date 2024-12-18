import React from "react";
import "./BenefitsSuper.css"; // Archivo CSS para los estilos
import { useNavigate } from "react-router-dom";

function BenefitsForBusiness() {
  const navigate = useNavigate();
  return (
    <section id="beneficios" className="benefits-section">
      <h2 className="benefits-title">Beneficios de Usar Vencemio como Empresa</h2>
      <p className="benefits-subtitle">
        Optimiza tu inventario, reduce pérdidas y fortalece tu marca.
      </p>

      <div className="benefits-container">
        {/* Beneficio 1: Reduce pérdidas económicas */}
        <div className="benefit">
          <h3 className="benefit-title">Reduce pérdidas económicas</h3>
          <ul className="benefit-list">
            <li>Gestiona eficientemente los productos cercanos a vencer y evita el desperdicio.</li>
            <li>Convierte productos que antes se descartaban en ingresos adicionales.</li>
            <li>Maximiza el retorno sobre tu inventario.</li>
          </ul>
          <div className="benefit-visual">📈</div> {/* Gráfico con flecha ascendente */}
        </div>

        {/* Beneficio 2: Mejora la gestión de inventarios */}
        <div className="benefit">
          <h3 className="benefit-title">Mejora la gestión de inventarios</h3>
          <ul className="benefit-list">
            <li>Publica productos con descuentos fácilmente desde nuestra plataforma.</li>
            <li>Controla tu inventario de forma rápida y efectiva, manteniéndolo siempre actualizado.</li>
            <li>Toma decisiones basadas en datos gracias a reportes y análisis.</li>
          </ul>
          <div className="benefit-visual">📋</div> {/* Icono de inventario */}
        </div>

        {/* Beneficio 3: Aumenta tu visibilidad y ventas */}
        <div className="benefit">
          <h3 className="benefit-title">Aumenta tu visibilidad y ventas</h3>
          <ul className="benefit-list">
            <li>Llega a más consumidores interesados en ofertas cercanas a su ubicación.</li>
            <li>Atrae nuevos clientes a tu supermercado con promociones irresistibles.</li>
            <li>Utiliza notificaciones personalizadas para destacar tus productos en promoción.</li>
          </ul>
          <div className="benefit-visual">📢</div> {/* Megáfono */}
        </div>

        {/* Beneficio 4: Refuerza tu compromiso con la sostenibilidad */}
        <div className="benefit">
          <h3 className="benefit-title">Refuerza tu compromiso con la sostenibilidad</h3>
          <ul className="benefit-list">
            <li>Reduce el impacto ambiental al evitar que productos perfectamente utilizables sean desechados.</li>
            <li>Contribuye a la economía circular, fomentando el consumo responsable.</li>
            <li>Mejora tu imagen de marca al alinearte con valores sostenibles y sociales.</li>
          </ul>
          <div className="benefit-visual">🌍</div> {/* Planeta */}
        </div>
      </div>

      {/* Llamado a la acción */}
      <div className="benefits-cta">
        <p>Haz que tu supermercado forme parte del cambio.</p>
        <button className="cta-button" onClick={() => navigate("/login-super")}>
          Únete Ahora
        </button>     
      </div>
    </section>
  );
}

export default BenefitsForBusiness;
