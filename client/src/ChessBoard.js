// client/src/ChessBoard.js
import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';

function getUnicodePiece(color, type) {
  const codes = {
    p: ['♙', '♟'],
    r: ['♖', '♜'],
    n: ['♘', '♞'],
    b: ['♗', '♝'],
    q: ['♕', '♛'],
    k: ['♔', '♚'],
  };
  return color === 'w' ? codes[type][0] : codes[type][1];
}

export default function ChessBoard({ mode = 'friend', onGameEnd }) {
  const [chess, setChess] = useState(new Chess());
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('');

  const getBoard = () => chess.board();

  useEffect(() => {
    function updateStatus() {
      if (chess.isCheckmate()) {
        setStatus('Checkmate! ' + (chess.turn() === 'w' ? 'Black' : 'White') + ' wins!');
        onGameEnd && onGameEnd(`Checkmate! ${(chess.turn() === 'w' ? 'Black' : 'White')} wins!`);
      } else if (chess.isStalemate()) {
        setStatus('Stalemate! Draw!');
        onGameEnd && onGameEnd('Stalemate! Draw!');
      } else if (chess.isCheck()) {
        setStatus('Check!');
      } else {
        setStatus('');
      }
    }

    updateStatus();
  }, [chess, onGameEnd]);

  const handleSquareClick = (row, col) => {
    if (mode === 'online') return; // To implement later

    if (selected) {
      const from = selected;
      const to = `${'abcdefgh'[col]}${8 - row}`;
      const legalMoves = chess.moves({ square: from, verbose: true }).map(m => m.to);

      if (legalMoves.includes(to)) {
        const newChess = new Chess(chess.fen());
        newChess.move({ from, to, promotion: 'q' });
        setChess(newChess);
        setSelected(null);

        setTimeout(() => {
          if (mode === 'ai' && !newChess.isGameOver()) {
            const moves = newChess.moves();
            if (moves.length > 0) {
              const randomMove = moves[Math.floor(Math.random() * moves.length)];
              const aiChess = new Chess(newChess.fen());
              aiChess.move(randomMove);
              setChess(aiChess);
            }
          }
        }, 500);
      } else {
        setSelected(null);
      }
    } else {
      const sq = `${'abcdefgh'[col]}${8 - row}`;
      if (chess.get(sq) && chess.get(sq).color === chess.turn()) setSelected(sq);
    }
  };

  const resetGame = () => {
    const newChess = new Chess();
    setChess(newChess);
    setSelected(null);
    setStatus('');
    onGameEnd && onGameEnd(null);
  };

  return (
    <div>
      <div
        style={{
          display: "inline-block",
          border: "2px solid black",
          margin: 20
        }}
      >
        {getBoard().map((rowArray, rowIdx) => (
          <div key={rowIdx} style={{ display: 'flex' }}>
            {rowArray.map((square, colIdx) => {
              const sqName = `${'abcdefgh'[colIdx]}${8 - rowIdx}`;
              const isSel = selected === sqName;
              return (
                <div
                  key={colIdx}
                  onClick={() => handleSquareClick(rowIdx, colIdx)}
                  style={{
                    width: 50,
                    height: 50,
                    background: (rowIdx + colIdx) % 2 === 0 ? '#eee' : '#888',
                    border: isSel ? '3px solid red' : '1px solid #555',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  {square ? getUnicodePiece(square.color, square.type) : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div>
        <strong>Turn:</strong> {chess.turn() === 'w' ? 'White' : 'Black'} &nbsp;&nbsp;
        <span style={{ color: 'red' }}>{status}</span>
      </div>
      <button onClick={resetGame} style={{ marginTop: 15, padding: '8px 20px' }}>
        Restart Game
      </button>
    </div>
  );
}
