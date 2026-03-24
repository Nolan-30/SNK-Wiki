import "../styles/Home.css";

const Home = () => {
  return (
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
        <img
          src="public/images/bataillon.jpg"
          height="500"
          alt="Bataillon d'Exploration"
        />
      </div>
    </div>
  );
};

export default Home;
