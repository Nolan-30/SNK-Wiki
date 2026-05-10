import React, { useEffect, useState } from "react";
import styles from "../styles/Profile.module.css";

const Profile = () => {
  const [stats, setStats] = useState({
    username: "Soldat",
    histoire: { unlocked: 0, temps: 0 },
    titans: { unlocked: 0, temps: 0 },
    saisons: { unlocked: 0, total: 4 },
    personnages: { unlocked: 0, total: 4 },
  });

  useEffect(() => {
    // Progression des pages debloques

    const user = localStorage.getItem("username") || "Explorateur";
    const histUnlocked =
      parseInt(localStorage.getItem("progression_histoire"), 10) || 0;
    const titansUnlocked =
      parseInt(localStorage.getItem("progression_titans"), 10) || 0;
    const saisonsUnlocked =
      parseInt(localStorage.getItem("progression_saisons"), 10) || 0;
    const listePersos = JSON.parse(
      localStorage.getItem("personnages_debloques") || "[]",
    );
    const persosUnlocked = listePersos.length;

    setStats({
      username: user,
      histoire: { unlocked: histUnlocked, total: 5 },
      titans: { unlocked: titansUnlocked, total: 6 },
      saisons: { unlocked: saisonsUnlocked, total: 4 },
      personnages: { unlocked: persosUnlocked, total: 4 },
    });
  }, []);

  const calculerPourcentage = (unlocked, total) => {
    return Math.round((unlocked / total) * 100);
  };

  return (
    <div className={styles.profileContainer} data-aos="fade-up">
      <div className={styles.header}>
        <h1 className={styles.title}>Profil du Bataillon</h1>
        <img src="images/profil.png" height={500} />
      </div>

      <div className={styles.statsGrid}>
        {/* Carte Histoire */}
        <div className={styles.statCard}>
          <h3> Chapitres </h3>
          <img src="images/histoire-progression.png" height={200} />
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${calculerPourcentage(stats.histoire.unlocked, stats.histoire.total)}%`,
              }}
            ></div>
          </div>
          <p>
            {stats.histoire.unlocked} / {stats.histoire.total}
          </p>
          <p>Chapitres Débloqués</p>
        </div>

        {/* Carte Personnages */}
        <div className={styles.statCard}>
          <h3> Personnages </h3>
          <img src="images/perso-progression.png" height={200} />
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${calculerPourcentage(stats.personnages.unlocked, stats.personnages.total)}%`,
                backgroundColor: "#f4a261",
              }}
            ></div>
          </div>
          <p>
            {stats.personnages.unlocked} / {stats.personnages.total}
          </p>
          <p>Héros débloqués</p>
        </div>

        {/* Carte Titans */}
        <div className={styles.statCard}>
          <h3> Titans </h3>
          <img src="images/titan-progression.png" height={200} />
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${calculerPourcentage(stats.titans.unlocked, stats.titans.total)}%`,
                backgroundColor: "#e63946",
              }}
            ></div>
          </div>
          <p>
            {stats.titans.unlocked} / {stats.titans.total}
          </p>
          <p>Titans débloqués</p>
        </div>

        {/* Carte Saisons */}
        <div className={styles.statCard}>
          <h3> Saisons </h3>
          <img src="images/saison-progression.png" height={200} />
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${calculerPourcentage(stats.saisons.unlocked, stats.saisons.total)}%`,
                backgroundColor: "#2a9d8f",
              }}
            ></div>
          </div>
          <p>
            {stats.saisons.unlocked} / {stats.saisons.total}
          </p>
          <p className={styles.texteDebloque}>Saisons débloquées</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
