import { useState, useEffect } from "react";
import CharacterCard from "./CharacterCard";
import "../styles/Characters.css";

import charactersData from "../data/Characters.json";

const Characters = () => {
  const [jeuLance, setJeuLance] = useState(false);
  const [indexPerso, setIndexPerso] = useState(0);
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [etape, setEtape] = useState("indice"); // "indice" | "question" | "debloque"
  const [feedback, setFeedback] = useState(null);
  const [victoireTotale, setvictoireTotale] = useState(false);
  const [temps, setTemps] = useState(0);
  const [canExplore, setCanExplore] = useState(true);
  const [defaiteTemps, setDefaiteTemps] = useState(false);
  const [errors, setErrors] = useState(0);

  const [debloques, setDebloques] = useState(() => {
    const sauvegarde = localStorage.getItem("personnages_debloques");
    return sauvegarde ? JSON.parse(sauvegarde) : [];
  });

  const enregistrerProgressionPersos = async () => {
    const username = localStorage.getItem("username");

    try {
      await fetch("http://localhost:5000/update-progression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          pageName: "Page_Personnages",
          timeTaken: temps, //
        }),
      });
      console.log("Progression Personnages enregistrée ! 🏆");
    } catch (err) {
      console.error("Erreur sauvegarde personnages :", err);
    }
  };

  // Chrono
  useEffect(() => {
    let interval;
    if (jeuLance && !victoireTotale && !defaiteTemps) {
      interval = setInterval(() => {
        setTemps((prev) => {
          if (prev >= 10) {
            setDefaiteTemps(true);
            setJeuLance(false);
            return 5;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [jeuLance, victoireTotale, defaiteTemps]);

  useEffect(() => {
    if (victoireTotale === true) {
      enregistrerProgressionPersos();
    }
  }, [victoireTotale]);

  const demarrer = () => {
    setTemps(0);
    setErrors(0);
    setJeuLance(true);
    setEtape("indice");
    setTimeout(() => setEtape("question"), 1500);
  };

  const repondre = (choix) => {
    const perso = charactersData[indexPerso];
    const question = perso.questions[indexQuestion];

    if (choix === question.reponse) {
      const nextQ = indexQuestion + 1;

      if (nextQ < perso.questions.length) {
        setFeedback({ texte: "✅ Bonne réponse !", ok: true });
        setTimeout(() => {
          setFeedback(null);
          setIndexQuestion(nextQ);
          setEtape("indice");
          setTimeout(() => setEtape("question"), 1500);
        }, 1000);
      } else {
        // Logique de déblocage du personnage
        setEtape("debloque");
        setTimeout(() => {
          const nextP = indexPerso + 1;
          const nouvelleListe = [...debloques, perso.id];
          setDebloques(nouvelleListe);
          localStorage.setItem(
            "personnages_debloques",
            JSON.stringify(nouvelleListe),
          );

          if (nextP >= charactersData.length) {
            setvictoireTotale(true);
            setJeuLance(false);
          } else {
            setIndexPerso(nextP);
            setIndexQuestion(0);
            setEtape("indice");
            setTimeout(() => setEtape("question"), 1500);
          }
        }, 1500);
      }
    } else {
      // --- LOGIQUE DES ERREURS ---
      const newErrors = errors + 1;
      setErrors(newErrors);

      if (newErrors >= 5) {
        setDefaiteTemps(true);
        setJeuLance(false);
      } else {
        setFeedback({
          texte: `❌ Mauvaise réponse ! (Attention : ${newErrors}/5)`,
          ok: false,
        });
        setTimeout(() => setFeedback(null), 1500);
      }
    }
  };

  const formaterTemps = (secondesTotal) => {
    const minutes = Math.floor(secondesTotal / 60);
    const secondes = secondesTotal % 60;
    return `${minutes.toString().padStart(2, "0")}:${secondes
      .toString()
      .padStart(2, "0")}`;
  };

  const persoActuel = charactersData[indexPerso];
  const questionActuelle = persoActuel?.questions[indexQuestion];

  return (
    <>
      <div className="bataillon" data-aos="fade-right">
        <h1>
          <span className="vert">Bataillon</span>
          <span className="degrader-blanc"> D'Exploration</span>
        </h1>
        <p>
          <a className="link">
            Découvrez l'histoire de ceux qui osent défier les Murs !
          </a>
        </p>
        <div className="img-bat">
          <img src="public/images/bataillon.jpg" height="500" alt="Bataillon" />
        </div>
      </div>

      <div className="perso-section">
        <div className="chrono">
          {!victoireTotale && (
            <div className="startContainer">
              <button onClick={demarrer} className="quizBtn">
                <p className="startTxt">Démarrer l'Exploration </p>
              </button>
              <p className="introText">
                Découvrez les visages qui ont bravé le destin.
              </p>
            </div>
          )}
          {/* Le chrono s'affiche uniquement si le jeu est lancé */}
          {jeuLance && <p>{formaterTemps(temps)}</p>}
        </div>

        {jeuLance && persoActuel && (
          <div id="jeu-dans-carte">
            {etape === "indice" && (
              <div>
                <h3>INDICE</h3>
                <p>{questionActuelle?.indice}</p>
              </div>
            )}
            {etape === "question" && questionActuelle && (
              <div>
                <h2>{questionActuelle.qst}</h2>
                <div id="options-boutons">
                  {questionActuelle.choix.map((c) => (
                    <button
                      key={c}
                      className="btn-reponse-quiz"
                      onClick={() => repondre(c)}
                      disabled={feedback && feedback.ok}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                {feedback && (
                  <p style={{ color: feedback.ok ? "lightgreen" : "red" }}>
                    {feedback.texte}
                  </p>
                )}
              </div>
            )}
            {etape === "debloque" && (
              <h2 style={{ color: "lightgreen" }}>Personnage débloqué !</h2>
            )}
          </div>
        )}

        <div className="personnages-container">
          {charactersData.map((char) => (
            <CharacterCard
              key={char.id}
              nom={char.nom}
              image={char.image}
              description={char.description}
              lien={char.lien}
              debloque={debloques.includes(char.id)}
            />
          ))}
        </div>
      </div>
      {/* MESSAGE DE VICTOIRE */}
      {victoireTotale && canExplore && (
        <div className="messageVictoireFinal">
          <h1>ARCHIVISTE DU BATAILLON 🎖️</h1>
          <p>
            Le destin de chaque héros et chaque traître n'a plus de secret pour
            vous.
          </p>
          <div className="victoireBoutons">
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
          <div className="victoireImage">
            <img src="images/victoire-perso.png" alt="Victoire" />
          </div>
        </div>
      )}
      {/* MESSAGE DEFAITE TEMPS/ERREURS */}
      {defaiteTemps && (
        <div className="messageDefaite">
          <h1 style={{ color: "red", fontSize: "3rem", marginTop: "5%" }}>
            {errors >= 5 ? "SOLDAT TOMBÉ ⚔️" : "TEMPS ÉCOULÉ ⏳"}
          </h1>

          <p
            style={{ color: "white", fontSize: "1.2rem", marginBottom: "20px" }}
          >
            {errors >= 5
              ? "Le temps de la décision est révolu. Vos alliés ont dû battre en retraite sans vous attendre."
              : "Vous avez perdu la trace de vos alliés. Le bataillon est décimé."}
          </p>

          <div className="defaiteBoutons">
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

          <div className="defaiteImage">
            <img src="images/defaite-perso.png" alt="Défaite" />
          </div>
        </div>
      )}
    </>
  );
};

export default Characters;
