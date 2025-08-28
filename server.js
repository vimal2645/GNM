const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Configure multer for meme uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'meme-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// ===== IN-MEMORY DATABASE =====
let users = [
  {
    _id: "1",
    username: "admin",
    email: "demo@test.com",
    password: "demo",
    stats: {
      chess: { wins: 15, losses: 5, draws: 3, rankingPoints: 450 },
      ludo: { wins: 8, losses: 4, rankingPoints: 200 },
      snakeLadder: { wins: 12, losses: 6, rankingPoints: 300 }
    },
    memesUploaded: 5,
    memesLiked: 23,
    rankingPoints: 950,
    createdAt: new Date().toISOString()
  },
  {
    _id: "2", 
    username: "player1",
    email: "player@test.com",
    password: "abcd",
    stats: {
      chess: { wins: 8, losses: 12, draws: 2, rankingPoints: 220 },
      ludo: { wins: 6, losses: 8, rankingPoints: 140 },
      snakeLadder: { wins: 4, losses: 10, rankingPoints: 80 }
    },
    memesUploaded: 2,
    memesLiked: 15,
    rankingPoints: 440,
    createdAt: new Date().toISOString()
  },
  {
    _id: "3",
    username: "gamer_pro",
    email: "gamer@test.com", 
    password: "gaming123",
    stats: {
      chess: { wins: 25, losses: 8, draws: 5, rankingPoints: 720 },
      ludo: { wins: 15, losses: 5, rankingPoints: 350 },
      snakeLadder: { wins: 20, losses: 3, rankingPoints: 480 }
    },
    memesUploaded: 12,
    memesLiked: 45,
    rankingPoints: 1550,
    createdAt: new Date().toISOString()
  }
];

let memes = [];
let voiceRooms = new Map();
let connectedUsers = new Map();

// ===== AUTHENTICATION ENDPOINTS =====
app.get("/", (req, res) => {
  res.json({ 
    message: "🎮 MemeChess Backend Server Running!",
    endpoints: {
      auth: ["/register", "/login"],
      leaderboard: ["/api/leaderboard/:game", "/api/leaderboard/user/:userId"],
      memes: ["/upload-meme", "/download-meme/:id", "/api/memes"],
      users: ["/api/users", "/api/users/:id"]
    },
    stats: {
      totalUsers: users.length,
      totalMemes: memes.length,
      activeVoiceRooms: voiceRooms.size,
      connectedUsers: connectedUsers.size
    }
  });
});

app.post("/register", (req, res) => {
  console.log("📝 Register request:", req.body);
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "All fields required" 
    });
  }

  const existingUser = users.find(u => u.email === email || u.username === username);
  if (existingUser) {
    return res.status(400).json({ 
      success: false, 
      message: "User already exists" 
    });
  }

  const newUser = {
    _id: Date.now().toString(),
    username,
    email,
    password,
    stats: {
      chess: { wins: 0, losses: 0, draws: 0, rankingPoints: 0 },
      ludo: { wins: 0, losses: 0, rankingPoints: 0 },
      snakeLadder: { wins: 0, losses: 0, rankingPoints: 0 }
    },
    memesUploaded: 0,
    memesLiked: 0,
    rankingPoints: 0,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  console.log("✅ New user registered:", newUser.username);
  
  res.json({
    success: true,
    message: "Registration successful",
    userId: newUser._id,
    username: newUser.username
  });
});

app.post("/login", (req, res) => {
  console.log("🔐 Login request:", req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Username and password required" 
    });
  }

  const user = users.find(u => 
    (u.email === username || u.username === username) && u.password === password
  );

  if (user) {
    console.log("✅ Login successful:", user.username);
    res.json({
      success: true,
      message: "Login successful",
      userId: user._id,
      username: user.username
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: "Invalid credentials" 
    });
  }
});

// ===== LEADERBOARD ENDPOINTS (Matching your component expectations) =====
app.get("/api/leaderboard/:game", (req, res) => {
  const { game } = req.params;
  console.log(`📊 Leaderboard request for: ${game}`);
  
  // Sort users by game-specific ranking points
  const leaderboard = users
    .map(user => ({
      _id: user._id,
      username: user.username,
      stats: user.stats
    }))
    .sort((a, b) => {
      const aPoints = a.stats[game]?.rankingPoints || 0;
      const bPoints = b.stats[game]?.rankingPoints || 0;
      return bPoints - aPoints;
    });

  res.json(leaderboard);
});

app.get("/api/leaderboard/user/:userId", (req, res) => {
  const { userId } = req.params;
  console.log(`👤 User stats request for: ${userId}`);
  
  const user = users.find(u => u._id === userId);
  
  if (!user) {
    return res.status(404).json({ 
      success: false, 
      message: "User not found" 
    });
  }

  // Return stats in the format your UserStats component expects
  res.json({
    chess: user.stats.chess,
    ludo: user.stats.ludo,
    snakeLadder: user.stats.snakeLadder,
    memesUploaded: user.memesUploaded,
    memesLiked: user.memesLiked,
    rankingPoints: user.rankingPoints
  });
});

// ===== MEME ENDPOINTS =====
app.post("/upload-meme", upload.single('meme'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      message: "No file uploaded" 
    });
  }

  const memeData = {
    id: Date.now(),
    filename: req.file.filename,
    originalName: req.file.originalname,
    url: `/uploads/${req.file.filename}`,
    downloadUrl: `http://localhost:5000/download-meme/${Date.now()}`,
    userId: req.body.userId,
    username: req.body.username,
    topText: req.body.topText || '',
    bottomText: req.body.bottomText || '',
    likes: 0,
    createdAt: new Date().toISOString()
  };

  memes.push(memeData);
  
  // Update user's meme count
  const user = users.find(u => u._id === req.body.userId);
  if (user) {
    user.memesUploaded += 1;
    user.rankingPoints += 5; // Bonus points for uploading memes
  }
  
  console.log("🎭 Meme uploaded:", memeData.filename);
  
  // Broadcast to all connected clients
  io.emit("new-meme-uploaded", memeData);
  
  res.json({
    success: true,
    message: "Meme uploaded successfully",
    meme: memeData
  });
});

app.get("/download-meme/:id", (req, res) => {
  const memeId = parseInt(req.params.id);
  const meme = memes.find(m => m.id === memeId);
  
  if (!meme) {
    return res.status(404).json({ 
      success: false, 
      message: "Meme not found" 
    });
  }

  const filePath = path.join(__dirname, 'uploads', meme.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath, `meme-${meme.id}${path.extname(meme.filename)}`);
  } else {
    res.status(404).json({ 
      success: false, 
      message: "File not found" 
    });
  }
});

app.get("/api/memes", (req, res) => {
  const sortedMemes = memes
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 50); // Return latest 50 memes
    
  res.json({
    success: true,
    memes: sortedMemes
  });
});

app.post("/api/memes/:id/like", (req, res) => {
  const memeId = parseInt(req.params.id);
  const { userId } = req.body;
  
  const meme = memes.find(m => m.id === memeId);
  if (meme) {
    meme.likes += 1;
    
    // Update user's liked count
    const user = users.find(u => u._id === userId);
    if (user) {
      user.memesLiked += 1;
      user.rankingPoints += 1; // Small bonus for liking
    }
    
    res.json({ success: true, likes: meme.likes });
  } else {
    res.status(404).json({ success: false, message: "Meme not found" });
  }
});

// ===== GAME STATS UPDATE ENDPOINTS =====
app.post("/api/game-result", (req, res) => {
  const { userId, game, result } = req.body; // result: 'win', 'loss', 'draw'
  
  const user = users.find(u => u._id === userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (!user.stats[game]) {
    user.stats[game] = { wins: 0, losses: 0, draws: 0, rankingPoints: 0 };
  }

  // Update stats based on result
  switch(result) {
    case 'win':
      user.stats[game].wins += 1;
      user.stats[game].rankingPoints += 15;
      user.rankingPoints += 15;
      break;
    case 'loss':
      user.stats[game].losses += 1;
      user.stats[game].rankingPoints += 3; // Participation points
      user.rankingPoints += 3;
      break;
    case 'draw':
      if (user.stats[game].draws !== undefined) {
        user.stats[game].draws += 1;
      }
      user.stats[game].rankingPoints += 8;
      user.rankingPoints += 8;
      break;
  }

  console.log(`🎯 Game result updated: ${user.username} - ${game} - ${result}`);
  
  // Broadcast updated leaderboard
  io.emit("stats-updated", { userId, game, result });
  
  res.json({ 
    success: true, 
    message: "Stats updated",
    newStats: user.stats[game]
  });
});

// ===== SOCKET.IO SETUP =====
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // User connection tracking
  socket.on("user-connected", ({ userId, username }) => {
    connectedUsers.set(socket.id, { userId, username });
    console.log(`👤 User ${username} connected`);
    
    // Broadcast user count update
    io.emit("user-count-update", connectedUsers.size);
  });

  // ===== VOICE CHAT EVENTS (Matching your VoiceChatPanel) =====
  socket.on("voice-join", ({ roomId, username }) => {
    console.log(`🎤 ${username} joined voice room: ${roomId}`);
    socket.join(roomId);
    
    // Track voice room users
    if (!voiceRooms.has(roomId)) {
      voiceRooms.set(roomId, new Set());
    }
    voiceRooms.get(roomId).add({
      socketId: socket.id,
      username: username
    });
    
    // Notify existing users in room about new peer
    socket.to(roomId).emit("voice-peer", { peerId: socket.id });
    
    // Send room info to user
    const roomUsers = Array.from(voiceRooms.get(roomId));
    socket.emit("voice-room-info", { 
      roomId, 
      userCount: roomUsers.length,
      users: roomUsers.map(u => u.username)
    });
  });

  socket.on("voice-signal", ({ to, from, signal }) => {
    console.log(`📡 Voice signal: ${from} -> ${to}`);
    socket.to(to).emit("voice-signal", { from, signal });
  });

  socket.on("voice-leave", ({ roomId }) => {
    socket.leave(roomId);
    if (voiceRooms.has(roomId)) {
      const roomUsers = voiceRooms.get(roomId);
      // Remove user from room
      const updatedUsers = Array.from(roomUsers).filter(u => u.socketId !== socket.id);
      voiceRooms.set(roomId, new Set(updatedUsers));
      
      // Notify room about user leaving
      socket.to(roomId).emit("user-left-voice", { peerId: socket.id });
    }
  });

  // ===== REAL-TIME LEADERBOARD =====
  socket.on("get-live-leaderboard", ({ game }) => {
    const leaderboard = users
      .sort((a, b) => (b.stats[game]?.rankingPoints || 0) - (a.stats[game]?.rankingPoints || 0))
      .slice(0, 10);
    
    socket.emit("live-leaderboard", { game, leaderboard });
  });

  // ===== MEME SHARING =====
  socket.on("share-meme", (memeData) => {
    console.log(`🎭 Meme shared by: ${memeData.username}`);
    socket.broadcast.emit("new-meme-shared", memeData);
  });

  // ===== DISCONNECT HANDLING =====
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
    
    // Clean up voice rooms
    for (let [roomId, roomUsers] of voiceRooms.entries()) {
      const updatedUsers = Array.from(roomUsers).filter(u => u.socketId !== socket.id);
      if (updatedUsers.length === 0) {
        voiceRooms.delete(roomId);
      } else {
        voiceRooms.set(roomId, new Set(updatedUsers));
      }
      // Notify room about user leaving
      socket.to(roomId).emit("user-left-voice", { peerId: socket.id });
    }
    
    // Remove from connected users
    const userData = connectedUsers.get(socket.id);
    if (userData) {
      console.log(`👋 User ${userData.username} disconnected`);
    }
    connectedUsers.delete(socket.id);
    
    // Broadcast updated user count
    io.emit("user-count-update", connectedUsers.size);
  });
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ 
    success: false, 
    message: "Internal server error" 
  });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
🚀 MemeChess Backend Server Started!
📡 Port: ${PORT}
🌐 URL: http://localhost:${PORT}

📊 Features Available:
✅ Authentication (Login/Register)
✅ Voice Chat (WebRTC Signaling)
✅ Leaderboards (All Games)
✅ User Statistics
✅ Meme Upload/Download
✅ Real-time Updates
✅ Socket.IO Events

🎮 Ready for your APK to connect!
  `);
});

// ===== GRACEFUL SHUTDOWN =====
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});
