import React, { useState } from "react";
import quizData from "../data/history.json";
import styles from "../styles/History.module.css";

const History = () => {
  // --- États ---
  const [quizLance, setQuizLance] = useState(false);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showNextBtn, setShowNextBtn] = useState(false);

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
    } else {
      setUnlockedCount((prev) => prev + 1);
      setCurrentStep(0);
    }
    setFeedback(null);
    setShowNextBtn(false);
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
          alt="Ymir"
          className={styles.historyHeroImg}
        />
        <div className={styles.separateurRouge}></div>
      </div>

      {!quizLance ? (
        <div className={styles.startContainer}>
          <p className={styles.introText}>
            Plongez dans les secrets de l'humanité. Répondez correctement pour
            débloquer les archives.
          </p>
          <button
            onClick={() => setQuizLance(true)}
            className={styles.startBtn}
          >
            Démarrer l'Exploration ⚔️
          </button>
        </div>
      ) : (
        <section className={styles.boiteContenu}>
          {/* ORIGINE */}
          <div
            className={`${styles.sectionTexte} ${unlockedCount < 1 ? styles.activeQuiz : ""}`}
          >
            <h2 className={styles.sousTitre}>ORIGINE</h2>
            {unlockedCount >= 1 ? (
              <p className={styles.historyParam}>
                L'histoire se déroule dans un monde où l'humanité vit entourée
                d'immenses murs... marquant la fin de cent ans de paix.
              </p>
            ) : (
              <QuizZone
                data={quizData[0]}
                currentStep={currentStep}
                handleAnswer={handleAnswer}
                feedback={feedback}
                showNextBtn={showNextBtn}
                nextStep={nextStep}
              />
            )}
          </div>

          {/* MURS */}
          <div
            className={`${styles.sectionTexte} ${unlockedCount === 1 ? styles.activeQuiz : ""} ${unlockedCount < 1 ? styles.locked : ""}`}
          >
            <h2 className={styles.sousTitre}>LES MURS</h2>
            {unlockedCount >= 2 ? (
              <p className={styles.historyParam}>
                Trois murs concentriques protègent les derniers humains : Maria,
                Rose et Sina... un secret gardé par la famille royale.
              </p>
            ) : unlockedCount === 1 ? (
              <QuizZone
                data={quizData[1]}
                currentStep={currentStep}
                handleAnswer={handleAnswer}
                feedback={feedback}
                showNextBtn={showNextBtn}
                nextStep={nextStep}
              />
            ) : (
              <p className={styles.lockedText}>
                🔒 Débloquez la section précédente pour lire la suite.
              </p>
            )}
          </div>

          {/* THÈMES */}
          <div
            className={`${styles.sectionThemes} ${unlockedCount === 2 ? styles.activeQuiz : ""} ${unlockedCount < 2 ? styles.locked : ""}`}
          >
            <h2 className={styles.sousTitre}>LES THÈMES</h2>
            {unlockedCount >= 3 ? (
              <div className={styles.grilleCartes}>
                <article className={`${styles.carte} ${styles.carteBlanche}`}>
                  <h3>La Liberté</h3>
                  <p>Le désir inné d'Eren de voir le monde extérieur.</p>
                </article>
                <article className={`${styles.carte} ${styles.carteBlanche}`}>
                  <h3>La Guerre</h3>
                  <p>La complexité des conflits sans camp défini.</p>
                </article>
                <article className={`${styles.carte} ${styles.carteRouge}`}>
                  <h3>Le Cycle de la Haine</h3>
                  <p>Comment la violence engendre la violence.</p>
                </article>
              </div>
            ) : unlockedCount === 2 ? (
              <QuizZone
                data={quizData[2]}
                currentStep={currentStep}
                handleAnswer={handleAnswer}
                feedback={feedback}
                showNextBtn={showNextBtn}
                nextStep={nextStep}
              />
            ) : (
              <p className={styles.lockedText}>
                🔒 Les thèmes sont encore secrets.
              </p>
            )}
          </div>
        </section>
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
    <p className={styles.quizQuestion}>{data.questions[currentStep].qst}</p>
    <div className={styles.optionsGrid}>
      {data.questions[currentStep].choix.map((c) => (
        <button
          key={c}
          onClick={() => handleAnswer(c, data.questions[currentStep].reponse)}
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
        Continuer →
      </button>
    )}
  </div>
);

export default History;
