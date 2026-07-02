"use client";
import { useState, useRef, useEffect } from 'react';
import styles from './Chat.module.css';

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there. You are in a safe space. I'm here to listen.", sender: "bot", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: "I hear you. Thank you for sharing that with me. What else is on your mind?",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <div className={styles.avatar}>M</div>
        <div className={styles.headerInfo}>
          <h3>Meow's Helpline</h3>
          <p>Online - Safe & Anonymous</p>
        </div>
      </div>
      
      <div className={styles.messagesArea}>
        {messages.map((msg) => (
          <div key={msg.id} className={`${styles.messageWrapper} ${msg.sender === 'user' ? styles.wrapperSent : styles.wrapperReceived}`}>
            <div className={`${styles.messageBubble} ${msg.sender === 'user' ? styles.messageSent : styles.messageReceived}`}>
              <span className={styles.messageText}>{msg.text}</span>
              <span className={styles.timestamp}>{msg.timestamp}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className={styles.inputArea} onSubmit={handleSend}>
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..." 
          className={styles.inputField}
        />
        <button type="submit" className={styles.sendButton} disabled={!inputValue.trim()}>
          <svg viewBox="0 0 24 24" width="24" height="24" className={styles.sendIcon}>
            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
          </svg>
        </button>
      </form>
    </div>
  );
}
