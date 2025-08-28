import React, { useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // your server address!

export default function VoiceChatPanel({ roomId, username }) {
  const [joined, setJoined] = useState(false);
  const peersRef = useRef({});
  const myAudio = useRef();
  const [myStream, setMyStream] = useState(null);

  useEffect(() => {
    if (joined) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          setMyStream(stream);
          if (myAudio.current) {
            myAudio.current.srcObject = stream;
            myAudio.current.muted = true;
            myAudio.current.play();
          }
          socket.emit("voice-join", { roomId, username });
        });
    } else {
      if (myStream) myStream.getTracks().forEach(track => track.stop());
      Object.values(peersRef.current).forEach(peer => peer.destroy());
      peersRef.current = {};
    }
    return () => {
      if (myStream) myStream.getTracks().forEach(track => track.stop());
    };
  }, [joined]);

  useEffect(() => {
    if (!joined || !myStream) return;

    socket.on("voice-peer", ({ peerId }) => {
      if (peersRef.current[peerId]) return;
      const peer = new SimplePeer({
        initiator: true,
        trickle: false,
        stream: myStream,
      });
      peer.on("signal", signal => {
        socket.emit("voice-signal", { to: peerId, from: socket.id, signal });
      });
      peer.on("stream", stream => addPeerAudio(peerId, stream));
      peersRef.current[peerId] = peer;
    });

    socket.on("voice-signal", ({ from, signal }) => {
      let peer = peersRef.current[from];
      if (!peer) {
        peer = new SimplePeer({
          initiator: false,
          trickle: false,
          stream: myStream,
        });
        peer.on("signal", s => {
          socket.emit("voice-signal", { to: from, from: socket.id, signal: s });
        });
        peer.on("stream", stream => addPeerAudio(from, stream));
        peersRef.current[from] = peer;
      }
      peer.signal(signal);
    });

    return () => {
      socket.off("voice-peer");
      socket.off("voice-signal");
      Object.values(peersRef.current).forEach(peer => peer.destroy());
      peersRef.current = {};
    };
  }, [joined, myStream]);

  function addPeerAudio(peerId, stream) {
    let audioEl = document.getElementById("peer-audio-" + peerId);
    if (!audioEl) {
      audioEl = document.createElement("audio");
      audioEl.id = "peer-audio-" + peerId;
      audioEl.autoplay = true;
      audioEl.style.display = "none";
      document.body.appendChild(audioEl);
    }
    audioEl.srcObject = stream;
    audioEl.play();
  }

  return (
    <div className="panel" style={{ textAlign: "center", margin: '30px auto', maxWidth: 340 }}>
      <h3>Voice Chat {roomId === "general" ? "(General)" : `(Room: ${roomId})`}</h3>
      {!joined ? (
        <button onClick={() => setJoined(true)} className="btn-primary">
          Join Voice Room
        </button>
      ) : (
        <button onClick={() => setJoined(false)} className="btn-danger">
          Leave Voice
        </button>
      )}
      <audio ref={myAudio} autoPlay muted />
      <div style={{ fontSize: "0.95em", color: "#666", marginTop: 6 }}>
        {joined
          ? "You're talking! Others in this room will hear you."
          : "Click to join voice chat."}
      </div>
    </div>
  );
}
