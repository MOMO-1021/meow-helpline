"use client";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

export default function StudentChat() {
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | waiting | matched
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [anonName, setAnonName] = useState("");

  useEffect(() => {
    setAnonName(`Anonymous-${Math.floor(Math.random() * 10000)}`);
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on("matched-with-helper", (data) => {
      setStatus("matched");
      setRoomId(data.roomId);
    });

    newSocket.on("new-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => newSocket.close();
  }, []);

  const requestHelp = () => {
    setStatus("waiting");
    socket.emit("student-join", { name: anonName });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !roomId) return;
    
    const msg = { message: input, senderId: socket.id };
    socket.emit("send-message", { roomId, message: input });
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", fontFamily: "sans-serif" }}>
      <h1>Student Dashboard</h1>
      <p>Welcome, {anonName}</p>

      {status === "idle" && (
        <button onClick={requestHelp} style={{ padding: 15, fontSize: 18, backgroundColor: "red", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>
          I Need Help (SOS)
        </button>
      )}

      {status === "waiting" && (
        <p style={{ color: "orange", fontSize: 18 }}>Waiting for a helper to respond... Please stay on this page.</p>
      )}

      {status === "matched" && (
        <div style={{ border: "1px solid #ccc", padding: 20, borderRadius: 8, marginTop: 20 }}>
          <h3 style={{ color: "green" }}>Matched with a helper!</h3>
          <div style={{ height: 300, overflowY: "auto", borderBottom: "1px solid #eee", marginBottom: 15, padding: "0 10px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ textAlign: m.senderId === socket.id ? "right" : "left", margin: "12px 0" }}>
                <span style={{ 
                  display: "inline-block", 
                  padding: "10px 14px", 
                  borderRadius: 15, 
                  backgroundColor: m.senderId === socket.id ? "#0070f3" : "#f1f1f1", 
                  color: m.senderId === socket.id ? "white" : "black",
                  maxWidth: "80%",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  textAlign: "left"
                }}>
                  {m.message}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <textarea 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              style={{ flex: 1, padding: 10, fontSize: 16, borderRadius: 8, border: "1px solid #ccc", resize: "none", minHeight: "44px", maxHeight: "120px", fontFamily: "inherit" }} 
              placeholder="Type your message... (Shift+Enter for new line)"
              rows={input.split("\n").length > 1 ? Math.min(input.split("\n").length, 4) : 1}
            />
            <button type="submit" style={{ padding: "12px 20px", height: "44px", backgroundColor: "#0070f3", color: "white", border: "none", cursor: "pointer", borderRadius: 8, fontWeight: "bold" }}>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}
