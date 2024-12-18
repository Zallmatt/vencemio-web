import React, { useState } from "react";
import "./FAQ.css";

const faqs = [
  {
    question: "¿Qué puedo hacer en Vencemio?",
    answer:
      "Vencemio te permite explorar productos en oferta en supermercados cercanos. Puedes visualizar promociones, filtrar por categorías y planificar tus compras para aprovechar los mejores precios.",
  },
  {
    question: "¿Qué tipo de productos puedo encontrar en Vencemio?",
    answer:
      "Puedes encontrar alimentos, bebidas y productos de higiene que están próximos a vencer, todos con descuentos especiales ofrecidos por los supermercados adheridos.",
  },
  {
    question: "¿Puedo comprar directamente desde Vencemio?",
    answer:
      "No. Vencemio es una plataforma informativa que muestra promociones y productos en oferta. Para comprar, deberás dirigirte al supermercado correspondiente.",
  },
  {
    question: "¿Cómo sé si una promoción sigue activa?",
    answer:
      "Las promociones se actualizan en tiempo real según la información de los supermercados. Revisa la fecha y disponibilidad antes de dirigirte al lugar.",
  },
  {
    question: "¿Cómo encuentro las ofertas más cercanas a mí?",
    answer:
      "Usa la función de geolocalización en la plataforma para ver supermercados y productos en oferta cerca de tu ubicación.",
  },
  {
    question: "¿Qué descuentos puedo encontrar?",
    answer:
      "Los productos próximos a vencer pueden tener descuentos de entre un 20% y un 60%, dependiendo del supermercado y del producto.",
  },
  {
    question: "¿Recibiré notificaciones de nuevas ofertas?",
    answer:
      "Sí, puedes activar las notificaciones para recibir alertas personalizadas sobre descuentos en supermercados cercanos o productos de tu interés.",
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
