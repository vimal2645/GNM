// client/src/ChessGameWithChat.js
import React, { useState } from 'react';
import ChessBoard from './ChessBoard';
import Chat from './chat';

function ChessGame({ mode, onGameEnd }) {
  return (
    <div>
      <h2>Chess - {mode === 'ai' ? 'Play with AI' : 'Play with Friend'}</h2>
      <ChessBoard mode={mode} onGameEnd={onGameEnd} />
    </div>
  );
}

export default function ChessGameWithChat({ mode, goBack }) {
  const username = 'Player1'; // Replace or prompt for real usernames if needed

  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);

  const onGameEnd = (status) => {
    setGameOver(true);
    setResult(status);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <ChessGame mode={mode} onGameEnd={onGameEnd} />
          {gameOver && (
            <div style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>
              {result}
            </div>
          )}
          <button onClick={goBack} style={{ marginTop: 20 }}>
            Back to Menu
          </button>
        </div>
        <div style={{ width: 340, marginLeft: 20 }}>
          <Chat room={`game-room-${mode}`} username={username} />
        </div>
      </div>
    </div>
  );
}
