import React, { useState, createContext, useContext, useEffect } from 'react';
import ChessMenu from './ChessMenu';
import ChessGameWithChat from './ChessGameWithChat';
import MemeGenerator from './MemeGenerator';
import Leaderboard from './Leaderboard';
import UserStats from './UserStats';
import VoiceChatPanel from './components/VoiceChatPanel';
import bgImage from './assets/games-chills-bg.png';
import './styles.css';

// Authentication Context
const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

// Login Component
function Login({ onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate loading
    setTimeout(() => {
      // Check localStorage for user
      const storedUser = localStorage.getItem(`user_${email}`);
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.password === password) {
          login({
            userId: userData.id,
            username: userData.username,
            email: userData.email
          });
        } else {
          setError('Invalid password');
        }
      } else {
        setError('User not found. Please register first.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🎮 Login to Games</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="auth-input"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="auth-input"
              disabled={loading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="link-btn">
            Register here
          </button>
        </p>
        <div className="demo-info">
          <p><strong>Demo Account:</strong></p>
          <p>Email: demo@test.com</p>
          <p>Password: demo123</p>
        </div>
      </div>
    </div>
  );
}

// Register Component
function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate loading
    setTimeout(() => {
      // Check if user already exists
      const existingUser = localStorage.getItem(`user_${email}`);
      
      if (existingUser) {
        setError('User with this email already exists');
        setLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        username,
        email,
        password,
        createdAt: new Date().toISOString()
      };

      // Store user in localStorage
      localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
      
      // Auto login after registration
      login({
        userId: newUser.id,
        username: newUser.username,
        email: newUser.email
      });
      
      setLoading(false);
    }, 800);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🎮 Register for Games</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="auth-input"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="auth-input"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password (min 4 chars)"
              className="auth-input"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="auth-input"
              disabled={loading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="link-btn">
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [currentGame, setCurrentGame] = useState(null);
  const [chessMode, setChessMode] = useState(null);
  const [showGeneralVoice, setShowGeneralVoice] = useState(false);
  const [friendsRoomId, setFriendsRoomId] = useState('');

  // Check for existing session
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('currentUser');
      }
    }

    // Create demo user if not exists
    const demoUser = localStorage.getItem('user_demo@test.com');
    if (!demoUser) {
      const demo = {
        id: 'demo',
        username: 'DemoUser',
        email: 'demo@test.com',
        password: 'demo123',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('user_demo@test.com', JSON.stringify(demo));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setCurrentGame(null);
    setChessMode(null);
    setShowGeneralVoice(false);
    setFriendsRoomId('');
  };

  const resetToMainMenu = () => {
    setCurrentGame(null);
    setChessMode(null);
    setShowGeneralVoice(false);
    setFriendsRoomId('');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          background: `url(${bgImage}) center center / cover no-repeat fixed`,
        }}
      >
        {!user ? (
          authMode === 'login' ? (
            <Login onSwitchToRegister={() => setAuthMode('register')} />
          ) : (
            <Register onSwitchToLogin={() => setAuthMode('login')} />
          )
        ) : (
          <div className="app-container">
            {!currentGame && (
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <h1 style={{ fontSize: "2.8em", marginTop: 16, fontWeight: 800 }}>
                  GNM Multi-Game App
                </h1>
                <p style={{ color: "#fffbe6", fontSize: "1.2em" }}>
                  Welcome back, {user.username}!{' '}
                  <button onClick={logout} className="logout-btn">
                    Logout
                  </button>
                </p>

                {/* Voice Chat Section */}
                <div className="voice-section">
                  <button
                    className="main-menu-btn"
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
                  {showGeneralVoice &&
                    <VoiceChatPanel roomId="general" username={user.username} />
                  }

                  <div style={{ margin: "14px 0 26px 0" }}>
                    <input
                      type="text"
                      placeholder="Room code for Friends Voice"
                      value={friendsRoomId}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "6px",
                        fontSize: "1em",
                        marginRight: "6px",
                        border: "1px solid #bbb"
                      }}
                      onChange={e => setFriendsRoomId(e.target.value)}
                    />
                    <button
                      className="main-menu-btn"
                      style={{ background: "#6366f1", color: "#fff", marginRight: 0 }}
                      onClick={() =>
                        setFriendsRoomId(
                          friendsRoomId.trim() ||
                          `friends-${(Math.random() * 1000 | 0)}`
                        )
                      }
                    >
                      Join Friends Voice Chat
                    </button>
                  </div>
                  {friendsRoomId && (
                    <VoiceChatPanel roomId={friendsRoomId} username={user.username} />
                  )}
                </div>

                {/* Game Selection */}
                <div className="games-section">
                  <h2 style={{ color: "#fffbe6", marginBottom: "20px" }}>Choose Your Game</h2>
                  <div className="game-grid">
                    <button className="main-menu-btn" onClick={() => setCurrentGame('chess')}>
                      ♟️ Chess
                    </button>
                    <button className="main-menu-btn" onClick={() => setCurrentGame('meme-generator')}>
                      😄 Meme Generator
                    </button>
                    <button className="main-menu-btn" onClick={() => setCurrentGame('leaderboard')}>
                      🏆 Leaderboard
                    </button>
                    <button className="main-menu-btn" onClick={() => setCurrentGame('user-stats')}>
                      📊 Your Profile Stats
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Games */}
            {currentGame === 'chess' && (
              chessMode === null ? (
                <div className="game-panel" style={{ textAlign: 'center', marginTop: 30 }}>
                  <ChessMenu onSelectMode={setChessMode} />
                  <button className="main-menu-btn" style={{ marginTop: 30, fontSize: 16 }} onClick={resetToMainMenu}>
                    Back to Main Menu
                  </button>
                </div>
              ) : (
                <div>
                  <ChessGameWithChat mode={chessMode} goBack={() => setChessMode(null)} user={user} />
                  <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <button className="main-menu-btn" style={{ fontSize: 16 }} onClick={resetToMainMenu}>
                      Back to Main Menu
                    </button>
                  </div>
                </div>
              )
            )}

            {currentGame === 'meme-generator' && (
              <div className="game-panel">
                <MemeGenerator user={user} />
                <button className="main-menu-btn" style={{ marginTop: 20, fontSize: 16 }} onClick={resetToMainMenu}>
                  Back to Main Menu
                </button>
              </div>
            )}

            {currentGame === 'leaderboard' && (
              <div className="game-panel">
                <Leaderboard game="chess" />
                <button className="main-menu-btn" style={{ marginTop: 20, fontSize: 16 }} onClick={resetToMainMenu}>
                  Back to Main Menu
                </button>
              </div>
            )}

            {currentGame === 'user-stats' && (
              <div className="game-panel">
                <UserStats userId={user.userId} />
                <button className="main-menu-btn" style={{ marginTop: 20, fontSize: 16 }} onClick={resetToMainMenu}>
                  Back to Main Menu
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AuthContext.Provider>
  );
}
