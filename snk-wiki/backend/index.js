const User = require("./models/User");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connexion à MongoDB réussie ! "))
  .catch((err) => console.error("Erreur de connexion :", err));

// route de base
app.get("/", (req, res) => {
  res.send("Le serveur SNK est en ligne !");
});

const PORT = process.env.PORT || 5000;
// test  pour créer un user
app.post("/api/user", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Route pour l'inscription
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // On vérifie si le soldat existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Ce nom de soldat est déjà pris !" });
    }

    // creation du new user
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({
      message: "Soldat enregistré avec succès !",
      username: newUser.username,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
});

// Route pour la connexion
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // On cherche l'utilisateur dans la BDD
    const user = await User.findOne({ username });
    console.log("Utilisateur trouvé dans la base :", user);

    // On vérifie si l'utilisateur existe et si le mdp correspond
    if (!user || user.password !== password) {
      return res
        .status(401)
        .json({ message: "Pseudo ou mot de passe incorrect." });
    }

    res
      .status(200)
      .json({ message: "Connexion réussie !", username: user.username });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la connexion " });
  }
});

app.post("/update-progression", async (req, res) => {
  try {
    const { username, pageName, timeTaken } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "Soldat introuvable" });

    // debloquage et enregistrement du temps
    user.unlockedPages.set(pageName, true);
    user.completionTimes.set(pageName, timeTaken);

    await user.save();
    res.json({ message: "Progression enregistrée !", user });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour" });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT} `);
});
