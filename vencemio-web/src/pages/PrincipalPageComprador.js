import React, { useEffect } from "react";
import "./PrincipalPageComprador.css"; // Estilos globales
import Benefits from "../components/Benefits/Users/Benefits"; // Sección de Beneficios
import AboutUs from "../components/AboutUs/AboutUs";
import FAQ from "../components/FAQ/Users/FAQ";
import PartnersCarousel from "../components/PartnersCarousel/PartnersCarousel";
import HowItWorks from "../components/HowWorks/HowItWorks";

function PrincipalPageComprador() {
  // Efecto para hacer scroll a la sección guardada
  useEffect(() => {
    const sectionToScroll = localStorage.getItem("sectionToScroll");
    if (sectionToScroll) {
      const section = document.getElementById(sectionToScroll);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" }); // Hace scroll a la sección
      }
      localStorage.removeItem("sectionToScroll"); // Limpia el valor guardado
    }
  }, []);

  return (
    <div className="home-page">
      {/* Sección: ¿Cómo funciona? */}
      <section id="como-funciona">
        <HowItWorks />
      </section>

      {/* Sección: Beneficios */}
      <section id="beneficios">
        <Benefits />
      </section>

      {/* Sección: Partners */}
      <section id="partners">
        <PartnersCarousel />
      </section>

      {/* Sección: Preguntas Frecuentes */}
      <section id="faq">
        <FAQ />
      </section>

      {/* Sección: Nosotros */}
      <section id="sobre-nosotros">
        <AboutUs />
      </section>
    </div>
  );
}

export default PrincipalPageComprador;
