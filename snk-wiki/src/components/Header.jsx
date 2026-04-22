import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  const [username, setUsername] = useState("");
  const location = useLocation();

  useEffect(() => {
    // recuperation du nom
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    } else {
      setUsername("");
    }
  }, [location]);
  return (
    <header>
      <Link to="/">
        <img
          src="images/logo-snk.png"
          alt="Logo SNK"
          height="75"
          className="header-logo"
        />
      </Link>

      <nav>
        <ol className="nav">
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
            <Link to="/login">
              {/* fix le double surlignage sur la pp */}
              <span>
                <img src="images/pfp.png" alt="Profil" height="40" />
              </span>
            </Link>
          </li>
          <li>
            {/* affiche le nom de la personne connecté dynamiquement */}
            {username && <span className="header-username">{username}</span>}
          </li>
        </ol>
      </nav>
    </header>
  );
};

export default Header;
