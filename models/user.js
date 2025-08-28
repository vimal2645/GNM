const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  avatarUrl: String,
  stats: {
    chess: { wins: { type: Number, default: 0 }, losses: { type: Number, default: 0 }, draws: { type: Number, default: 0 } },
    ludo: { wins: { type: Number, default: 0 }, losses: { type: Number, default: 0 } },
    snakeLadder: { wins: { type: Number, default: 0 }, losses: { type: Number, default: 0 } },
    memesUploaded: { type: Number, default: 0 },
    memesLiked: { type: Number, default: 0 },
    rankingPoints: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model('User', userSchema);
