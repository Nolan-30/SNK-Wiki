const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // stock le nom et le mdp
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // stock les pages bloques et debloques
  unlockedPages: {
    type: Map,
    of: Boolean,
    default: {
      Page1: true, // La 1ere est débloquée par défaut
      Page2: false,
      Page3: false,
    },
  },

  // stock le temps mis pr debloquer une page
  completionTimes: {
    type: Map,
    of: Number,
    default: {
      Page1: 0,
      Page2: 0,
      Page3: 0,
    },
  },
});

module.exports = mongoose.model("User", userSchema);
