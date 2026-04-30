import React, { useState } from "react";
import styles from "../styles/Seasons.module.css";
import quizData from "../data/Seasons.json";

const Seasons = () => {
  // --- États ---
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

  // --- Donnees des Saisons ---
  const seasonsData = [
    {
      id: 1,
      title: "Saison 1",
      img: "public/images/saison1.png",
      colorClass: styles.borderBlue,
      description:
        "L'humanité vit depuis un siècle protégée par d'immenses murs, jusqu'à l'apparition soudaine du Titan Colossal qui brise le Mur Maria. Après avoir vu sa mère dévorée, Eren Jaeger jure d'exterminer tous les Titans.",
      highlight: "Le début de l'épopée d'Eren.",
    },
    {
      id: 2,
      title: "Saison 2",
      img: "images/saison2.png",
      colorClass: styles.borderYellow,
      description:
        "La lutte continue alors que de nouveaux Titans apparaissent à l'intérieur du Mur Rose. Des trahisons au sein du Bataillon d'exploration sont révélées, changeant à jamais la perception de l'ennemi.",
      highlight: "La révélation du Titan Cuirassé et du Colossal.",
    },
    {
      id: 3,
      title: "Saison 3",
      img: "images/saison3.jpg",
      colorClass: styles.borderRed,
      description:
        "Le conflit devient politique avec une lutte contre le gouvernement corrompu, menant à la reconquête du Mur Maria et à la découverte des secrets cachés dans la cave de Grisha Jaeger.",
      highlight: "La vérité sur le monde extérieur.",
    },
    {
      id: 4,
      title: "Saison Finale",
      img: "public/images/s4.png",
      colorClass: styles.borderBlack,
      description:
        "La guerre traverse l'océan pour atteindre le continent de Mahr. Eren lance une attaque dévastatrice, déclenchant le Grand Terrassement pour protéger l'île du Paradis, menant au dénouement final.",
      highlight: "L'ultime bataille pour la liberté.",
    },
  ];

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
      setShowNextBtn(true);
    } else {
      setFeedback({ msg: "Mauvaise réponse ! ❌", isCorrect: false });
      setShowNextBtn(false); // cache le btn si la réponse est fausse
    }
  };

  const nextStep = () => {
    const currentQuiz = quizData[unlockedCount];
    if (currentStep < currentQuiz.questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setFeedback(null);
      setShowNextBtn(false);
    } else {
      setQuizLance(false);
      setShowContinueBtn(true);
      setShowNextBtn(false);
    }
  };

  const gererChrono = () => {
    if (!quizLance) {
      setQuizLance(true);
      setStartTime(Date.now());
      setCurrentStep(0);
      setFeedback(null);
      setShowNextBtn(false);
      setShowContinueBtn(false);
    }
  };

  return (
    <main className={styles.seasonsPage} data-aos="fade-up">
      <h1 className={styles.pageTitle}>
        L'Épopée des Saisons
        <p>
          Revivez l'intégralité de la saga.
          {/* de la chute du Mur Maria jusqu'à l'ultime affrontement." */}
        </p>
      </h1>

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

      {!victoireTotale && (
        <div className={styles.seasonsGrid}>
          {seasonsData.map((season, index) => {
            const isUnlocked =
              index < unlockedCount ||
              (index === unlockedCount && showContinueBtn);
            const isCurrent = index === unlockedCount;
            const isLocked = index > unlockedCount;
            const currentQuiz = quizData[index];

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
                        <p className={styles.questionText}>
                          {currentQuiz.questions[currentStep].qst}
                        </p>

                        <div className={styles.optionsGrid}>
                          {currentQuiz.questions[currentStep].choix.map((c) => (
                            <button
                              key={c}
                              onClick={() =>
                                handleAnswer(
                                  c,
                                  currentQuiz.questions[currentStep].reponse,
                                )
                              }
                              className={styles.quizBtn}
                            >
                              {c}
                            </button>
                          ))}
                        </div>

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
