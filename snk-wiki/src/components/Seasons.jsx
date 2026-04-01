import React from "react";
import styles from "../styles/Seasons.module.css";

const Seasons = () => {
  const seasonsData = [
    {
      id: 1,
      title: "Saison 1",
      url: "https://www.youtube.com/watch?v=LwaZnd36_68",
      img: "public/images/saison1.jpg",
      description:
        "L'humanité vit en paix jusqu'à l'apparition du Titan Colossal. Eren, Mikasa et Armin rejoignent l'armée.",
      highlight: "Incontournable : La bataille du district de Trost.",
      colorClass: styles.borderBlue,
    },
    {
      id: 2,
      title: "Saison 2",
      url: "https://www.youtube.com/watch?v=z8Xy0N_uI6U",
      img: "public/images/saison2.jpg",
      description:
        "La découverte de Titans à l'intérieur des murs. L'identité des traîtres est révélée.",
      highlight: "Moment fort : La trahison de Reiner et Bertholdt.",
      colorClass: styles.borderRed,
    },
    {
      id: 3,
      title: "Saison 3",
      url: "https://www.youtube.com/watch?v=ou4zFtWBjAg",
      img: "public/images/saison3.jpg",
      description:
        "Partie 1 : Conflit politique et royauté. Partie 2 : Le retour à Shiganshina et la cave.",
      highlight: "Clé : La vérité sur le monde extérieur et la mer.",
      colorClass: styles.borderGreen,
    },
    {
      id: 4,
      title: "Saison 4",
      url: "https://www.youtube.com/watch?v=KnpVhlDoogM",
      img: "public/images/saison4.jpg",
      description:
        "Quatre ans plus tard à Mahr. La guerre éclate. Le Grand Terrassement commence.",
      highlight: "Conclusion : La fin de l'ère des Titans.",
      colorClass: styles.borderOrange,
    },
  ];

  return (
    <main className={styles.seasonsMain}>
      <h1 className={styles.pageTitle} data-aos="fade-down">
        <span className={styles.degraderBlanc}>Chronologie des Saisons</span>
      </h1>

      <div className={styles.seasonsGrid}>
        {seasonsData.map((season) => (
          <article
            key={season.id}
            className={`${styles.seasonCard} ${season.colorClass}`}
            data-aos="fade-up"
          >
            <div className={styles.seasonThumbnail}>
              <img src={season.img} alt={season.title} />
            </div>

            <div className={styles.seasonContent}>
              <a href={season.url} target="_blank" rel="noopener noreferrer">
                <h2>{season.title}</h2>
              </a>
              <p className={styles.description}>{season.description}</p>
              <p className={styles.highlight}>{season.highlight}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
};

export default Seasons;
