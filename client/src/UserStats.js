import React, { useEffect, useState } from 'react';

export default function UserStats({ userId }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`/api/leaderboard/user/${userId}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchStats();
  }, [userId]);

  if (!stats) return <div>Loading your stats...</div>;

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Your Stats</h2>
      <p>Chess: W-{stats.chess?.wins || 0} L-{stats.chess?.losses || 0} D-{stats.chess?.draws || 0}</p>
      <p>Ludo: W-{stats.ludo?.wins || 0} L-{stats.ludo?.losses || 0}</p>
      <p>Snake & Ladder: W-{stats.snakeLadder?.wins || 0} L-{stats.snakeLadder?.losses || 0}</p>
      <p>Memes Uploaded: {stats.memesUploaded || 0}</p>
      <p>Memes Liked: {stats.memesLiked || 0}</p>
      <p>Total Ranking Points: {stats.rankingPoints || 0}</p>
    </div>
  );
}
