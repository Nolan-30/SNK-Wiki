import React from "react";
import styles from "../styles/Titans.module.css";

const TitansCard = ({
  titan,
  index,
  isUnlocked,
  showOverlay,
  etapeQuiz,
  feedback,
  verifierReponse,
  showContinueBtn,
  gererContinuer,
  cartesRef,
}) => {
  return (
    <div
      className={styles["personnage-carte"]}
      id={titan.id}
      ref={(el) => (cartesRef.current[index] = el)}
    >
      <div
        className={`${styles["flip-cards"]} ${isUnlocked ? styles["est-retournee"] : ""}`}
        style={{ opacity: showOverlay ? 0 : 1 }}
      >
        {/* Dos de la carte */}
        <div className={styles["face-avant"]}>
          <img
            src="public/images/face-avant-titans.png"
            width="auto"
            height="400"
            draggable="false"
            alt="dos carte"
          />
        </div>

        {/* Face arrière */}
        <div className={styles["face-arriere"]}>
          <article
            className={`${styles["titan-card"]} ${titan.reverse ? styles.reverse : ""}`}
          >
            <div
              className={`${styles["card-visual"]} ${styles[titan.visualClass]}`}
            >
              <img src={titan.image} alt={titan.nom} />
            </div>
            <div className={styles["card-content"]}>
              <h2 className={styles["titan-name"]}>{titan.nom}</h2>
              <p className={styles["titan-holder"]}>
                Détenteur actuel :{" "}
                <strong>
                  <span className={styles[titan.holderClass]}>
                    {titan.holder}
                  </span>
                </strong>
              </p>
              <p className={styles["titan-desc"]}>{titan.desc}</p>
              <ul
                className={`${styles["titan-stats"]} ${styles[titan.statsClass]}`}
              >
                {titan.stats.map((stat, i) => (
                  <li key={i}>{stat}</li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </div>

      {/* Overlay du quiz */}
      {showOverlay && (
        <div className={styles["jeu-dans-carte"]}>
          {etapeQuiz === "debloque" ? (
            <h2 style={{ color: "lightgreen" }}>Titan débloqué !</h2>
          ) : etapeQuiz === "indice" ? (
            <div>
              <h3>INDICE</h3>
              <p>{titan.indice}</p>
            </div>
          ) : (
            <div className={styles.quizContainer}>
              <h2 className={styles.questionQuiz}>{titan.q}</h2>
              <div className={styles["options-boutons-titans"]}>
                {titan.choix.map((choixTexte, i) => (
                  <button
                    key={i}
                    className={styles["btn-reponse-quiz"]}
                    onClick={() => verifierReponse(choixTexte, titan.reponse)}
                  >
                    {choixTexte}
                  </button>
                ))}
              </div>
              <p
                className={styles["feedback-mini-titans"]}
                style={{ color: feedback.couleur }}
              >
                {feedback.texte}
              </p>
            </div>
          )}
        </div>
      )}

      {showContinueBtn && (
        <button
          className={styles["btn-continuer-titan"]}
          onClick={gererContinuer}
        >
          Continuer →
        </button>
      )}
    </div>
  );
};

export default TitansCard;
