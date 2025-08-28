import React from 'react';
import './components/chess.css'; // separate CSS for Chess Menu
export default function ChessMenu({ onSelectMode }) {
  return (
    <div style={{ marginTop: 40, textAlign: "center" }}>
      <h2>Choose Chess Mode</h2>
      <button onClick={() => onSelectMode('ai')} style={{ margin: '10px', padding: '10px 20px' }}>
        Play with AI
      </button>
      <button onClick={() => onSelectMode('friend')} style={{ margin: '10px', padding: '10px 20px' }}>
        Play with Friend (Same Device)
      </button>
      <button onClick={() => onSelectMode('online')} style={{ margin: '10px', padding: '10px 20px' }}>
        Play Online Multiplayer
      </button>
    </div>
  );
}
