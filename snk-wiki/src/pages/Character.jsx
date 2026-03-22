import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { donneesQuizPerso } from "../data/CharacterQuiz.json";
import charactersData from "../data/characters.json";
import "../css/character.css";

function Character() {
  const [indexPerso, setIndexPerso] = useState(0);
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [phase, setPhase] = useState("attente"); // attente | indice | question | debloque
  const [feedback, setFeedback] = useState(null);
  const [cartesRetournees, setCartesRetournees] = useState([]);
  const [victoire, setVictoire] = useState(false);
  const [temps, setTemps] = useState(0);
  const [chronoActif, setChronoActif] = useState(false);

  const personnages = donneesQuizPerso.personnages;
  const persoActuel = personnages[indexPerso];
  const questionActuelle = persoActuel?.questions[indexQuestion];

  // Chrono
  useEffect(() => {
    if (!chronoActif) return;
    const id = setInterval(() => setTemps((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [chronoActif]);

  const minutes = String(Math.floor(temps / 60)).padStart(2, "0");
  const secondes = String(temps % 60).padStart(2, "0");

  const demarrer = () => {
    setPhase("indice");
    setChronoActif(true);
    setTimeout(() => setPhase("question"), 1500);
  };

  const repondre = (choix) => {
    if (choix === questionActuelle.reponse) {
      const prochainIndex = indexQuestion + 1;

      if (prochainIndex < persoActuel.questions.length) {
        setFeedback("✅ Bien joué !");
        setTimeout(() => {
          setFeedback(null);
          setIndexQuestion(prochainIndex);
          setPhase("indice");
          setTimeout(() => setPhase("question"), 1500);
        }, 1000);
      } else {
        // Carte débloquée
        setPhase("debloque");
        setChronoActif(false);
        const nouvelles = [...cartesRetournees, indexPerso];
        setCartesRetournees(nouvelles);
        if (nouvelles.length >= personnages.length) {
          setTimeout(() => setVictoire(true), 1500);
        }
      }
    } else {
      setFeedback("❌ Réessaie !");
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const continuer = () => {
    setIndexPerso((i) => i + 1);
    setIndexQuestion(0);
    setPhase("indice");
    setFeedback(null);
    setTimeout(() => setPhase("question"), 1500);
  };

  return (
    <>
      <Header />

      <div className="bataillon">
        <h1>
          <span className="vert">Bataillon</span>
          <span className="degrader-blanc"> D'Exploration</span>
        </h1>
        <p>
          <a className="link" href="#perso-scroll">
            Découvrez l'histoire de ceux qui osent défier les Murs, les Héros du
            Bataillon d'Exploration !
          </a>
        </p>
        <div className="img-bat">
          <img src="/Images/bataillon.jpg" height="500" alt="bataillon" />
        </div>
      </div>

      <div className="perso-section">
        <h2 id="perso-scroll">Personnages principaux</h2>

        {/* Chrono */}
        <div className="chrono">
          {phase === "attente" && (
            <button id="btn-action" onClick={demarrer}>
              Démarrer
            </button>
          )}
          <div id="affichage">
            {minutes}:{secondes}
          </div>
        </div>

        <div className="personnages-container">
          {personnages.map((perso, i) => (
            <div className="personnage-carte" key={perso.id}>
              <div
                className={`flip-cards ${cartesRetournees.includes(i) ? "est-retournee" : ""}`}
              >
                {/* FACE AVANT */}
                <div className="face-avant">
                  {i === indexPerso &&
                  phase !== "attente" &&
                  !cartesRetournees.includes(i) ? (
                    <div id="jeu-dans-carte">
                      {phase === "indice" && (
                        <>
                          <h3>INDICE</h3>
                          <p>{questionActuelle.indice}</p>
                        </>
                      )}
                      {phase === "question" && (
                        <>
                          <h2>{questionActuelle.q}</h2>
                          <div id="options-boutons">
                            {questionActuelle.choix.map((choix) => (
                              <button
                                key={choix}
                                className="btn-reponse-quiz"
                                onClick={() => repondre(choix)}
                              >
                                {choix}
                              </button>
                            ))}
                          </div>
                          {feedback && (
                            <p
                              style={{
                                color: feedback.includes("✅")
                                  ? "lightgreen"
                                  : "red",
                              }}
                            >
                              {feedback}
                            </p>
                          )}
                        </>
                      )}
                      {phase === "debloque" && (
                        <>
                          <h2 style={{ color: "lightgreen" }}>DÉBLOQUÉ !</h2>
                          {i + 1 < personnages.length && (
                            <button
                              className="btn-reponse-quiz"
                              onClick={continuer}
                            >
                              Continuer →
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <img
                      src="/Images/face-avant-perso.jpg"
                      height="auto"
                      width="250"
                      draggable="false"
                      alt="face avant"
                    />
                  )}
                </div>

                {/* FACE ARRIERE */}
                <div className="face-arriere">
                  <img
                    src={`/Images/${perso.id}.jpg`}
                    height="auto"
                    width="250"
                    alt={perso.nom}
                  />
                  <p className="nom-perso">
                    <span className="degrader-blanc">
                      <a
                        href={`https://attaque-des-titans.fandom.com/fr/wiki/${perso.nom}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {perso.nom}
                      </a>
                    </span>
                  </p>
                  <div className="description-perso">
                    <p>
                      {
                        charactersData.find((c) => c.id === perso.id)
                          ?.description
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="membres-cles">
          <p>
            <span className="degrader-vert">
              Autres membres clés : Reiner, Jean, Sasha, Hange, Erwin
            </span>
          </p>
        </div>
      </div>

      <Footer />

      {/* Message victoire */}
      {victoire && (
        <div id="message-victoire-final" style={{ display: "block" }}>
          <h1>FÉLICITATIONS!</h1>
          <p>Tu as prouvé ta valeur. Tous les personnages sont débloqués !</p>
          <button
            className="btn-reponse-quiz"
            style={{ width: "auto", marginTop: "20px" }}
            onClick={() => window.location.reload()}
          >
            Rejouer
          </button>
          <button className="page-suivante">
            <a href="/titans">Page Suivante</a>
          </button>
        </div>
      )}
    </>
  );
}

export default Character;
