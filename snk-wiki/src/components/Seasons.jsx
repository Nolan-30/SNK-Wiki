import React, { useState, useEffect } from "react";
import styles from "../styles/Seasons.module.css";
import seasonsData from "../data/Seasons.json";

const Seasons = () => {
  // --- Etats ---

  // recupere la progression des saisons
  const [unlockedCount, setUnlockedCount] = useState(() => {
    const sauvegarde = localStorage.getItem("progression_saisons");
    return sauvegarde ? parseInt(sauvegarde, 10) : 0;
  });

  const [quizLance, setQuizLance] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showNextBtn, setShowNextBtn] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [canExplore, setCanExplore] = useState(true);
  const [victoireTotale, setVictoireTotale] = useState(false);
  const [showContinueBtn, setShowContinueBtn] = useState(false);
  const [errors, setErrors] = useState(0);
  const [etape, setEtape] = useState("indice"); // "indice" "qst"
  const [temps, setTemps] = useState(0);
  const [activeTimer, setActiveTimer] = useState(false);
  const [defaiteTemps, setDefaiteTemps] = useState(false);

  useEffect(() => {
    let interval;
    if (activeTimer && !victoireTotale && !defaiteTemps) {
      interval = setInterval(() => {
        setTemps((prev) => {
          if (prev >= 1000) {
            setDefaiteTemps(true);
            setActiveTimer(false);
            setQuizLance(false);
            return 5;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [activeTimer, victoireTotale, defaiteTemps]);

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

  const lancerExploration = () => {
    setQuizLance(true);
    setActiveTimer(true);
    setTemps(0);
    setEtape("indice");
    // On passe à la question automatiquement après l'indice (comme sur les autres pages)
    setTimeout(() => setEtape("qst"), 1500);
  };

  // --- Logique du Quiz ---
  const handleAnswer = (choice, correctAnswer) => {
    if (choice === correctAnswer) {
      setFeedback({ msg: "Bonne réponse ! 🎉", isCorrect: true });
      setShowNextBtn(true);
    } else {
      const newErrors = errors + 1;
      setErrors(newErrors);

      if (newErrors >= 5) {
        setActiveTimer(false);
        setDefaiteTemps(true); // affichage du msg defaite
        setQuizLance(false);
      } else {
        setFeedback({
          msg: `Mauvaise réponse ! ❌ (Attention : ${newErrors}/5)`,
          isCorrect: false,
        });
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
      // incrementation pour que la dernière carte soit considérée comme debloquee
      const nouveauCompte = unlockedCount + 1;
      setUnlockedCount(nouveauCompte);
      localStorage.setItem("progression_saisons", nouveauCompte.toString());
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

  // transformer les secondes en 00:00
  const formaterTemps = (secondesTotal) => {
    const minutes = Math.floor(secondesTotal / 60);
    const secondes = secondesTotal % 60;
    return `${minutes.toString().padStart(2, "0")}:${secondes
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <main className={styles.seasonsPage} data-aos="fade-right">
      <h1 className={styles.pageTitle}>
        <h1 className={styles.degraderMarron}>L'Épopée des Saisons</h1>
        <p>Revivez l'intégralité de la saga.</p>
      </h1>
      <div className={styles.mainPic}>
        <img src="images/saison4.jpg" />
      </div>

      {/* Bouton Démarrer */}
      {!quizLance && !victoireTotale && unlockedCount < seasonsData.length && (
        <div className={styles.startContainer}>
          <button onClick={lancerExploration} className={styles.startBtn}>
            <p className={styles.startTxt}>Démarrer l'Exploration ⚔️</p>
          </button>
          <p className={styles.introText}>
            Parcourez les chapitres d'un combat sans fin.
          </p>
        </div>
      )}

      {/* Affichage du chrono */}
      {quizLance && !victoireTotale && (
        <p className={styles.chrono}>{formaterTemps(temps)}</p>
      )}

      {(!victoireTotale || !canExplore) && (
        <div className={styles.seasonsGrid}>
          {seasonsData.map((season, index) => {
            const isUnlocked =
              index < unlockedCount ||
              (index === unlockedCount && showContinueBtn);
            const isCurrent = index === unlockedCount;
            const isLocked = index > unlockedCount && !victoireTotale;
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
                                    disabled={showNextBtn}
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
                      <h2 className={styles.seasonNumber}>{season.nom}</h2>
                      <h2>{season.title}</h2>
                      <p className={styles.seasonDescription}>
                        {season.description}
                      </p>
                      <div className={styles.separator}></div>
                      <p className={styles.seasonHighlight}>
                        {season.highlight}
                      </p>

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
          })}
        </div>
      )}

      {/* MESSAGE DE VICTOIRE */}
      {victoireTotale && canExplore && (
        <div className={styles.messageVictoireFinal}>
          <h1>GARDIEN DE LA MÉMOIRE ⏳</h1>
          <p>Levez le voile sur les récits oubliés de l'humanité.</p>
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
              Retour Accueil
            </button>
          </div>
          <div className={styles.victoireImage}>
            <img src="images/victoire-saison.png" alt="Victoire" />
          </div>
        </div>
      )}

      {/* MESSAGE DE DEFAITE  */}
      {defaiteTemps && (
        <div
          className={styles.messageDefaite}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.95)" }}
        >
          <h1 style={{ color: "red" }}>
            {errors >= 2 ? "CYCLE BRISÉ 🎬" : "TEMPS ÉCOULÉ ⏳"}
          </h1>
          <p className={styles.defaiteTexte}>
            {errors >= 2
              ? "Le fil des événements s'est rompu. Votre chronologie est incomplète."
              : "Vous n'avez pas réussi à lier les époques avant que le passé ne s'efface."}
          </p>
          <div className={styles.defaiteBoutons}>
            <button
              onClick={() => window.location.reload()}
              style={{ backgroundColor: "white", color: "darkred" }}
            >
              Réessayer 🔄
            </button>
            <button onClick={() => (window.location.href = "/")}>
              Retour Accueil
            </button>
          </div>
          <div className={styles.defaiteImage}>
            <img src="images/defaite-saison.png" alt="Défaite" height={200} />
          </div>
        </div>
      )}
    </main>
  );
};

export default Seasons;
