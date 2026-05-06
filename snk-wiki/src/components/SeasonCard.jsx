import React from "react";
import styles from "../styles/Seasons.module.css";

const SeasonsCard = ({
  season,
  index,
  isUnlocked,
  isCurrent,
  isLocked,
  quizLance,
  currentStep,
  etape,
  handleAnswer,
  feedback,
  showNextBtn,
  nextStep,
  showContinueBtn,
  validerSaison,
}) => {
  return (
    <div className={`${styles.cardContainer} ${isLocked ? styles.locked : ""}`}>
      {isLocked && <div className={styles.lockedOverlay}>🔒 Verrouillé</div>}

      <div
        className={`${styles.flipCardInner} ${isUnlocked ? styles.isFlipped : ""}`}
      >
        {/* FACE AVANT */}
        <div className={`${styles.faceAvant} ${season.colorClass}`}>
          {quizLance && isCurrent ? (
            <div className={styles.quizContent}>
              <p className={styles.stepIndicator}>
                Question {currentStep + 1} / {season.questions.length}
              </p>

              {etape === "indice" ? (
                <div className={styles.indiceBox}>
                  <h3>💡 INDICE</h3>
                  <p>{season.questions[currentStep].indice}</p>
                </div>
              ) : (
                <>
                  <p className={styles.questionText}>
                    {season.questions[currentStep].qst}
                  </p>
                  <div className={styles.optionsGrid}>
                    {season.questions[currentStep].choix.map((c) => (
                      <button
                        key={c}
                        onClick={() =>
                          handleAnswer(c, season.questions[currentStep].reponse)
                        }
                        className={styles.quizBtn}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {feedback && (
                <p
                  className={feedback.isCorrect ? styles.success : styles.error}
                >
                  {feedback.msg}
                </p>
              )}

              {showNextBtn && (
                <button onClick={nextStep} className={styles.continueBtn}>
                  {currentStep < season.questions.length - 1
                    ? "Continuer →"
                    : "Terminer le Quiz ! 🔓"}
                </button>
              )}
            </div>
          ) : (
            <div className={styles.lockedContent}>
              <span>{isUnlocked ? "" : "🔒 Saison Verrouillée"}</span>
            </div>
          )}
        </div>

        {/* FACE ARRIÈRE */}
        <div className={`${styles.faceArriere} ${season.colorClass}`}>
          <div className={styles.seasonThumbnail}>
            <img src={season.img} alt={season.title} />
          </div>
          <div className={styles.seasonContent}>
            <h2 className={styles.seasonNumber}>{season.nom}</h2>
            <h2>{season.title}</h2>
            <p className={styles.seasonDescription}>{season.description}</p>
            <div className={styles.separator}></div>
            <p className={styles.seasonHighlight}>{season.highlight}</p>

            {showContinueBtn && isCurrent && (
              <button
                onClick={validerSaison}
                className={styles.btnValiderSaison}
              >
                Débloquer la suite →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonsCard;
