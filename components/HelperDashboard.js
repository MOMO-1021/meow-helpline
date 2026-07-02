"use client";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";

export default function HelperDashboard() {
  const { data: session } = useSession();
  const [socket, setSocket] = useState(null);
  const [waitingList, setWaitingList] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | matched
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showEndPrompt, setShowEndPrompt] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission();
    }

    const newSocket = io();
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("helper-join");
    });

    newSocket.on("waiting-list", (list) => {
      setWaitingList(list);
    });

    newSocket.on("new-distress-signal", () => {
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification("New Distress Signal", {
          body: "A student needs help right now!",
        });
      }
    });

    newSocket.on("matched-with-student", (data) => {
      setStatus("matched");
      setRoomId(data.roomId);
    });

    newSocket.on("new-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    newSocket.on("chat-ended", () => {
      setStatus("idle");
      setRoomId(null);
      setMessages([]);
      setShowEndPrompt(false);
    });

    return () => newSocket.close();
  }, []);

  const acceptStudent = (studentId) => {
    socket.emit("accept-student", studentId);
  };

  const handleInputResize = (e) => {
    const target = e.target;
    target.style.height = "44px"; 
    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
  };

  const endChat = () => {
    socket.emit("end-chat", { roomId });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !roomId) return;
    
    const msg = { message: input, senderId: socket.id };
    socket.emit("send-message", { roomId, message: input });
    setMessages((prev) => [...prev, msg]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
    }
  };

  if (!session) return <div>Loading session...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "50px auto", fontFamily: "sans-serif" }}>
      <h1>HelperDashboard</h1>
      <p>Logged in as {session.user.name}</p>

      {status === "idle" && (
        <div>
          <h2>Waiting Students</h2>
          {waitingList.length === 0 ? (
            <p>No students waiting right now.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {waitingList.map((student) => (
                <li key={student.socketId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 15, border: "1px solid #ccc", marginBottom: 10, borderRadius: 8 }}>
                  <span>Student Request</span>
                  <button onClick={() => acceptStudent(student.socketId)} style={{ padding: "8px 16px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
                    Accept
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {status === "matched" && (
        <div style={{ border: "1px solid #ccc", padding: 20, borderRadius: 8, position: "relative" }}>
          
          {showEndPrompt && (
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 8, zIndex: 10 }}>
              <div style={{ backgroundColor: "white", padding: 30, borderRadius: 12, textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>Are you sure you want to end this chat?</h3>
                <div style={{ display: "flex", justifyContent: "center", gap: 15 }}>
                  <button onClick={() => setShowEndPrompt(false)} style={{ padding: "10px 20px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "bold" }}>Stay</button>
                  <button onClick={endChat} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "bold" }}>Exit</button>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
            <h3 style={{ color: "green", margin: 0 }}>Matched with a student!</h3>
            <button onClick={() => setShowEndPrompt(true)} style={{ padding: "8px 16px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: "bold" }}>
              End Chat
            </button>
          </div>
          
          <div style={{ height: 400, overflowY: "auto", borderBottom: "1px solid #eee", marginBottom: 15, padding: "0 10px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ textAlign: m.senderId === socket.id ? "right" : "left", margin: "12px 0" }}>
                <span style={{ 
                  display: "inline-block", 
                  padding: "10px 14px", 
                  borderRadius: 15, 
                  backgroundColor: m.senderId === socket.id ? "#0070f3" : "#f1f1f1", 
                  color: m.senderId === socket.id ? "white" : "black",
                  maxWidth: "75%",
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
              ref={textareaRef}
              className="chat-input"
              value={input} 
              onChange={(e) => {
                setInput(e.target.value);
                handleInputResize(e);
              }} 
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              style={{ 
                flex: 1, 
                padding: "10px 15px", 
                fontSize: 16, 
                lineHeight: "1.4",
                borderRadius: 20, 
                border: "1px solid #ccc", 
                resize: "none", 
                height: "44px", 
                minHeight: "44px", 
                fontFamily: "inherit", 
                overflowY: "auto",
                boxSizing: "border-box"
              }} 
              placeholder=""
            />
            <button type="submit" style={{ padding: "0 20px", height: "44px", backgroundColor: "#0070f3", color: "white", border: "none", cursor: "pointer", borderRadius: 22, fontWeight: "bold" }}>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}
