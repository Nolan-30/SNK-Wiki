import "../styles/CharacterCard.css";

const CharacterCard = ({ nom, image, description, lien }) => {
  return (
    <div className="personnage-carte">
      <div className="flip-cards">
        <div className="face-avant">
          <img
            draggable="false"
            src="public/images/face-avant-perso.jpg"
            height="auto"
            width="250"
          />
        </div>
        <div className="face-arriere">
          <img src={image} height="auto" width="250" alt={nom} />
          <p className="nom-perso">
            <span className="degrader-blanc">
              <a href={lien} target="_blank">
                {nom}
              </a>
            </span>
          </p>
          <div className="description-perso">
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
