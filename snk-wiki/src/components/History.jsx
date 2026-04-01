import React from "react";

import styles from "../styles/History.module.css";

const History = () => {
  return (
    <main className={styles.historyMain}>
      <div className={styles.titrePrincipalConteneur} data-aos="fade-up">
        <h1 className={styles.historyTitle}>
          <span className={styles.degraderRouge}>
            L'Histoire D'un Monde Cruel
          </span>
        </h1>
        <img
          src="public/images/ymir.jpg"
          height="500"
          alt="la naissance du pouvoir des Titans et des neuf Titans originaux"
          className={styles.historyHeroImg}
        />
        <div className={styles.separateurRouge}></div>
      </div>

      <section className={styles.boiteContenu} data-aos="fade-up">
        <div className={styles.sectionTexte}>
          <h2 className={styles.sousTitre}>ORIGINE</h2>
          <p className={styles.historyParam}>
            L'histoire se déroule dans un monde où l'humanité vit entourée
            d'immenses murs pour se protéger de créatures gigantesques, les
            Titans. Le récit commence avec la chute du Mur Maria, brisé par le
            Titan Colossal et le Titan Cuirassé, marquant la fin de cent ans de
            paix.
          </p>
        </div>

        <div className={styles.sectionTexte}>
          <h2 className={styles.sousTitre}>LES MURS</h2>
          <p className={styles.historyParam}>
            Trois murs concentriques protègent les derniers humains : Maria
            (l'extérieur), Rose (le milieu) et Sina (le centre). Personne ne
            sait comment ils ont été construits, un secret gardé jalousement par
            le culte du Mur et la famille royale.
          </p>
        </div>

        <div className={styles.sectionThemes}>
          <h2 className={styles.sousTitre}>LES THÈMES</h2>

          <div className={styles.grilleCartes}>
            {/* Carte Histoire */}
            <article className={`${styles.carte} ${styles.carteBlanche}`}>
              <h3>La Liberté</h3>
              <p className={styles.historyParam}>
                Le désir inné d'Eren de voir le monde extérieur, quel qu'en soit
                le prix.
              </p>
            </article>

            {/* Carte Guerre */}
            <article className={`${styles.carte} ${styles.carteBlanche}`}>
              <h3>La Guerre</h3>
              <p className={styles.historyParam}>
                La complexité des conflits où il n'y a ni gentils ni méchants
                absolus.
              </p>
            </article>

            {/* Carte Haine */}
            <article className={`${styles.carte} ${styles.carteRouge}`}>
              <h3>Le Cycle de la Haine</h3>
              <p className={styles.historyParam}>
                Comment la violence engendre la violence à travers les
                générations.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
};

export default History;
