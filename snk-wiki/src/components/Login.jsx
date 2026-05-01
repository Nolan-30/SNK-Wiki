import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/Auth.module.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("username", formData.username);
        setMessage(`Content de vous revoir, soldat ${formData.username} !`);
        setTimeout(() => navigate("/"), 1000);
      } else {
        setMessage(data.message || "Erreur de connexion");
      }
    } catch (error) {
      setMessage("Erreur de connexion au serveur");
    }
  };

  return (
    <div className={styles.profilContainer} data-aos="fade-up">
      <div className={styles.authCard}>
        <h2>Connexion</h2>
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <input
            type="text"
            placeholder="Nom de soldat"
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
            Se connecter
          </button>
        </form>
        <p className={styles.toggleText}>
          Pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </p>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default Login;
