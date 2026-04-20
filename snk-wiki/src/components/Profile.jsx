import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Profile.module.css";

const Profile = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/login" : "/register";

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        //enregistrement du pseudo
        localStorage.setItem("username", formData.username);
        if (isLogin) {
          setTimeout(() => {
            navigate("/"); // redirige vers l'accueil
          }, 500);
        } else {
          setIsLogin(true);
        }
        setMessage(
          `Succès ! Bienvenue soldat ${data.username || formData.username}`,
        );
      } else {
        setMessage(data.message || "Une erreur est survenue");
      }
    } catch (error) {
      setMessage("Erreur de connexion au serveur");
    }
  };

  return (
    <div className={styles.profilContainer}>
      <div className={styles.authCard}>
        {/* mettre une image au dessus du txt */}
        <h2>{isLogin ? "Connexion" : "Rejoindre le Bataillon "}</h2>
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <input
            type="text"
            placeholder="Nom de soldat "
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <button type="submit" className={styles.authButton}>
            {isLogin ? "Se connecter" : "S'inscrire"}
          </button>
        </form>
        <p onClick={() => setIsLogin(!isLogin)} className={styles.toggleText}>
          {isLogin
            ? "Pas encore de compte ? S'inscrire"
            : "Déjà soldat ? Se connecter"}
        </p>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default Profile;
