"use client";
import { useState, useEffect } from "react";
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

    return () => newSocket.close();
  }, []);

  const acceptStudent = (studentId) => {
    socket.emit("accept-student", studentId);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !roomId) return;
    
    const msg = { message: input, senderId: socket.id };
    socket.emit("send-message", { roomId, message: input });
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  if (!session) return <div>Loading session...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "50px auto", fontFamily: "sans-serif" }}>
      <h1>Helper Dashboard</h1>
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
        <div style={{ border: "1px solid #ccc", padding: 20, borderRadius: 8 }}>
          <h3 style={{ color: "green" }}>Matched with a student!</h3>
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
