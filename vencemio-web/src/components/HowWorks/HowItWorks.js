import React from "react";
import "./HowItWorks.css"; // Archivo CSS para los estilos
import step1Icon from "../../assets/loupe.png";
import step2Icon from "../../assets/map.png";
import step3Icon from "../../assets/shopping-cart.png";
import step4Icon from "../../assets/growth.png";

function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Explorá las promociones disponibles",
      description:
        "Navegá por nuestra plataforma para descubrir los productos en oferta en supermercados cercanos. Puedes filtrar las promociones por categoría, porcentaje de descuento o ubicación.",
      icon: step1Icon,
    },
    {
      id: 2,
      title: "Seleccioná tu supermercado preferido",
      description:
        "Encontrá los supermercados adheridos cerca de ti. Revisa las promociones específicas de cada tienda para planificar tu compra.",
      icon: step2Icon,
    },
    {
      id: 3,
      title: "Dirígete al supermercado",
      description:
        "Una vez que encuentres los productos que te interesan, acércate al supermercado correspondiente para aprovechar las promociones. Recuerda verificar la disponibilidad antes de tu visita.",
      icon: step3Icon,
    },
    {
      id: 4,
      title: "Aprovechá las ofertas y ahorra",
      description:
        "Comprá los productos que seleccionaste directamente en el supermercado y disfrutá de descuentos significativos mientras contribuyes a reducir el desperdicio de alimentos.",
      icon: step4Icon,
    },
  ];

  return (
    <section id="como-funciona" className="how-it-works">
      <h2 className="how-it-works-title">¿Cómo Funciona Vencemio?</h2>
      <p className="how-it-works-subtitle">
        Encuentra las mejores ofertas en productos próximos a vencer de forma rápida y sencilla.
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

export default HowItWorks;
