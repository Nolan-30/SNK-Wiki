const donneesQuizTitans = {
  titans: [
    {
      id: "assaillant",
      nom: "Le Titan Assaillant",
      questions: [
        {
          q: "Quel pouvoir unique distingue le Titan Assaillant des huit autres lignées ?",
          indice: "Son regard traverse le temps... 👁️",
          choix: [
            "Une immunité totale au contrôle mental du Titan Originel",
            "Une force qui décuple selon la colère de son possesseur",
            "La capacité de voir les souvenirs de ses futurs héritiers",
            "L'absorption définitive des pouvoirs des Titans qu'il blesse",
          ],
          reponse: "La capacité de voir les souvenirs de ses futurs héritiers",
        },
      ],
    },
    {
      id: "bestial",
      nom: "Le Titan Bestial",
      questions: [
        {
          q: "Quelle particularité génétique de Sieg Jäger rend son Titan Bestial plus puissant que ceux de ses prédécesseurs ?",
          indice:
            "L'héritage d'une couronne oubliée coule dans ses veines... 👑",
          choix: [
            "Un entraînement militaire intensif qui lui a appris à durcir sa peau sans utiliser de sérum",
            "Une mutation rare due à l'absorption d'une quantité massive de liquide cérébro-spinal de prédateur",
            "La capacité de copier instantanément les techniques de combat des autres Titans qu'il affronte",
            "Son sang royal lui permet de transformer des Sujets d'Ymir en Titans et de les contrôler par le cri",
          ],
          reponse:
            "Son sang royal lui permet de transformer des Sujets d'Ymir en Titans et de les contrôler par le cri",
        },
      ],
    },
    {
      id: "marteau",
      nom: "Le Titan Marteau d'Armes",
      questions: [
        {
          q: "Quelle caractéristique unique de l'hôte du Titan Marteau d'Armes le différencie de tous les autres détenteurs de Titans ?",
          indice: "Le pilote n'est pas dans la cabine... 💎",
          choix: [
            "L'hôte peut rester transformé indéfiniment sans jamais ressentir de fatigue physique ou mentale",
            "Le corps de l'hôte n'est pas dans la nuque, mais caché dans un cristal souterrain relié au Titan par un câble",
            "L'hôte possède deux cœurs, ce qui lui permet de survivre même si son corps principal est sectionné",
            "Le détenteur fusionne physiquement avec la chair du Titan et ne peut plus jamais redevenir humain",
          ],
          reponse:
            "Le corps de l'hôte n'est pas dans la nuque, mais caché dans un cristal souterrain relié au Titan par un câble",
        },
      ],
    },
    {
      id: "feminin",
      nom: "Le Titan Féminin",
      questions: [
        {
          q: "Quelle technique de défense absolue Annie utilise-t-elle après sa défaite à Stohess pour éviter de se faire interroger ?",
          indice: "C'est une prison éternelle et transparente... ❄️",
          choix: [
            "Elle libère une fumée brûlante pour s'évaporer",
            "Elle se crée une armure de plaques osseuses",
            "Elle transfère son esprit dans le sol",
            "Elle s'enferme dans un cristal indestructible",
          ],
          reponse: "Elle s'enferme dans un cristal indestructible",
        },
      ],
    },
  ],
};

// --- VARIABLES DE SUIVI ---
let indexTitanActuel = 0;
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

// Fait défiler doucement vers la prochaine carte
const scrollVersProchaineTitan = () => {
  const toutesLesCartes = document.querySelectorAll(".personnage-carte");
  if (indexTitanActuel < toutesLesCartes.length) {
    toutesLesCartes[indexTitanActuel].scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
};

const debloquerTitanEtContinuer = (zoneJeu, carteVisuelle) => {
  clearInterval(intervalId);
  zoneJeu.innerHTML = "<h2 style='color:lightgreen;'>DÉBLOQUÉ !</h2>";

  setTimeout(() => {
    zoneJeu.remove();
    carteVisuelle.style.opacity = "1";
    carteVisuelle.classList.add("est-retournee");

    // On passe au titan suivant
    indexTitanActuel++;
    indexQuestionActuelle = 0;

    const toutesLesCartes = document.querySelectorAll(".personnage-carte");

    // Vérification de victoire totale
    if (indexTitanActuel >= toutesLesCartes.length) {
      const messageFinal = document.getElementById("message-victoire-final");
      if (messageFinal) {
        messageFinal.style.display = "block";
      }
      document.getElementById("btn-action").style.display = "none";
    } else {
      // Afficher le bouton Continuer à droite de la carte retournée
      afficherBoutonContinuer(carteVisuelle.closest(".personnage-carte"));
    }
  }, 1500);
};

const afficherBoutonContinuer = (carteParente) => {
  // Supprimer un éventuel ancien bouton continuer
  const ancienBouton = document.getElementById("btn-continuer-titan");
  if (ancienBouton) ancienBouton.remove();

  const btnContinuer = document.createElement("button");
  btnContinuer.id = "btn-continuer-titan";
  btnContinuer.innerText = "Continuer →";

  btnContinuer.onclick = () => {
    btnContinuer.remove();
    scrollVersProchaineTitan();
    // Lancer le quiz de la prochaine carte après le scroll
    setTimeout(() => {
      gererChrono();
    }, 800);
  };

  // Insérer le bouton juste après la carte retournée
  carteParente.insertAdjacentElement("afterend", btnContinuer);
};

const gererChrono = () => {
  const toutesLesCartes = document.querySelectorAll(".personnage-carte");

  if (indexTitanActuel >= toutesLesCartes.length) {
    return;
  }

  const carteActuelle = toutesLesCartes[indexTitanActuel];
  const conteneurInterne = carteActuelle.querySelector(".flip-cards");

  // On masque la carte pour afficher le quiz
  conteneurInterne.style.opacity = "0";

  // Créer la zone de quiz noire si elle n'existe pas encore
  let zoneJeu = carteActuelle.querySelector(".jeu-dans-carte");
  if (!zoneJeu) {
    zoneJeu = document.createElement("div");
    zoneJeu.classList.add("jeu-dans-carte");
    carteActuelle.appendChild(zoneJeu);
  }

  lancerChrono();
  chargerEtapeQuiz(zoneJeu, conteneurInterne);
};

const chargerEtapeQuiz = (zoneJeu, carteVisuelle) => {
  const titan = donneesQuizTitans.titans[indexTitanActuel];
  const etape = titan.questions[indexQuestionActuelle];

  // 1. Affichage de l'indice
  zoneJeu.innerHTML = `<div><h3>INDICE</h3><p>${etape.indice}</p></div>`;

  // 2. Affichage de la question après 1,5 secondes
  setTimeout(() => {
    zoneJeu.innerHTML = `
      <div>
        <h2>${etape.q}</h2>
        <div class="options-boutons-titans"></div>
        <p class="feedback-mini-titans"></p>
      </div>
    `;

    const conteneurBoutons = zoneJeu.querySelector(".options-boutons-titans");

    etape.choix.forEach((choixTexte) => {
      const bouton = document.createElement("button");
      bouton.innerText = choixTexte;
      bouton.classList.add("btn-reponse-quiz");

      bouton.onclick = () => {
        const feedback = zoneJeu.querySelector(".feedback-mini-titans");
        if (choixTexte === etape.reponse) {
          indexQuestionActuelle++;

          if (indexQuestionActuelle < titan.questions.length) {
            // Encore des questions pour ce titan
            feedback.innerText = "✅ Bien joué !";
            feedback.style.color = "lightgreen";
            setTimeout(() => chargerEtapeQuiz(zoneJeu, carteVisuelle), 1000);
          } else {
            // Toutes les questions de ce titan sont répondues → débloqué !
            debloquerTitanEtContinuer(zoneJeu, carteVisuelle);
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

document.getElementById("btn-action").addEventListener("click", () => {
  // Supprimer un éventuel bouton continuer encore affiché
  const ancienBouton = document.getElementById("btn-continuer-titan");
  if (ancienBouton) ancienBouton.remove();
  gererChrono();
});
