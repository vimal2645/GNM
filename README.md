# 🎮 GNM- Multi-Game Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)

A full-stack multiplayer gaming platform featuring Chess, Meme Generator, real-time voice chat, and social features. Built with React, Node.js, Socket.IO, and deployable as Android APK.

---

## 🚀 Features

### 🎮 Games
- **♟️ Chess**: Play vs Computer, Friend (same device), or Online multiplayer
- **😄 Meme Generator**: Create, upload, download, and share custom memes
- **🎯 More Games**: Expandable architecture for additional games

### 🌐 Real-Time Features  
- **🎤 Voice Chat**: WebRTC-powered voice communication during gameplay
- **📊 Live Leaderboards**: Real-time ranking updates across all games
- **👥 Multiplayer Sync**: Instant game state synchronization
- **🔔 Notifications**: Live updates for game events and user activities

### 📱 Mobile & Responsive
- **📲 Android APK**: Native Android app via Capacitor
- **📐 Responsive Design**: Mobile-first UI that works on all devices
- **🖼️ Touch Optimized**: 44px+ touch targets for mobile usability

### 🔐 User System
- **👤 Authentication**: Email/Username login and registration
- **📈 User Stats**: Wins, losses, games played, ranking points
- **🏆 Achievements**: Game-specific statistics and progress tracking

---

## 💻 Tech Stack

### Frontend
- **React.js 18** - Modern component-based UI
- **CSS3** - Custom responsive styling with mobile-first approach
- **Socket.IO Client** - Real-time bidirectional communication
- **SimplePeer** - WebRTC wrapper for voice chat
- **Capacitor** - Cross-platform native app deployment

### Backend
- **Node.js** - Server runtime environment
- **Express.js** - Web application framework
- **Socket.IO** - Real-time communication server
- **Multer** - File upload middleware for memes
- **CORS** - Cross-origin resource sharing

### Mobile
- **Capacitor** - React to native Android compilation
- **Android Studio** - APK building and debugging

---

## 📂 Project Structure

MemeChess/
├── client/ # React Frontend
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Main app pages
│ │ ├── App.js # Main app component
│ │ └── styles.css # Responsive styles
│ ├── public/
│ │ ├── index.html # HTML template
│ │ └── assets/ # Images and static files
│ ├── android/ # Capacitor Android project
│ ├── package.json # Frontend dependencies
│ └── capacitor.config.ts # Mobile app configuration
├── server.js # Backend server with APIs
├── package.json # Backend dependencies
├── .gitignore # Git ignore rules
├── .gitmodules # Submodule configuration (if applicable)
└── README.md # This file

text

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm
- **Android Studio** (for APK generation)
- **Git** for version control

### 1. Backend Setup

Clone the repository
git clone https://github.com/YOUR_USERNAME/memechess-backend.git
cd memechess-backend

Install backend dependencies
npm install

Start the backend server
node server.js

Server runs on http://localhost:5000


### 2. Frontend Setup

Navigate to client folder
cd client

Install frontend dependencies
npm install

Start development server
npm start

Frontend runs on http://localhost:3000


### 3. Android APK Generation

In the client folder, build production version
npm run build

Copy build to Capacitor
npx cap copy android

Open in Android Studio
npx cap open android

Build APK in Android Studio:
Build → Build Bundle(s) / APK(s) → Build APK(s)


---

## 🌐 Deployment

### Backend Deployment (Free Options)

#### Railway.app (Recommended)
Install Railway CLI
npm install -g @railway/cli

Deploy backend
railway login
railway init
railway up


#### Render.com
1. Connect your GitHub repository to Render
2. Create new Web Service
3. Build Command: `npm install`
4. Start Command: `npm start`

#### Alternative Options
- **Fly.io**: Fast global deployment
- **DigitalOcean**: VPS with full control
- **AWS EC2**: Enterprise-grade hosting

### Frontend Deployment
Update API URLs in your React components to point to your deployed backend:

// Replace in all components
const socket = io("https://your-app.up.railway.app");

// API calls
fetch('https://your-app.up.railway.app/api/leaderboard/chess')



---

## 📋 Environment Variables

Create `.env` file in the root directory:

NODE_ENV=production
PORT=5000



For client, update API endpoints in your components to match your deployed backend URL.

---

## 🎮 How to Play

### Chess Game
1. **Register/Login** to access multiplayer features
2. **Select game mode**: vs Computer, vs Friend, or Online
3. **Join voice chat** for real-time communication
4. **Play and compete** - stats are tracked automatically

### Meme Generator
1. **Upload image** or use URL
2. **Add top and bottom text**
3. **Download** your created meme
4. **Share** with other users (if backend deployed)

### Voice Chat
1. **Join a room** by entering room ID
2. **Allow microphone access** when prompted
3. **Talk with other users** in real-time
4. **Leave voice chat** when done

---

## 🔧 Development

### Adding New Games
1. Create new component in `client/src/components/`
2. Add game logic and UI
3. Update main `App.js` to include new game
4. Add backend API endpoints if needed

### Customizing Styles
- Edit `client/src/styles.css` for global styles
- All styles are mobile-first responsive
- Use CSS Grid and Flexbox for layouts

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/register` | User registration |
| `POST` | `/login` | User authentication |
| `GET` | `/api/leaderboard/:game` | Get leaderboard for specific game |
| `GET` | `/api/leaderboard/user/:userId` | Get user statistics |
| `POST` | `/upload-meme` | Upload meme file |
| `GET` | `/download-meme/:id` | Download meme by ID |

---

## 🐛 Troubleshooting

### APK Generation Issues
- Ensure Android Studio is installed and properly configured
- Run `npx cap doctor` to check Capacitor setup
- Check `android/app/build.gradle` for any dependency conflicts

### Voice Chat Not Working
- Verify microphone permissions are granted
- Check if HTTPS is required for WebRTC (in production)
- Ensure backend Socket.IO server is accessible

### Responsive Design Issues
- Check viewport meta tag in `public/index.html`
- Verify CSS media queries in `styles.css`
- Test on different devices using browser dev tools

### Backend Connection Issues
- Verify backend server is running on correct port
- Check CORS configuration in `server.js`
- Update frontend API URLs to match backend deployment

---

## 📊 Performance Optimizations

- **Code Splitting**: React components are bundled efficiently
- **Image Optimization**: Responsive images for different screen sizes
- **Memory Management**: Efficient socket connection handling
- **Caching**: Static assets cached for better performance

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team** for the amazing frontend framework
- **Socket.IO** for real-time communication capabilities
- **Capacitor Team** for seamless mobile deployment
- **WebRTC Community** for voice chat functionality
- **Open Source Community** for inspiration and tools

---


---

## 🎯 Future Enhancements

- [ ] Add more games (Ludo, Snake & Ladder)
- [ ] Implement persistent database (MongoDB/PostgreSQL)
- [ ] Add user profiles and avatars
- [ ] Implement friend system and private matches
- [ ] Add tournament mode
- [ ] iOS app support via Capacitor
- [ ] Real-time chat messaging
- [ ] Game replay system
- [ ] Advanced meme editing tools

---

**Made with ❤️ by [Your Name] | 🎮 Happy Gaming!**
