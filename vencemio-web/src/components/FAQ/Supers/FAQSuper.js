import React, { useState } from "react";
import "./FAQSuper.css";

const faqs = [
  {
    question: "¿Qué beneficios ofrece Vencemio a las empresas?",
    answer:
      "Vencemio te ayuda a reducir pérdidas al promocionar productos próximos a vencer, aumentar tu visibilidad entre consumidores y reforzar tu compromiso con la sostenibilidad.",
  },
  {
    question: "¿Cómo puedo registrar mi supermercado o comercio en Vencemio?",
    answer:
      "Solo necesitas crear una cuenta, completar el perfil de tu empresa y cargar tu inventario con los productos en promoción.",
  },
  {
    question: "¿Qué tipo de productos puedo promocionar?",
    answer:
      "Puedes promocionar cualquier producto próximo a vencer que cumpla con las normativas de calidad, como alimentos, bebidas y artículos de higiene.",
  },
  {
    question: "¿Cómo publico promociones en Vencemio?",
    answer:
      "A través de nuestra plataforma, subes los datos de tus productos (nombre, categoría, precio, descuento y fecha de vencimiento). El proceso es rápido y sencillo.",
  },
  {
    question: "¿Cómo llegan las promociones a los consumidores?",
    answer:
      "Los consumidores ven tus promociones en tiempo real, filtradas por categoría, descuento o ubicación, y reciben notificaciones personalizadas sobre tus productos.",
  },
  {
    question: "¿Cuánto cuesta usar Vencemio como empresa?",
    answer:
      "El costo depende del plan que elijas. Contamos con diferentes opciones según el tamaño de tu inventario y las funcionalidades que desees.",
  },
  {
    question: "¿Qué informes ofrece Vencemio para mi negocio?",
    answer:
      "Obtén reportes detallados sobre el desempeño de tus promociones, reducción de desperdicio y métricas de venta para tomar decisiones informadas.",
  },
];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section">
      <h2 className="faq-title">Preguntas Frecuentes</h2>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
          >
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <h3>{faq.question}</h3>
              <span>{activeIndex === index ? "▲" : "▼"}</span>
            </div>
            {activeIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQ;
