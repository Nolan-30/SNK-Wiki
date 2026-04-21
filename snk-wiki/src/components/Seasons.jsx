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

  // --- Données des Saisons ---
  const seasonsData = [
    {
      id: 1,
      title: "Saison 1",
      img: "public/images/saison1.png",

      colorClass: styles.borderBlue,
      description:
        "L'humanité vit depuis un siècle protégée par d'immenses murs, jusqu'à l'apparition soudaine du Titan Colossal qui brise le Mur Maria. Après avoir vu sa mère dévorée, Eren Jaeger jure d'exterminer tous les Titans. Avec Mikasa et Armin, il rejoint la 104ème brigade d'entraînement pour apprendre à manier la manœuvre tridimensionnelle et reprendre le district de Trost, marquant ainsi la première victoire de l'humanité.",
      highlight: "Incontournable : La bataille du district de Trost.",
    },
    {
      id: 2,
      title: "Saison 2",
      img: "public/images/saison2.jpg",
      colorClass: styles.borderRed,
      description:
        "Le danger surgit de l'intérieur lorsque des Titans sont repérés au sein du Mur Rose sans qu'aucune brèche ne soit visible. La traque des traîtres s'intensifie au sein du Bataillon d'exploration, menant à la révélation choc des identités des Titans Cuirassé et Colossal. Eren découvre alors un pouvoir mystérieux, l'Axe, lors d'un affrontement désespéré pour sauver ses camarades.",
      highlight: "Moment fort : La trahison de Reiner et Bertholdt.",
    },
    {
      id: 3,
      title: "Saison 3",
      img: "public/images/saison3.jpg",
      colorClass: styles.borderGreen,
      description:
        "Le conflit devient politique lorsque le Bataillon d'exploration est pourchassé par la Brigade de police spéciale. Après avoir renversé le gouvernement corrompu et couronné Historia, les soldats lancent l'opération de reconquête du Mur Maria. Au prix de sacrifices déchirants, ils atteignent enfin la cave de Grisha Jaeger, découvrant la vérité sur le monde extérieur et l'existence d'Eldia et Mahr.",
      highlight: "Clé : La vérité sur le monde extérieur et la mer.",
    },
    {
      id: 4,
      title: "Saison 4",
      img: "public/images/saison4.jpg",
      colorClass: styles.borderOrange,
      description:
        "L'histoire traverse la mer pour se concentrer sur les guerriers de Mahr. La haine ancestrale entre les peuples atteint son paroxysme lorsqu'Eren lance une attaque dévastatrice sur Revelio. Alors que le monde entier se ligue contre l'île du Paradis, Eren active le Grand Terrassement, libérant des millions de Titans pour écraser toute vie hors de l'île, forçant ses anciens alliés à tenter l'impossible pour l'arrêter.",
      highlight: "Conclusion : La fin de l'ère des Titans.",
    },
  ];

  const enregistrerProgression = async () => {
    if (!startTime) return;

    const fin = Date.now();
    const dureeEnSecondes = Math.floor((fin - startTime) / 1000);
    const username = localStorage.getItem("username");

    try {
      const response = await fetch("http://localhost:5000/update-progression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          pageName: "Page_Saisons",
          timeTaken: dureeEnSecondes,
        }),
      });
      const data = await response.json();
      console.log("Progression Saisons sauvée :", data.message);
    } catch (err) {
      console.error("Erreur sauvegarde Saisons :", err);
    }
  };

  // --- Logique du Quiz ---
  const handleAnswer = (choice, correctAnswer) => {
    if (choice === correctAnswer) {
      setFeedback({ msg: "Bonne réponse ! 🎉", isCorrect: true });
      setShowNextBtn(true);
    } else {
      setFeedback({ msg: "Mauvaise réponse ! ❌", isCorrect: false });
    }
  };

  const nextStep = () => {
    const nouveauCompte = unlockedCount + 1;
    setUnlockedCount(nouveauCompte);

    // save
    localStorage.setItem("progression_saisons", nouveauCompte.toString());

    setQuizLance(false);
    setCurrentStep(0);
    setFeedback(null);
    setShowNextBtn(false);
  };

  // vérifie si le nbr de saisons débloqees est égal au total des saisons
  const isVictoireTotale =
    unlockedCount >= seasonsData.length && seasonsData.length > 0;

  return (
    <main className={styles.seasonsMain}>
      <h1 className={styles.pageTitle}>
        <span className={styles.degraderBlanc}>
          Le Récit de Cent Ans de Lutte pour la Liberté
        </span>
      </h1>
      <img
        src="public/images/seasons.jpg"
        alt="Bannière Saisons"
        className={styles.bannerImage}
      />

      {/* Btn de démarrage */}
      {!quizLance && (
        <div className={styles.startContainer}>
          <button
            className={styles.startBtn}
            onClick={() => {
              setQuizLance(true);

              setStartTime(Date.now());
            }}
          >
            Démarrer le Quiz ⚔️
          </button>
        </div>
      )}

      <div className={styles.seasonsGrid}>
        {seasonsData.map((season, index) => {
          const isUnlocked = index < unlockedCount;
          const isCurrent = index === unlockedCount;
          const currentQuiz = quizData[index];

          return (
            <div key={season.id} className={styles.cardContainer}>
              <div
                className={`${styles.flipCardInner} ${isUnlocked ? styles.isFlipped : ""}`}
              >
                {/* FACE AVANT  */}
                <div className={`${styles.faceAvant} ${season.colorClass}`}>
                  {quizLance && isCurrent && currentQuiz ? (
                    <div className={styles.quizContent}>
                      <p className={styles.stepIndicator}>
                        Question {currentStep + 1} / 2
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
                          {currentStep === 0
                            ? "Continuer →"
                            : "Débloquer la saison ! 🔓"}
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
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {isVictoireTotale && (
        <div className={styles.messageVictoireFinal}>
          <h1>FÉLICITATIONS ! 🏆</h1>
          <p>Vous avez exploré toutes les saisons avec succès.</p>
          <div className={styles.victoireBoutons}>
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
