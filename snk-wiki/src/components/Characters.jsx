import { useState, useEffect } from "react";
import CharacterCard from "./CharacterCard";
import "../styles/Characters.css";

import donneesQuiz from "../data/Characters.json";
import charactersInfo from "../data/CharactersInfos.json";

const Characters = () => {
  const [jeuLance, setJeuLance] = useState(false);
  const [indexPerso, setIndexPerso] = useState(0);
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [etape, setEtape] = useState("indice"); // "indice" | "question" | "debloque"
  const [feedback, setFeedback] = useState(null);
  const [debloques, setDebloques] = useState([]);
  const [victoireFinale, setVictoireFinale] = useState(false);
  const [temps, setTemps] = useState(0);

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
    if (!jeuLance || victoireFinale) return;
    const id = setInterval(() => setTemps((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [jeuLance, victoireFinale]);
  useEffect(() => {
    if (victoireFinale === true) {
      enregistrerProgressionPersos();
    }
  }, [victoireFinale]);

  const affichageChrono = `${String(Math.floor(temps / 60)).padStart(2, "0")}:${String(temps % 60).padStart(2, "0")}`;

  const demarrer = () => {
    setTemps(0);
    setJeuLance(true);
    setEtape("indice");
    setTimeout(() => setEtape("question"), 1500);
  };

  const repondre = (choix) => {
    const perso = donneesQuiz[indexPerso];
    const question = perso.questions[indexQuestion];

    if (choix === question.reponse) {
      const nextQ = indexQuestion + 1;

      if (nextQ < perso.questions.length) {
        setFeedback({ texte: "✅ Bien joué !", ok: true });
        setTimeout(() => {
          setFeedback(null);
          setIndexQuestion(nextQ);
          setEtape("indice");
          setTimeout(() => setEtape("question"), 1500);
        }, 1000);
      } else {
        setEtape("debloque");
        setTimeout(() => {
          const nextP = indexPerso + 1;
          setDebloques((d) => [...d, perso.id]);

          if (nextP >= donneesQuiz.length) {
            setVictoireFinale(true);
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
      setFeedback({ texte: "❌ Réessaie !", ok: false });
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const persoActuel = donneesQuiz[indexPerso];
  const questionActuelle = persoActuel?.questions[indexQuestion];

  return (
    <>
      <div className="bataillon">
        <h1>
          <span className="vert">Bataillon</span>
          <span className="degrader-blanc"> D'Exploration</span>
        </h1>
        <p>
          <a className="link" href="#perso-scroll">
            Découvrez l'histoire de ceux qui osent défier les Murs !
          </a>
        </p>
        <div className="img-bat">
          <img src="public/Images/bataillon.jpg" height="500" alt="Bataillon" />
        </div>
      </div>

      <div className="perso-section">
        <h2 id="perso-scroll">Personnages principaux</h2>

        <div className="chrono">
          {!victoireFinale && (
            <button id="btn-action" onClick={demarrer} disabled={jeuLance}>
              {jeuLance ? "En cours..." : "Démarrer"}
            </button>
          )}
          <div id="affichage">{affichageChrono}</div>
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
              <h2 style={{ color: "lightgreen" }}>DÉBLOQUÉ !</h2>
            )}
          </div>
        )}

        <div className="personnages-container">
          {charactersInfo.map((info) => (
            <CharacterCard
              key={info.id}
              nom={info.nom}
              image={info.image}
              description={info.description}
              lien={info.lien}
              debloque={debloques.includes(info.id)}
            />
          ))}
        </div>
      </div>

      {victoireFinale && (
        <div id="message-victoire-final" style={{ display: "block" }}>
          <h1>FÉLICITATIONS !</h1>
          <p>Bravo, vous avez débloqué tous les personnages !</p>
          <button
            className="btn-reponse-quiz"
            onClick={() => window.location.reload()}
          >
            Rejouer
          </button>

          <button
            className="btn-reponse-quiz"
            onClick={() => (window.location.href = "/Titans")}
          >
            Explorer les Titans
          </button>
        </div>
      )}
    </>
  );
};

export default Characters;
