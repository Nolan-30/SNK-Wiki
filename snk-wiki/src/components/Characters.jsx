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
  const [victoireFinale, setVictoireFinale] = useState(false);
  const [temps, setTemps] = useState(0);
  const [canExplore, setCanExplore] = useState(true);

  const [debloques, setDebloques] = useState(() => {
    const sauvegarde = localStorage.getItem("personnages_debloques");
    return sauvegarde ? JSON.parse(sauvegarde) : [];
  });

  const [errors, setErrors] = useState(0);

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
      // --- LOGIQUE DES ERREURS ---
      const newErrors = errors + 1;
      setErrors(newErrors);

      if (newErrors >= 2) {
        alert(
          "Trop d'erreurs ! Vous devez recommencer l'exploration depuis le début. ⚔️",
        );
        setErrors(0);
        setDebloques([]); // On vide la liste des debloques
        setJeuLance(false);
        localStorage.removeItem("personnages_debloques"); // supp la save
        window.location.reload();
      } else {
        setFeedback({
          texte: `❌ Mauvaise réponse ! (Attention : ${newErrors}/2)`,
          ok: false,
        });
        setTimeout(() => setFeedback(null), 1500);
      }
    }
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

      {victoireFinale && canExplore && (
        <div id="message-victoire-final" style={{ display: "block" }}>
          <h1>FÉLICITATIONS !</h1>
          <p>Bravo, vous avez débloqué tous les personnages !</p>
          <button onClick={() => setCanExplore(false)}>Visiter le site</button>
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
