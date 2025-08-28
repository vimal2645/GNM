// client/src/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Make sure this URL matches your backend

export default function Chat({ room = 'global', username }) {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit('join room', room);

    socket.on('chat message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('chat message');
    };
  }, [room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMsg = (e) => {
    e.preventDefault();
    if (msg.trim()) {
      socket.emit('chat message', {
        room,
        user: username || 'Anonymous',
        msg: msg.trim(),
      });
      setMsg('');
    }
  };

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: 10,
        width: 320,
        maxHeight: 300,
        margin: 10,
        background: '#f8f8ff',
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: 8,
          fontSize: 14,
          fontFamily: 'Arial, sans-serif',
          lineHeight: 1.4,
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 5, wordBreak: 'break-word' }}>
            <b style={{ color: '#355' }}>{m.user}:</b> <span>{m.msg}</span>{' '}
            <span
              style={{
                fontSize: 10,
                color: '#888',
                marginLeft: 6,
                fontStyle: 'italic',
              }}
            >
              {m.time}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMsg} style={{ display: 'flex' }}>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type message..."
          style={{
            flex: 1,
            marginRight: 8,
            borderRadius: 4,
            border: '1px solid #aaa',
            padding: '6px 8px',
            fontSize: 14,
          }}
          maxLength={200}
          autoComplete="off"
        />
        <button
          type="submit"
          style={{
            borderRadius: 4,
            padding: '6px 12px',
            fontWeight: 'bold',
            backgroundColor: '#0066ff',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
