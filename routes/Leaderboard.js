const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Get top 10 leaderboard for a given game
router.get('/:game', async (req, res) => {
  const game = req.params.game;

  try {
    const leaderboard = await User.find(
      { [`stats.${game}`]: { $exists: true } },
      { username: 1, [`stats.${game}.wins`]: 1, [`stats.${game}.rankingPoints`]: 1 }
    )
      .sort({ [`stats.${game}.wins`]: -1, [`stats.${game}.rankingPoints`]: -1 })
      .limit(10);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get stats for a specific user
router.get('/user/:userid', async (req, res) => {
  try {
    const user = await User.findById(req.params.userid, 'username stats');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

// Update user stats after game or meme interaction
router.post('/user/:userid/update', async (req, res) => {
  const { game, result, rankingPointsDelta } = req.body;

  try {
    const user = await User.findById(req.params.userid);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.stats[game]) {
      user.stats[game] = { wins: 0, losses: 0, draws: 0 };
    }

    if (result === 'win') user.stats[game].wins++;
    else if (result === 'loss') user.stats[game].losses++;
    else if (result === 'draw') user.stats[game].draws++;

    if (typeof rankingPointsDelta === 'number') {
      user.stats.rankingPoints += rankingPointsDelta;
    }

    await user.save();
    res.json({ message: 'Stats updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update stats' });
  }
});

module.exports = router;
