import React, { useState } from "react";
import styles from "../styles/Seasons.module.css";
import seasonsData from "../data/Seasons.json";

const Seasons = () => {
  // --- Etats ---
  const [quizLance, setQuizLance] = useState(false);

  // recupere la progression des saisons
  const [unlockedCount, setUnlockedCount] = useState(() => {
    const sauvegarde = localStorage.getItem("progression_saisons");
    return sauvegarde ? parseInt(sauvegarde, 10) : 0;
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showNextBtn, setShowNextBtn] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [canExplore, setCanExplore] = useState(true);
  const [victoireTotale, setVictoireTotale] = useState(false);
  const [showContinueBtn, setShowContinueBtn] = useState(false);
  const [errors, setErrors] = useState(0);
  const [etape, setEtape] = useState("indice"); // "indice" "qst"

  // --- Logique du Quiz ---

  const validerSaison = () => {
    const nouveauCompte = unlockedCount + 1;
    setUnlockedCount(nouveauCompte);
    localStorage.setItem("progression_saisons", nouveauCompte.toString());
    setShowContinueBtn(false);
    setQuizLance(true);
    setCurrentStep(0);
    setFeedback(null);

    // verifie si l'utilisateur a terminé toutes les saisons dispo
    if (nouveauCompte >= seasonsData.length) {
      setVictoireTotale(true);
    }
  };

  const handleAnswer = (choice, correctAnswer) => {
    if (choice === correctAnswer) {
      setFeedback({ msg: "Bonne réponse ! 🎉", isCorrect: true });
      setErrors(0);
      setShowNextBtn(true);
    } else {
      const newErrors = errors + 1;
      setErrors(newErrors);

      if (newErrors >= 2) {
        alert(
          "Trop d'erreurs ! Vous devez reprendre l'épopée depuis le début. ⚔️",
        );

        setErrors(0);
        setUnlockedCount(0);
        setQuizLance(false);
        localStorage.setItem("progression_saisons", "0");
        window.location.reload();
      } else {
        setFeedback({
          msg: `Mauvaise réponse ! ❌ (Attention : ${newErrors}/2)`,
          isCorrect: false,
        });
        setShowNextBtn(false);
      }
    }
  };

  const nextStep = () => {
    const currentQuiz = seasonsData[unlockedCount];

    if (currentStep < currentQuiz.questions.length - 1) {
      // passe à la qst suivante
      setCurrentStep(currentStep + 1);
      setFeedback(null);
      setShowNextBtn(false);
      setEtape("indice");
      setTimeout(() => setEtape("question"), 1500);
    } else if (unlockedCount === seasonsData.length - 1) {
      // win si c'est la derniere saison
      setQuizLance(false);
      setVictoireTotale(true);
    } else {
      // fin du quiz de la saison actuelle
      setQuizLance(false);
      setShowContinueBtn(true);
      setShowNextBtn(false);
    }
  };

  const gererChrono = () => {
    if (!quizLance) {
      setErrors(0);
      setQuizLance(true);
      setStartTime(Date.now());
      setCurrentStep(0);
      setFeedback(null);
      setShowNextBtn(false);
      setShowContinueBtn(false);

      setEtape("indice");
      setTimeout(() => setEtape("question"), 1500);
    }
  };

  return (
    <main className={styles.seasonsPage} data-aos="fade-right">
      <h1 className={styles.pageTitle}>
        L'Épopée des Saisons
        <p>
          Revivez l'intégralité de la saga.
          {/* de la chute du Mur Maria jusqu'à l'ultime affrontement." */}
        </p>
      </h1>
      <div className={styles.mainPic}>
        <img src="images/saison4.jpg" />
      </div>

      {!victoireTotale && (
        <div className={styles.startContainer}>
          {!quizLance && !showContinueBtn && (
            <button onClick={gererChrono} className={styles.startBtn}>
              {unlockedCount > 0
                ? "Reprendre l'Exploration ⚔️"
                : "Démarrer l'Exploration ⚔️"}
            </button>
          )}
        </div>
      )}

      {(!victoireTotale || !canExplore) && (
        <div className={styles.seasonsGrid}>
          {seasonsData.map((season, index) => {
            const isUnlocked =
              index < unlockedCount ||
              (index === unlockedCount && showContinueBtn);
            const isCurrent = index === unlockedCount;
            const isLocked = index > unlockedCount;
            const currentQuiz = seasonsData[index];

            return (
              <div
                key={season.id}
                className={`${styles.cardContainer} ${isLocked ? styles.locked : ""}`}
              >
                {isLocked && (
                  <div className={styles.lockedOverlay}>🔒 Verrouillé</div>
                )}
                <div
                  className={`${styles.flipCardInner} ${
                    isUnlocked ? styles.isFlipped : ""
                  }`}
                >
                  {/* FACE AVANT */}
                  <div className={`${styles.faceAvant} ${season.colorClass}`}>
                    {quizLance &&
                    isCurrent &&
                    currentQuiz &&
                    currentQuiz.questions ? (
                      <div className={styles.quizContent}>
                        <p className={styles.stepIndicator}>
                          Question {currentStep + 1} /{" "}
                          {currentQuiz.questions.length}
                        </p>

                        {/* AFFICHAGE CONDITIONNEL DE L'INDICE OU DE LA QUESTION */}
                        {etape === "indice" ? (
                          <div className={styles.indiceBox}>
                            <h3>💡 INDICE</h3>
                            <p>{currentQuiz.questions[currentStep].indice}</p>
                          </div>
                        ) : (
                          <>
                            <p className={styles.questionText}>
                              {currentQuiz.questions[currentStep].qst}
                            </p>

                            <div className={styles.optionsGrid}>
                              {currentQuiz.questions[currentStep].choix.map(
                                (c) => (
                                  <button
                                    key={c}
                                    onClick={() =>
                                      handleAnswer(
                                        c,
                                        currentQuiz.questions[currentStep]
                                          .reponse,
                                      )
                                    }
                                    className={styles.quizBtn}
                                  >
                                    {c}
                                  </button>
                                ),
                              )}
                            </div>
                          </>
                        )}

                        {feedback && (
                          <p
                            className={
                              feedback.isCorrect ? styles.success : styles.error
                            }
                          >
                            {feedback.msg}
                          </p>
                        )}

                        {showNextBtn && (
                          <button
                            onClick={nextStep}
                            className={styles.continueBtn}
                          >
                            {currentStep < currentQuiz.questions.length - 1
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
                      <h2>{season.title}</h2>
                      <p>{season.description}</p>
                      <small>{season.highlight}</small>

                      {showContinueBtn && isCurrent && (
                        <button
                          onClick={validerSaison}
                          className={styles.btnValiderSaison}
                          style={{
                            marginTop: "15px",
                            padding: "10px",
                            cursor: "pointer",
                            backgroundColor: "#e63946",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            fontWeight: "bold",
                            width: "100%",
                          }}
                        >
                          Débloquer la suite →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* msg de victoire */}
      {victoireTotale && canExplore && (
        <div className={styles.messageVictoireFinal}>
          <h1>FÉLICITATIONS ! 🏆</h1>
          <p>Vous avez exploré toutes les saisons avec succès.</p>
          <div className={styles.victoireBoutons}>
            <button onClick={() => setCanExplore(false)}>
              Visiter le site
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("progression_saisons");
                window.location.reload();
              }}
            >
              Rejouer
            </button>
            <button onClick={() => (window.location.href = "/")}>
              Retourner à l'Accueil
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Seasons;
