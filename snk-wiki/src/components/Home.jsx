import { Link } from "react-router-dom";
import React from "react";
import "../styles/Home.css";

const Home = () => {
  return (
    <>
      <section className="hero-section" data-aos="fade-up">
        <h1 className="hero-title">Shingeki no Kyojin</h1>
        <div className="hero-separator"></div>
        <p className="hero-quote">
          "Ce jour-là, l'humanité s'en est souvenue..."
        </p>
        <a href="#intro" className="hero-btn">
          Découvrir l'univers
        </a>
      </section>

      <main className="container" id="intro" data-aos="fade-up">
        <section className="intro-section">
          <h4 className="intro-label">
            <span className="degrader-rouge">Introduction</span>
          </h4>
          <h1 className="main-title">
            Bienvenue dans l'univers de l'attaque des titans
          </h1>
          <p className="subtitle">
            Rejoignez le Bataillon d'Exploration et découvrez la vérité sur ce
            monde cruel mais magnifique.
          </p>
        </section>

        <div className="logo-bataillon">
          <Link to="/personnages">
            <img
              src="public/Images/bataillon-logo.jpg"
              height="450"
              alt="bataillon logo"
            />
          </Link>
        </div>

        <section className="cards-grid" data-aos="fade-up">
          {/* Carte Histoire */}
          <article className="card card-red">
            <Link to="/histoire">
              <div className="icon-box">
                <i className="fa-solid fa-book-open"></i>
              </div>
              <h3>Histoire</h3>
              <p>Les origines des murs et le combat pour la liberté.</p>
            </Link>
          </article>

          {/* Carte Personnages */}
          <article className="card card-green">
            <Link to="/personnages">
              <div className="icon-box">
                <i className="fa-solid fa-book-open"></i>
              </div>
              <h3>Personnages</h3>
              <p>Découvrez les héros du Bataillon d'Exploration.</p>
            </Link>
          </article>

          {/* Carte Titans */}
          <article className="card card-yellow">
            <Link to="/titans">
              <div className="icon-box">
                <i className="fa-solid fa-skull"></i>
              </div>
              <h3>Titans</h3>
              <p>Les 9 Titans primordiaux et leurs pouvoirs.</p>
            </Link>
          </article>

          {/* Carte Saisons */}
          <article className="card card-blue">
            <Link to="/saisons">
              <div className="icon-box">
                <i className="fa-solid fa-film"></i>
              </div>
              <h3>Saisons</h3>
              <p>Récapitulatif de tous les arcs narratifs.</p>
            </Link>
          </article>
        </section>
      </main>
    </>
  );
};

export default Home;
