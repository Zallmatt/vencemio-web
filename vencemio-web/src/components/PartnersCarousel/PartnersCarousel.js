import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./PartnersCarousel.css"; // Archivo CSS para estilos
import logo_impulso from "../../assets/logo_impulso.png";
import logo_carrefour from "../../assets/logo_carrefour.png";
import logo_supermax from "../../assets/logo_supermax.png";
import logo_elsuper from '../../assets/logo_elsuper.png';
import logo_lareina from '../../assets/logo_lareina.png';

const partners = [
  { id: 1, name: "Impulso", logo: logo_impulso},
  { id: 2, name: "Carrefour", logo: logo_carrefour },
  { id: 3, name: "Supermax", logo: logo_supermax },
  { id: 4, name: "El Super", logo: logo_elsuper },
  { id: 5, name: "La Reina", logo: logo_lareina },
];

function PartnersCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768, // Ajuste para pantallas pequeñas
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480, // Ajuste para pantallas muy pequeñas
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section id= "partners" className="partners-carousel">
      <h2 className="carousel-title">Nuestros Socios</h2>
      <Slider {...settings}>
        {partners.map((partner) => (
          <div key={partner.id} className="partner-slide">
            <img src={partner.logo} alt={partner.name} className="partner-logo" />
          </div>
        ))}
      </Slider>
    </section>
  );
}

export default PartnersCarousel;
