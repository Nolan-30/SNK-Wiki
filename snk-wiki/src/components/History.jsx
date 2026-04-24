import React, { useState } from "react";
import quizData from "../data/History.json";
import styles from "../styles/History.module.css";

const History = () => {
  // --- États ---
  const [quizLance, setQuizLance] = useState(false);

  const [unlockedCount, setUnlockedCount] = useState(() => {
    const sauvegarde = localStorage.getItem("progression_histoire");
    return sauvegarde ? parseInt(sauvegarde, 10) : 0;
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showNextBtn, setShowNextBtn] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [canExplore, setCanExplore] = useState(true);
  const [victoireTotale, setVictoireTotale] = useState(false);

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
    const totalQuestions = quizData[unlockedCount]?.questions?.length || 0;

    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
      setFeedback(null);
      setShowNextBtn(false);
    } else {
      // Fin du chapitre actuel
      const nouveauCompte = unlockedCount + 1;

      if (nouveauCompte >= quizData.length) {
        setUnlockedCount(nouveauCompte);
        localStorage.setItem("progression_histoire", nouveauCompte.toString());
        setVictoireTotale(true);
        setQuizLance(false); // On arrête le quiz seulement ici
        enregistrerProgression();
      } else {
        // passe au chap suivant
        setUnlockedCount(nouveauCompte);
        localStorage.setItem("progression_histoire", nouveauCompte.toString());
        setCurrentStep(0); // Reset l'étape pour le nouveau chapitre
        setFeedback(null);
        setShowNextBtn(false);
      }
    }
  };

  const enregistrerProgression = async () => {
    if (!startTime) return;
    const fin = Date.now();
    const dureeEnSecondes = Math.floor((fin - startTime) / 1000);
    const username = localStorage.getItem("username");

    try {
      await fetch("http://localhost:5000/update-progression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          pageName: "Page_Histoire",
          timeTaken: dureeEnSecondes,
        }),
      });
    } catch (err) {
      console.error("Erreur de sauvegarde :", err);
    }
  };

  return (
    <main className={styles.historyMain}>
      <div className={styles.titrePrincipalConteneur}>
        <h1 className={styles.historyTitle}>
          <span className={styles.degraderRouge}>
            L'Histoire D'un Monde Cruel
          </span>
        </h1>
        <img
          src="images/ymir.jpg"
          alt="Ymir Fritz"
          className={styles.historyHeroImg}
        />
        <div className={styles.separateurRouge}></div>
      </div>

      {!quizLance && (
        <div className={styles.startContainer}>
          <p className={styles.introText}>
            Plongez dans les secrets de l'humanité. Répondez correctement aux
            questions pour débloquer les archives.
          </p>
          <button
            onClick={() => {
              if (unlockedCount >= quizData.length) {
                setUnlockedCount(0);
                setVictoireTotale(false);
                localStorage.removeItem("progression_histoire");
              }
              setQuizLance(true);
              setCurrentStep(0);
              setFeedback(null);
              setShowNextBtn(false);
              setStartTime(Date.now());
            }}
            className={styles.startBtn}
          >
            {unlockedCount >= quizData.length
              ? "Recommencer l'Aventure 🔄"
              : unlockedCount > 0
                ? `Reprendre au Chapitre ${unlockedCount + 1} ⚔️`
                : "Démarrer l'Exploration ⚔️"}
          </button>
        </div>
      )}

      <section className={styles.boiteContenu}>
        {/* ORIGINE */}
        <section
          className={`${styles.sectionTexte} ${unlockedCount < 1 ? styles.activeQuiz : ""}`}
        >
          <h2 className={styles.sousTitre}>ORIGINE</h2>
          {(unlockedCount >= 1 || victoireTotale) &&
          !(quizLance && unlockedCount === 0) ? (
            <p className={styles.historyParam}>
              L'histoire se déroule dans un monde où l'humanité vit entourée
              d'immenses murs pour se protéger de créatures gigantesques, les
              Titans. Le récit commence avec la chute du Mur Maria, brisé par le
              Titan Colossal et le Titan Cuirassé.
            </p>
          ) : (
            unlockedCount === 0 &&
            quizLance && (
              <QuizZone
                data={quizData[0]}
                currentStep={currentStep}
                handleAnswer={handleAnswer}
                feedback={feedback}
                showNextBtn={showNextBtn}
                nextStep={nextStep}
              />
            )
          )}
        </section>

        {/* LES MURS */}
        <section
          className={`${styles.sectionTexte} ${unlockedCount === 1 ? styles.activeQuiz : ""} ${unlockedCount < 1 ? styles.locked : ""}`}
        >
          <h2 className={styles.sousTitre}>LES MURS</h2>
          {(unlockedCount >= 2 || victoireTotale) &&
          !(quizLance && unlockedCount === 1) ? (
            <p className={styles.historyParam}>
              Trois murs concentriques protègent les humains : Maria, Rose et
              Sina. Personne ne sait comment ils ont été construits, un secret
              gardé jalousement par le culte du Mur et la famille royale.
            </p>
          ) : unlockedCount === 1 && quizLance ? (
            <QuizZone
              data={quizData[1]}
              currentStep={currentStep}
              handleAnswer={handleAnswer}
              feedback={feedback}
              showNextBtn={showNextBtn}
              nextStep={nextStep}
            />
          ) : (
            unlockedCount < 1 && (
              <p className={styles.lockedText}>🔒 Section verrouillée</p>
            )
          )}
        </section>

        {/* LIBERTÉ */}
        <section
          className={`${styles.sectionTexte} ${unlockedCount === 2 ? styles.activeQuiz : ""} ${unlockedCount < 2 ? styles.locked : ""}`}
        >
          <h2 className={styles.sousTitre}>LA LIBERTÉ</h2>
          {(unlockedCount >= 3 || victoireTotale) &&
          !(quizLance && unlockedCount === 2) ? (
            <p className={styles.historyParam}>
              Le désir inné d'Eren de voir le monde extérieur, quel qu'en soit
              le prix. C'est le moteur principal de son combat contre
              l'oppression.
            </p>
          ) : unlockedCount === 2 && quizLance ? (
            <QuizZone
              data={quizData[2]}
              currentStep={currentStep}
              handleAnswer={handleAnswer}
              feedback={feedback}
              showNextBtn={showNextBtn}
              nextStep={nextStep}
            />
          ) : (
            unlockedCount < 2 && (
              <p className={styles.lockedText}>🔒 Section verrouillée</p>
            )
          )}
        </section>

        {/* LA GUERRE */}
        <section
          className={`${styles.sectionTexte} ${unlockedCount === 3 ? styles.activeQuiz : ""} ${unlockedCount < 3 ? styles.locked : ""}`}
        >
          <h2 className={styles.sousTitre}>LA GUERRE</h2>
          {(unlockedCount >= 4 || victoireTotale) &&
          !(quizLance && unlockedCount === 3) ? (
            <p className={styles.historyParam}>
              L'œuvre explore la complexité des conflits où il n'y a ni gentils
              ni méchants absolus, seulement des perspectives différentes
              s'affrontant pour la survie.
            </p>
          ) : unlockedCount === 3 && quizLance ? (
            <QuizZone
              data={quizData[3]}
              currentStep={currentStep}
              handleAnswer={handleAnswer}
              feedback={feedback}
              showNextBtn={showNextBtn}
              nextStep={nextStep}
            />
          ) : (
            unlockedCount < 3 && (
              <p className={styles.lockedText}>🔒 Section verrouillée</p>
            )
          )}
        </section>

        {/* LE CYCLE DE LA HAINE */}
        <section
          className={`${styles.sectionTexte} ${unlockedCount === 4 ? styles.activeQuiz : ""} ${unlockedCount < 4 ? styles.locked : ""}`}
        >
          <h2 className={styles.sousTitre}>LE CYCLE DE LA HAINE</h2>
          {(unlockedCount >= 5 || victoireTotale) &&
          !(quizLance && unlockedCount === 4) ? (
            <p className={styles.historyParam}>
              Le thème final montre comment la violence engendre la haine,
              créant un cycle sans fin qui se transmet de génération en
              génération jusqu'à ce que quelqu'un tente de le briser.
            </p>
          ) : unlockedCount === 4 && quizLance ? (
            <QuizZone
              data={quizData[4]}
              currentStep={currentStep}
              handleAnswer={handleAnswer}
              feedback={feedback}
              showNextBtn={showNextBtn}
              nextStep={nextStep}
            />
          ) : (
            unlockedCount < 4 && (
              <p className={styles.lockedText}>🔒 Section verrouillée</p>
            )
          )}
        </section>
      </section>

      {/* --- MSG DE VICTOIRE --- */}
      {victoireTotale && canExplore && (
        <div className={styles.messageVictoireFinal}>
          <h1>Page Histoire Débloquée !</h1>
          <div className={styles.victoireBoutons}>
            <button onClick={() => setCanExplore(false)}>
              Relire l'Histoire
            </button>
            <button onClick={() => window.location.reload()}>Rejouer</button>
            <button onClick={() => (window.location.href = "/")}>
              Accueil
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

const QuizZone = ({
  data,
  currentStep,
  handleAnswer,
  feedback,
  showNextBtn,
  nextStep,
}) => (
  <div className={styles.quizBox}>
    {data?.questions?.[currentStep] && (
      <>
        <p className={styles.quizQuestion}>{data.questions[currentStep].qst}</p>
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
        {feedback && (
          <p className={feedback.isCorrect ? styles.success : styles.error}>
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
);

export default History;
