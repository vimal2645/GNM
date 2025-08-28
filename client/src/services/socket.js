// src/services/socket.js
import { io } from "socket.io-client";

// Use your backend URL here
const socket = io("http://localhost:5000", {
  transports: ["websocket"], // ensures faster connection
});

export default socket;
