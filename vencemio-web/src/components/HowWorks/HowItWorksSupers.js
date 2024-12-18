import React from "react";
import "./HowItWorksSupers.css"; // Archivo CSS para los estilos
import step1Icon from "../../assets/supermarkets.png"; // Ícono de formulario o registro
import step2Icon from "../../assets/coding.png"; // Ícono de subida de datos
import step3Icon from "../../assets/shopping-online.png"; // Ícono de conexión
import step4Icon from "../../assets/growth.png"; // Ícono de gráfico de ventas

function HowItWorksForBusinesses() {
  const steps = [
    {
      id: 1,
      title: "Regístrate como empresa",
      description:
        "Crea una cuenta para tu supermercado o comercio en nuestra plataforma. Configura tu perfil y comienza a gestionar tus promociones de manera eficiente.",
      icon: step1Icon,
    },
    {
      id: 2,
      title: "Publicá tus productos en oferta",
      description:
        "Subí a la plataforma los productos próximos a vencer con su información: nombre, categoría, precio, descuento y fecha de vencimiento. La publicación es rápida y fácil.",
      icon: step2Icon,
    },
    {
      id: 3,
      title: "Conectá con consumidores",
      description:
        "Los consumidores visualizan tus productos en oferta y deciden dirigirse a tu supermercado. Utiliza la geolocalización y filtros para llegar a un público interesado.",
      icon: step3Icon,
    },
    {
      id: 4,
      title: "Reducí pérdidas y aumenta ventas",
      description:
        "Aprovechá al máximo tu inventario, reduce el desperdicio de productos y mejora tus márgenes de ganancia con Vencemio, mientras refuerzas tu compromiso con la sostenibilidad.",
      icon: step4Icon,
    },
  ];

  return (
    <section id="como-funciona" className="how-it-works">
      <h2 className="how-it-works-title">¿Cómo Funciona Vencemio para Empresas?</h2>
      <p className="how-it-works-subtitle">
        Optimiza tu inventario, reduce pérdidas y conecta con consumidores de forma eficiente.
      </p>
      <div className="steps-container">
        {steps.map((step) => (
          <div key={step.id} className="step">
            <img src={step.icon} alt={`Paso ${step.id}`} className="step-icon" />
            <h3 className="step-title">{`Paso ${step.id}: ${step.title}`}</h3>
            <p className="step-description">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorksForBusinesses;
