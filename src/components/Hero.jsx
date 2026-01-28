import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            PRODUTOS
            <br />
            <span className="hero-title-digital">DIGITAIS</span>
          </h1>
          <p className="hero-subtitle">
            Compre e baixe instantaneamente seus produtos favoritos
          </p>
          <a href="#products" className="btn btn-primary hero-cta">
            Ver Produtos
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
