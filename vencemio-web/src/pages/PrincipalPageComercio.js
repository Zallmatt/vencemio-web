import React, { useEffect } from "react";
import "./PrincipalPageComprador.css"; // Estilos globales
import BenefitsForBusiness from "../components/Benefits/Supers/BenefitsSuper"; // Sección de Beneficios
import AboutUs from "../components/AboutUs/AboutUs";
import FAQ from "../components/FAQ/Supers/FAQSuper";
import PartnersCarousel from "../components/PartnersCarousel/PartnersCarousel";
import HowItWorksForBusinesses from "../components/HowWorks/HowItWorksSupers";

function PrincipalPageComercio() {
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
        <HowItWorksForBusinesses />
      </section>

      {/* Sección: Beneficios */}
      <section id="beneficios">
        <BenefitsForBusiness />
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

export default PrincipalPageComercio;
