const donneesQuiz = {
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
      id: "mikasa",
      nom: "Mikasa Ackerman",
      questions: [
        {
          q: "Quel objet précieux Mikasa porte-t-elle toujours ?",
          indice: "C'est un vêtement rouge pour la protéger du froid. 🧣",
          choix: ["Un collier", "Une écharpe", "Un bracelet", "Une bague"],
          reponse: "Une écharpe",
        },
      ],
    },
  ],
};

let indexPersoActuel = 0;
let indexQuestionActuelle = 0;
let tempsEcoule = 0;
let intervalId = null;

//
const boutonChrono = document.getElementById("btn-action");
const affichageChrono = document.getElementById("affichage");
const toutesLesCartes = document.querySelectorAll(".personnage-carte");

const gererChrono = () => {
  // On vérifie si on a fini le jeu
  if (indexPersoActuel >= donneesQuiz.personnages.length) {
    alert("Tous les personnages sont débloqués !");
    return;
  }

  // on ne cible que la carte actuelle
  const carteActuelle = toutesLesCartes[indexPersoActuel];
  const conteneurInterne = carteActuelle.querySelector(".flip-cards");

  // On cache l'image de la carte
  conteneurInterne.style.opacity = "0";

  // creation de la zone de jeu ou la carte actuelle a ete caché
  let zoneJeu = document.getElementById("jeu-dans-carte");
  if (!zoneJeu) {
    zoneJeu = document.createElement("div");
    zoneJeu.id = "jeu-dans-carte";
    carteActuelle.appendChild(zoneJeu);
  }

  // Chrono
  clearInterval(intervalId);
  tempsEcoule = 0;
  intervalId = setInterval(() => {
    tempsEcoule += 1000;
    const minutes = Math.floor(tempsEcoule / 1000 / 60);
    const secondes = Math.floor((tempsEcoule / 1000) % 60);
    affichageChrono.innerText = `${String(minutes).padStart(2, "0")}:${String(secondes).padStart(2, "0")}`;
  }, 1000);

  // 1ere qst
  chargerEtapeQuiz(zoneJeu, conteneurInterne);
};

const chargerEtapeQuiz = (zoneJeu, carteVisuelle) => {
  const perso = donneesQuiz.personnages[indexPersoActuel];
  const etape = perso.questions[indexQuestionActuelle];

  // affichage de l'indice
  zoneJeu.innerHTML = `
    <div style="padding:15px; color:white; text-align:center;">
      <h3 style="color: #ffcc00; font-size: 16px;">INDICE</h3>
      <p style="font-size: 14px;">${etape.indice}</p>
    </div>
  `;

  // Après 2 secondes, on affiche la question et les choix
  setTimeout(() => {
    zoneJeu.innerHTML = `
      <div style="padding:10px; text-align:center;">
        <p style="font-size: 14px; font-weight: bold;">${etape.q}</p>
        <div id="options-boutons" style="margin-top: 10px;"></div>
        <p id="feedback-mini" style="font-weight: bold; margin-top: 10px;"></p>
      </div>
    `;

    const conteneurBoutons = document.getElementById("options-boutons");

    etape.choix.forEach((choixTexte) => {
      const bouton = document.createElement("button");
      bouton.innerText = choixTexte;
      bouton.classList.add("btn-reponse");
      bouton.style.display = "block";
      bouton.style.width = "90%";
      bouton.style.margin = "5px auto";

      bouton.onclick = () => {
        const feedback = document.getElementById("feedback-mini");
        if (choixTexte === etape.reponse) {
          indexQuestionActuelle++;

          if (indexQuestionActuelle < perso.questions.length) {
            feedback.innerText = "✅ Bien joué ! Suite...";
            feedback.style.color = "lightgreen";
            setTimeout(() => chargerEtapeQuiz(zoneJeu, carteVisuelle), 1500);
          } else {
            // Toutes les questions du perso sont finies
            clearInterval(intervalId);
            zoneJeu.remove(); // On enlève la zone noire
            carteVisuelle.style.opacity = "1"; // L'image revient
            carteVisuelle.classList.add("est-retournee"); // on retourne la carte

            // On passe au personnage suivant
            indexPersoActuel++;
            indexQuestionActuelle = 0;
          }
        } else {
          feedback.innerText = "❌ Faux, essaie encore !";
          feedback.style.color = "red";
        }
      };
      conteneurBoutons.appendChild(bouton);
    });
  }, 3000);
};

boutonChrono.addEventListener("click", gererChrono);
