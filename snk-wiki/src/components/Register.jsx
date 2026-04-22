import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/Auth.module.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.username.length > 15) {
      setMessage("Le nom ne doit pas dépasser 15 lettres !");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Inscription réussie ! Redirection vers la connexion...");
        setTimeout(() => navigate("/login"), 1500);
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
        <h2>Rejoindre le Bataillon</h2>
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <input
            type="text"
            placeholder="Nom de soldat (max 15 lettres)"
            value={formData.username}
            maxLength="15" // limite
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
            S'inscrire
          </button>
        </form>
        <p className={styles.toggleText}>
          Déjà soldat ? <Link to="/login">Se connecter</Link>
        </p>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default Register;
