import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/Titans.module.css";
import donneesQuizTitans from "../data/titans.json";

const Titans = () => {
  // Recup le nbr de titans debloques
  const [unlockedCount, setUnlockedCount] = useState(() => {
    const sauvegarde = localStorage.getItem("progression_titans");
    return sauvegarde ? parseInt(sauvegarde, 10) : 0;
  });
  const [tempsEcoule, setTempsEcoule] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const [quizActive, setQuizActive] = useState(false);
  const [etapeQuiz, setEtapeQuiz] = useState(""); // indice, question, debloque
  const [feedback, setFeedback] = useState({ texte: "", couleur: "" });
  const [showContinueBtn, setShowContinueBtn] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [canExplore, setCanExplore] = useState(true);

  const timerRef = useRef(null);
  const cartesRef = useRef([]);

  // On ne gagne que si on a au moins 1 point ET qu'on a atteint le maximum du JSON
  const isVictoireTotale =
    donneesQuizTitans.length > 0 &&
    unlockedCount > 0 &&
    unlockedCount >= donneesQuizTitans.length;

  const enregistrerProgressionTitans = async () => {
    const username = localStorage.getItem("username");
    const dureeEnSecondes = Math.floor(tempsEcoule / 1000);

    try {
      await fetch("http://localhost:5000/update-progression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          pageName: "Page_Titans",
          timeTaken: dureeEnSecondes,
        }),
      });
      console.log("Progression Titans enregistrée !");
    } catch (err) {
      console.error("Erreur de sauvegarde Titans :", err);
    }
  };

  // --- logique du chrono ---
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTempsEcoule((prev) => prev + 1000);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  // declenchement de la save quand tous les titans sont débloqués
  useEffect(() => {
    // on verifie que la victoire est vrai et qu'on a bien débloqué tt les titans pour eviter les bugs
    if (isVictoireTotale && unlockedCount > 0) {
      enregistrerProgressionTitans();
    }
  }, [isVictoireTotale, unlockedCount]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const secondes = Math.floor((ms % 60000) / 1000);
    return `${String(minutes).padStart(2, "0")}:${String(secondes).padStart(2, "0")}`;
  };

  // --- logique du jeu ---
  const gererChrono = () => {
    if (unlockedCount >= donneesQuizTitans.length) return;
    setTimerActive(true);
    setQuizActive(true);
    setEtapeQuiz("indice");
    setFeedback({ texte: "", couleur: "" });

    // 1.5s après l'indice, la question apparaît
    setTimeout(() => {
      setEtapeQuiz("question");
    }, 1500);
  };

  const verifierReponse = (choix, reponseCorrecte) => {
    if (choix === reponseCorrecte) {
      setFeedback({ texte: "✅ Bien joué !", couleur: "lightgreen" });
      setTimerActive(false); // arrêt du chrono pendant l'animation

      setTimeout(() => {
        setEtapeQuiz("debloque");

        setTimeout(() => {
          setQuizActive(false);
          setUnlockedCount((prev) => prev + 1);
          setShowContinueBtn(true);
        }, 1500);
      }, 1000);
    } else {
      setFeedback({ texte: "❌ Réessaie !", couleur: "red" });
    }
  };

  const gererContinuer = () => {
    const nouveauCompte = unlockedCount + 1;
    setUnlockedCount(nouveauCompte);

    // save de la progression
    localStorage.setItem("progression_titans", nouveauCompte.toString());

    setQuizActive(false);
    setEtapeQuiz("");
    setShowContinueBtn(false);

    // on passe a la carte suivante
    if (cartesRef.current[unlockedCount]) {
      cartesRef.current[unlockedCount].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    // lancement auto du prochain quiz après le scroll
    setTimeout(() => {
      gererChrono();
    }, 800);
  };

  return (
    <div className={styles["bg-black"]}>
      <main className={styles["titans-container"]} data-aos="fade-up">
        <h1 className={styles.titre}>
          <span className={styles["degrader-jaune"]}>
            Les Neufs Titans Primordiaux
          </span>
        </h1>

        <span className={styles["founding-titan"]}>
          <img
            src="public/images/titan-originel.jpg"
            height="500"
            width="600"
            alt="titan originel"
          />
        </span>

        <div className={styles["border-grey"]}></div>

        {!isVictoireTotale && (
          <div className={styles.chrono}>
            <button id={styles["btn-action"]} onClick={gererChrono}>
              {unlockedCount === 0 ? "Démarrer" : "Suivant"}
            </button>
            <div id={styles.affichage}>{formatTime(tempsEcoule)}</div>
          </div>
        )}

        {donneesQuizTitans.map((titan, index) => {
          const isUnlocked = index < unlockedCount;
          const isCurrentTarget = index === unlockedCount;
          const showOverlay = isCurrentTarget && quizActive;

          return (
            <div
              key={titan.id}
              className={styles["personnage-carte"]}
              id={titan.id}
              ref={(el) => (cartesRef.current[index] = el)}
            >
              <div
                className={`${styles["flip-cards"]} ${isUnlocked ? styles["est-retournee"] : ""}`}
                style={{ opacity: showOverlay ? 0 : 1 }}
              >
                {/* dos de la carte  */}
                <div className={styles["face-avant"]}>
                  <img
                    src="public/images/face-avant-titans.png"
                    width="auto"
                    height="400"
                    draggable="false"
                    alt="dos carte"
                  />
                </div>

                {/* face arriere */}
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

              {/* overlay du quiz pendant le jeu */}
              {showOverlay && (
                <div className={styles["jeu-dans-carte"]}>
                  {etapeQuiz === "debloque" ? (
                    <h2 style={{ color: "lightgreen" }}>DÉBLOQUÉ !</h2>
                  ) : etapeQuiz === "indice" ? (
                    <div>
                      <h3>INDICE</h3>
                      <p>{titan.indice}</p>
                    </div>
                  ) : (
                    <div>
                      <h2 className={styles.questionQuiz}>{titan.q}</h2>
                      <div className={styles["options-boutons-titans"]}>
                        {titan.choix.map((choixTexte, i) => (
                          <button
                            key={i}
                            className={styles["btn-reponse-quiz"]}
                            onClick={() =>
                              verifierReponse(choixTexte, titan.reponse)
                            }
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

              {/* btn continuer après avoir réussi un quiz */}
              {isUnlocked && index === unlockedCount - 1 && showContinueBtn && (
                <button
                  className={styles["btn-continuer-titan"]}
                  onClick={gererContinuer}
                >
                  Continuer →
                </button>
              )}
            </div>
          );
        })}

        <p className={styles["others-list"]}>
          Autres : Titan Mâchoire, Charrette, Originel.
        </p>
      </main>

      {/* --- msg de victoire --- */}
      {isVictoireTotale && canExplore && (
        <div
          className={styles["message-victoire-final"]}
          style={{ display: "block" }}
        >
          <h1 style={{ fontSize: "3rem" }}>FÉLICITATIONS !</h1>
          <p style={{ color: "white", fontSize: "1.5rem" }}>
            Bravo, vous avez débloqué tous les titans disponibles !
          </p>
          <div className={styles.victoireBoutons}>
            <button onClick={() => setCanExplore(false)}>
              Visiter le site
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("progression_titans");
                window.location.reload();
              }}
            >
              Rejouer
            </button>
            <button onClick={() => (window.location.href = "/Saisons")}>
              Explorer les Saisons
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Titans;
