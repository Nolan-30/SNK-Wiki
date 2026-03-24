import CharacterCard from "./CharacterCard";
import "../styles/Characters.css";

const personnages = [
  {
    id: "eren",
    nom: "Eren Jaëger",
    image: "/eren.jpg",
    description:
      "Eren est le héros principal de l'histoire. Il a une rage immense et combat pour la liberté à tout prix.",
    lien: "https://attaque-des-titans.fandom.com/fr/wiki/Eren_J%C3%A4ger",
  },
  {
    id: "mikasa",
    nom: "Mikasa Ackerman",
    image: "/mikasa.jpg",
    description:
      "Mikasa est une soldate d'élite incroyablement puissante. Elle est dévouée à protéger Eren.",
    lien: "https://attaque-des-titans.fandom.com/fr/wiki/Mikasa_Ackerman",
  },
  {
    id: "armin",
    nom: "Armin Arlet",
    image: "/armin.jpg",
    description:
      "Armin est l'ami intelligent et le stratège du groupe. C'est lui qui trouve les solutions et les plans.",
    lien: "https://attaque-des-titans.fandom.com/fr/wiki/Armin_Arlelt",
  },
  {
    id: "levi",
    nom: "Levi Ackerman",
    image: "/levi.jpg",
    description:
      "Levi est le caporal-chef du Bataillon d'Exploration, reconnu comme le soldat le plus fort de l'humanité.",
    lien: "https://attaque-des-titans.fandom.com/fr/wiki/Liva%C3%AF_Ackerman",
  },
];

const Characters = () => {
  return (
    <div className="perso-section">
      <h2 id="perso-scroll">Personnages principaux</h2>

      <div className="personnages-container">
        {personnages.map((perso) => (
          <CharacterCard
            key={perso.id}
            nom={perso.nom}
            image={perso.image}
            description={perso.description}
            lien={perso.lien}
          />
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
  );
};

export default Characters;
