import React from "react";
import styles from "../styles/Titans.module.css";

const Titans = () => {
  return (
    <main className={styles.mainTitans}>
      <h1 className={styles.titrePage} data-aos="zoom-in">
        <span className={styles.degraderJaune}>Les Neuf Titans</span>
      </h1>

      <div className={styles.titansGrid}>
        <article className={styles.titanCard} id="carte-assaillant">
          <div className={styles.imageBox}>
            <img src="public/images/assaillant.jpg" alt="Titan Assaillant" />
            <div className={styles.overlay}>
              <button>DÉBLOQUER</button>
            </div>
          </div>

          <div className={styles.titanInfo}>
            <p>Accès refusé. Résolvez le quiz pour débloquer.</p>
          </div>
        </article>
      </div>

      <p className={styles.othersList}>
        Autres : Titan Mâchoire, Charrette, Originel.
      </p>
    </main>
  );
};

export default Titans;
