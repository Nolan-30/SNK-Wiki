import React from "react";
import styles from "../styles/History.module.css";

const HistoryCard = ({
  title,
  isUnlocked,
  isActiveQuiz,
  isLocked,
  data,
  currentStep,
  handleAnswer,
  feedback,
  showNextBtn,
  nextStep,
  etape,
  contentText,
}) => {
  return (
    <section
      className={`${styles.sectionTexte} ${isActiveQuiz ? styles.activeQuiz : ""} ${isLocked ? styles.locked : ""}`}
    >
      <h2 className={styles.sousTitre}>{title}</h2>

      {isUnlocked && !isActiveQuiz ? (
        <p className={styles.historyParam}>{contentText}</p>
      ) : isActiveQuiz ? (
        <div className={styles.quizBox}>
          {data?.questions?.[currentStep] && (
            <>
              {etape === "indice" ? (
                <div className={styles.indiceBox}>
                  <p>💡 INDICE : {data.questions[currentStep].indice}</p>
                </div>
              ) : (
                <>
                  <p className={styles.quizQuestion}>
                    {data.questions[currentStep].qst}
                  </p>
                  <div className={styles.optionsGrid}>
                    {data.questions[currentStep].choix.map((c) => (
                      <button
                        key={c}
                        onClick={() =>
                          handleAnswer(c, data.questions[currentStep].reponse)
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
                  Question Suivante →
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <p className={styles.lockedText}>🔒 Section verrouillée</p>
      )}
    </section>
  );
};

export default HistoryCard;
