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
// test  pour créer un utilisateur
app.post("/api/user", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT} `);
});
