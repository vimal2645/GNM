import React from 'react';
import VoiceChatPanel from '../components/VoiceChatPanel';
import './mainmenu.css';   // separate CSS just for Main Menu

export default function MainMenu({
  user,
  showGeneralVoice,
  setShowGeneralVoice,
  friendsRoomId,
  setFriendsRoomId,
  setCurrentPage
}) {
  return (
    <div className="mainmenu-container">
      <h1 className="mainmenu-title">MemeChess Multi-Game App</h1>
      <p className="mainmenu-welcome">Welcome, {user.username}!</p>

      {/* General Voice Chat */}
      <button
        className="mainmenu-btn"
        onClick={() => setShowGeneralVoice(v => !v)}
        style={{
          background: showGeneralVoice
            ? "linear-gradient(120deg,#aef7dd 80%,#51ffa3 100%)"
            : "linear-gradient(120deg,#4ade80 80%,#8beaf7 100%)",
          color: "#222"
        }}
      >
        {showGeneralVoice ? 'Hide' : 'Join'} General Voice Chat
      </button>
      {showGeneralVoice && (
        <VoiceChatPanel roomId="general" username={user.username} />
      )}

      {/* Friends Voice Chat */}
      <div className="friends-room">
        <input
          type="text"
          placeholder="Room code for Friends Voice"
          value={friendsRoomId}
          onChange={e => setFriendsRoomId(e.target.value)}
          className="friends-input"
        />
        <button
          className="mainmenu-btn friends-button"
          onClick={() =>
            setFriendsRoomId(
              friendsRoomId.trim() || `friends-${(Math.random() * 1000 | 0)}`
            )
          }
        >
          Join Friends Voice Chat
        </button>
      </div>
      {friendsRoomId && (
        <VoiceChatPanel roomId={friendsRoomId} username={user.username} />
      )}

      {/* Game Selection */}
      <div className="game-buttons">
        <button className="mainmenu-btn" onClick={() => setCurrentPage('chess')}>
          Chess
        </button>
        <button className="mainmenu-btn" onClick={() => setCurrentPage('snake')}>
          Snake & Ladder
        </button>
        <button className="mainmenu-btn" onClick={() => setCurrentPage('meme')}>
          Meme Generator
        </button>
        <button className="mainmenu-btn" onClick={() => setCurrentPage('leaderboard')}>
          Leaderboard
        </button>
        <button className="mainmenu-btn" onClick={() => setCurrentPage('user-stats')}>
          Your Profile Stats
        </button>
      </div>
    </div>
  );
}
