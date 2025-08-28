// client/src/ChessGame.js
import React, { useState } from 'react';
import ChessBoard from './ChessBoard';

export default function ChessGame({ mode, goBack }) {
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);

  const onGameEnd = (status) => {
    setGameOver(true);
    setResult(status);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Chess - {mode === 'ai' ? 'Play with AI' : 'Play with Friend'}</h2>
      <ChessBoard mode={mode} onGameEnd={onGameEnd} />
      {gameOver && (
        <div style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>
          {result}
        </div>
      )}
      <button onClick={goBack} style={{ marginTop: 20 }}>
        Back to Menu
      </button>
    </div>
  );
}
