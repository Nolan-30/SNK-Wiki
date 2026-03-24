import "../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      <img
        src="public/images/logo-snk.png"
        alt="Logo SNK"
        height="75"
        className="header-logo"
      />
      <nav>
        <ol className="menu">
          <li>
            <a href="/accueil">Accueil</a>
          </li>
          <li>
            <a href="/histoire">Histoire</a>
          </li>
          <li>
            <a href="/personnages">Personnages</a>
          </li>
          <li>
            <a href="/titans">Titans</a>
          </li>
          <li>
            <a href="/saisons">Saisons</a>
          </li>
          <li className="pfp">
            <img src="public/images/pfp.png" alt="Profil" height="40" />
          </li>
        </ol>
      </nav>
    </header>
  );
};

export default Header;
