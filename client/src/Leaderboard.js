import React, { useEffect, useState } from 'react';

export default function Leaderboard({ game }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const res = await fetch(`/api/leaderboard/${game}`);
        const data = await res.json();
        setLeaders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [game]);

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <div>
      <h2>{game.charAt(0).toUpperCase() + game.slice(1)} Leaderboard</h2>
      <table style={{ width: '80%', margin: 'auto', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Wins</th>
            <th>Ranking Points</th>
          </tr>
        </thead>
        <tbody>
          {leaders.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>No data available</td>
            </tr>
          ) : (
            leaders.map((user, idx) => (
              <tr key={user._id}>
                <td>{idx + 1}</td>
                <td>{user.username}</td>
                <td>{user.stats[game]?.wins || 0}</td>
                <td>{user.stats[game]?.rankingPoints || 0}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
