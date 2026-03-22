import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header>
      <img src="/Images/logo-snk.png" alt="Logo SNK" height="75" width="auto" />
      <nav>
        <ol className="menu">
          <li>
            <NavLink to="/">Accueil</NavLink>
          </li>
          <li>
            <NavLink to="/histoire">Histoire</NavLink>
          </li>
          <li>
            <NavLink to="/perso">Personnages</NavLink>
          </li>
          <li>
            <NavLink to="/titans">Titans</NavLink>
          </li>
          <li>
            <NavLink to="/saisons">Saisons</NavLink>
          </li>
          <li className="pfp">
            <img src="/Images/pfp.png" alt="Profil" height="40" />
          </li>
        </ol>
      </nav>
    </header>
  );
}

export default Header;
