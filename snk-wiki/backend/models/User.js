const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  // stock les quiz debloqués
  quizUnlocked: { type: [String], default: ["Saison 1"] },
  // stocke les best quiz
  bestScores: {
    type: Map,
    of: Number,
    default: {},
  },
});

module.exports = mongoose.model("User", userSchema);
