import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/Titans.module.css";
import titansData from "../data/Titans.json";

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
  const [defaiteTemps, setDefaiteTemps] = useState(false);
  const timerRef = useRef(null);
  const cartesRef = useRef([]);

  const [victoireTotale, setVictoireTotale] = useState(false);
  const [errors, setErrors] = useState(0);
  const [defaiteReponse, setDefaiteReponse] = useState(false);

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
    let interval;
    if (timerActive && !victoireTotale && !defaiteTemps) {
      interval = setInterval(() => {
        setTempsEcoule((prev) => {
          if (prev >= 1000) {
            setDefaiteTemps(true);
            setTimerActive(false);
            setQuizActive(false);
            return 5;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, victoireTotale, defaiteTemps]);

  // declenchement de la save quand tous les titans sont débloqués
  useEffect(() => {
    // on verifie que la victoire est vrai et qu'on a bien débloqué tt les titans pour eviter les bugs
    if (victoireTotale && unlockedCount > 0) {
      enregistrerProgressionTitans();
    }
  }, [victoireTotale, unlockedCount]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const secondes = Math.floor((ms % 60000) / 1000);
    return `${String(minutes).padStart(2, "0")}:${String(secondes).padStart(2, "0")}`;
  };

  // --- logique du jeu ---
  const gererChrono = () => {
    if (unlockedCount >= titansData.length) return;
    setErrors(0);
    setTimerActive(true);
    setTempsEcoule(0);
    setQuizActive(true);
    setEtapeQuiz("indice");
    setDefaiteTemps(false);
    setFeedback({ texte: "", couleur: "" });

    // 1.5s après l'indice, la question apparaît
    setTimeout(() => {
      setEtapeQuiz("question");
    }, 1500);
  };

  const lancerExploration = () => {
    setQuizActive(true);
    setEtapeQuiz("indice");
    setTempsEcoule(1);
    gererChrono();
  };
  const verifierReponse = (choix, reponseCorrecte) => {
    if (choix === reponseCorrecte) {
      setFeedback({ texte: "✅ Bonne réponse!", couleur: "lightgreen" });
      setTimerActive(false);
      setErrors(0);

      setTimeout(() => {
        setEtapeQuiz("debloque");
        const nouveauCompte = unlockedCount + 1;

        setTimeout(() => {
          if (nouveauCompte >= titansData.length) {
            setUnlockedCount(nouveauCompte);
            localStorage.setItem(
              "progression_titans",
              nouveauCompte.toString(),
            );
            setVictoireTotale(true);
            setQuizActive(false);
          } else {
            setQuizActive(false);
            setShowContinueBtn(true);
          }
        }, 1500);
      }, 1000);
    } else {
      // --- LOGIQUE DES ERREURS ---
      const newErrors = errors + 1;
      setErrors(newErrors);

      if (newErrors >= 5) {
        setTimerActive(false);
        setDefaiteTemps(true);
        setQuizActive(false);
      } else {
        setFeedback({
          texte: `❌ Réessaie ! (Attention : ${newErrors}/5)`,
          couleur: "red",
        });
      }
    }
  };

  const gererContinuer = () => {
    const nouveauCompte = unlockedCount + 1;
    setUnlockedCount(nouveauCompte);

    if (nouveauCompte >= titansData.length) {
      setVictoireTotale(true);
    }

    localStorage.setItem("progression_titans", nouveauCompte.toString());

    setQuizActive(false);
    setEtapeQuiz("");
    setShowContinueBtn(false);

    if (cartesRef.current[nouveauCompte]) {
      cartesRef.current[nouveauCompte].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    setTimeout(() => {
      gererChrono();
    }, 800);
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
    <div className={styles["bg-black"]}>
      <main className={styles["titans-container"]} data-aos="fade-right">
        <h1 className={styles.titre}>
          <span className={styles["degrader-jaune"]}>
            {/* Les Neufs */}
            Titans Primordiaux
          </span>
          <p>Découvrez les puissances originelles.</p>
        </h1>

        <span className={styles["founding-titan"]}>
          <img
            src="images/titan-originel.jpg"
            height="500"
            width="600"
            alt="titan originel"
          />
        </span>

        <div className={styles["border-grey"]}></div>

        {!quizActive && !victoireTotale && !defaiteTemps && (
          <div className={styles.startContainer}>
            <button onClick={lancerExploration} className={styles.quizBtn}>
              <p className={styles.startTxt}>Démarrer l'Exploration ⚔️</p>
            </button>
            <p className={styles.introText}>
              Faites face aux prédateurs originels de ce monde.
            </p>
          </div>
        )}

        {quizActive && (
          <div className={styles.affichageTempsLive}>
            <p>{formaterTemps(tempsEcoule)}</p>
          </div>
        )}

        {titansData.map((titan, index) => {
          const isUnlocked =
            index < unlockedCount ||
            (index === unlockedCount && showContinueBtn);
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
                    <h2 style={{ color: "lightgreen" }}>Titan débloqué !</h2>
                  ) : etapeQuiz === "indice" ? (
                    <div className={styles.indice}>
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

              {showContinueBtn && index === unlockedCount && (
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

      {/* MESSAGE DE VICTOIRE */}
      {victoireTotale && canExplore && (
        <div className={styles.messageVictoireFinal}>
          <h1>MAÎTRE DES COLOSSES 👹</h1>
          <p>
            Vous avez percé le mystère des neuf primordiaux. L'humanité est
            enfin hors de danger
          </p>
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
            <img src="images/victoire-titans.png" alt="Victoire" />
          </div>
        </div>
      )}

      {/* MESSAGE DEFAITE TEMPS/ERREURS */}
      {defaiteTemps && (
        <div className={styles.messageDefaite}>
          <h1 style={{ color: "red", fontSize: "3rem", marginTop: "-5%" }}>
            {errors >= 5 ? "DÉVORÉ PAR LE DESTIN 🩸" : "TEMPS ÉCOULÉ ⏳"}
          </h1>

          <p
            style={{ color: "white", fontSize: "1.2rem", marginBottom: "20px" }}
          >
            {errors >= 5
              ? "La puissance des primordiaux vous a submergé. Les murs sont tombés."
              : "L'opportunité de frapper est passée. Les Titans ont brisé les lignes de défense avant votre analyse."}
          </p>

          <div className={styles.defaiteBoutons}>
            <button
              onClick={() => {
                window.location.reload();
              }}
            >
              Réessayer 🔄
            </button>
            <button onClick={() => (window.location.href = "/")}>
              Retour Accueil
            </button>
          </div>

          <div className={styles.defaiteImage}>
            <img src="images/defaite-titans.png" alt="Defaite Titans" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Titans;
