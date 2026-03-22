// --- 1. DONNÉES DU QUIZ ---
const donneesQuizPerso = {
  personnages: [
    {
      id: "eren",
      nom: "Eren Jaeger",
      questions: [
        {
          q: "Quel est le but ultime qu'Eren se fixe après avoir vu sa mère se faire dévorer ?",
          indice: "Sa colère est dirigée vers une espèce entière... 😡",
          choix: [
            "Devenir le roi",
            "S'enfuir vers l'océan",
            "Exterminer jusqu'au dernier des Titans",
            "Vivre confortablement",
          ],
          reponse: "Exterminer jusqu'au dernier des Titans",
        },
        {
          q: "Comment s'appelle le Titan qu'Eren possède depuis le début ?",
          indice: "Il porte le nom de la liberté. 🕊️",
          choix: [
            "Le Titan Marteau",
            "Le Titan Assaillant",
            "Le Titan Cuirassé",
            "Le Titan Bestial",
          ],
          reponse: "Le Titan Assaillant",
        },
      ],
    },
    {
      id: "mikasa",
      nom: "Mikasa Ackerman",
      questions: [
        {
          q: "Quel objet Mikasa brise-t-elle par émotion lors de la bataille de Trost ?",
          indice:
            "C'est une partie de son équipement pour trancher les Titans. 🗡️",
          choix: [
            "Ses lames",
            "Son grappin",
            "Son réservoir de gaz",
            "Sa poignée",
          ],
          reponse: "Ses lames",
        },
        {
          q: "De quel clan rare Mikasa est-elle la descendante du côté de sa mère ?",
          indice: "Un peuple venu d'une terre lointaine à l'Est. 🌸",
          choix: [
            "Le clan Reiss",
            "Le clan Tybur",
            "Le clan Azumabito",
            "Le clan Ackerman",
          ],
          reponse: "Le clan Azumabito",
        },
      ],
    },
    {
      id: "armin",
      nom: "Armin Arlert",
      questions: [
        {
          q: "Quel est le rêve d'enfance qu'Armin partage avec Eren ?",
          indice: "Il l'a lu dans un livre interdit de son grand-père. 🌊",
          choix: [
            "Voir l'Océan",
            "Devenir Major",
            "Tuer le Titan Colossal",
            "Vivre à l'intérieur du mur Sina",
          ],
          reponse: "Voir l'Océan",
        },
      ],
    },
    {
      id: "levi",
      nom: "Levi Ackerman",
      questions: [
        {
          q: "Quel est le 'tic' ou l'obsession de Livaï qu'il impose à son escouade ?",
          indice: "Regardez l'état de la pièce... ✨",
          choix: [
            "Le polissage des bottes",
            "Le nettoyage extrême",
            "Le brossage des chevaux",
            "Le port de la cravate",
          ],
          reponse: "Le nettoyage extrême",
        },
      ],
    },
  ],
};

// --- VARIABLES DE SUIVI ---
let indexPersoActuel = 0;
let indexQuestionActuelle = 0;
let intervalId = null;
let tempsEcoule = 0;

// --- FONCTIONS ---

const lancerChrono = () => {
  const affichage = document.getElementById("affichage");
  tempsEcoule = 0;
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    tempsEcoule += 1000;
    const minutes = Math.floor(tempsEcoule / 60000);
    const secondes = Math.floor((tempsEcoule % 60000) / 1000);
    affichage.innerText = `${String(minutes).padStart(2, "0")}:${String(secondes).padStart(2, "0")}`;
  }, 1000);
};

const gererChrono = () => {
  const toutesLesCartes = document.querySelectorAll(".personnage-carte");

  if (indexPersoActuel >= toutesLesCartes.length) {
    alert("Félicitations ! Vous avez débloqués tous les personnages sont !");
    return;
  }

  const carteActuelle = toutesLesCartes[indexPersoActuel];
  const conteneurInterne = carteActuelle.querySelector(".flip-cards");

  // on masque la carte pr afficher le quiz
  conteneurInterne.style.opacity = "0";

  // créer la zone de quiz noire si elle n'existe pas
  let zoneJeu = document.getElementById("jeu-dans-carte");
  if (!zoneJeu) {
    zoneJeu = document.createElement("div");
    zoneJeu.id = "jeu-dans-carte";
    carteActuelle.appendChild(zoneJeu);
  }

  lancerChrono();
  chargerEtapeQuiz(zoneJeu, conteneurInterne);
};

const chargerEtapeQuiz = (zoneJeu, carteVisuelle) => {
  const perso = donneesQuizPerso.personnages[indexPersoActuel];
  const etape = perso.questions[indexQuestionActuelle];

  // 1. Affichage de l'indice
  zoneJeu.innerHTML = `<div><h3>INDICE</h3><p>${etape.indice}</p></div>`;

  // 2. Affichage de la question après 3 secondes
  setTimeout(() => {
    zoneJeu.innerHTML = `
      <div>
        <h2>${etape.q}</h2>
        <div id="options-boutons"></div>
        <p id="feedback-mini"></p>
      </div>
    `;

    const conteneurBoutons = document.getElementById("options-boutons");

    etape.choix.forEach((choixTexte) => {
      const bouton = document.createElement("button");
      bouton.innerText = choixTexte;
      bouton.classList.add("btn-reponse-quiz");

      bouton.onclick = () => {
        const feedback = document.getElementById("feedback-mini");
        if (choixTexte === etape.reponse) {
          indexQuestionActuelle++;

          if (indexQuestionActuelle < perso.questions.length) {
            feedback.innerText = "✅ Bien joué !";
            feedback.style.color = "lightgreen";
            setTimeout(() => chargerEtapeQuiz(zoneJeu, carteVisuelle), 1000);
          } else {
            // --- C'EST ICI QUE LE CHANGEMENT S'APPLIQUE ---
            // Si c'est fini pour ce personnage
            clearInterval(intervalId);
            zoneJeu.innerHTML = "<h2 style='color:lightgreen;'>DÉBLOQUÉ !</h2>";

            setTimeout(() => {
              zoneJeu.remove();
              carteVisuelle.style.opacity = "1";
              carteVisuelle.classList.add("est-retournee");

              // On passe au personnage suivant
              indexPersoActuel++;
              indexQuestionActuelle = 0;

              // --- VÉRIFICATION DE VICTOIRE TOTALE ---
              const toutesLesCartes =
                document.querySelectorAll(".personnage-carte");
              if (indexPersoActuel >= toutesLesCartes.length) {
                // On affiche le gros message de félicitations
                const messageFinal = document.getElementById(
                  "message-victoire-final",
                );
                if (messageFinal) {
                  messageFinal.style.display = "block";
                }
                // Cache le bouton Démarrer car le jeu est fini
                document.getElementById("btn-action").style.display = "none";
              }
            }, 1500);
            // --- FIN DU CHANGEMENT ---
          }
        } else {
          feedback.innerText = "❌ Réessaie !";
          feedback.style.color = "red";
        }
      };
      conteneurBoutons.appendChild(bouton);
    });
  }, 1500);
};

document.getElementById("btn-action").addEventListener("click", gererChrono);
