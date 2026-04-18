const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // stock le nom et le mdp
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  unlockedPages: {
    type: Map,
    of: Boolean,
    default: {
      Page1: true, // La première est débloqué par defaut(celle de l'accueul)
      Page2: false,
      Page3: false,
    },
  },
});

module.exports = mongoose.model("User", userSchema);
