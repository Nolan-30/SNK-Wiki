import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      {/* 1. En React/Vite, on ne met pas "public/" dans le chemin. Le dossier public est la racine "/" */}
      <Link to="/">
        <img
          src="public/images/logo-snk.png"
          alt="Logo SNK"
          height="75"
          className="header-logo"
        />
      </Link>

      <nav>
        <ol className="menu">
          <li>
            <Link to="/">Accueil</Link>
          </li>
          <li>
            <Link to="/Histoire">Histoire</Link>
          </li>
          <li>
            <Link to="/Personnages">Personnages</Link>
          </li>
          <li>
            <Link to="/Titans">Titans</Link>
          </li>
          <li>
            <Link to="/Saisons">Saisons</Link>
          </li>
          <li className="pfp">
            <Link to="/profile">
              {/* fix le double surlignage sur la pp */}
              <img src="public/images/pfp.png" alt="Profil" height="40" />
            </Link>
          </li>
        </ol>
      </nav>
    </header>
  );
};

export default Header;
