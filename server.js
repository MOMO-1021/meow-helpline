const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  const onlineHelpers = new Set();
  const waitingStudents = new Map();

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("student-join", (data) => {
      console.log("Student joined:", socket.id);
      waitingStudents.set(socket.id, { socketId: socket.id, time: Date.now() });
      
      // Notify helpers
      io.to("helpers-room").emit("new-distress-signal", { studentId: socket.id });

      // Step 10: Escalation Timeout (2 minutes)
      setTimeout(() => {
        if (waitingStudents.has(socket.id)) {
          console.log(`Escalating for student ${socket.id}`);
          // Backup ntfy alert
          fetch('https://ntfy.sh/meow-helpline-escalation', {
            method: 'POST',
            body: 'ESCALATION: Student waiting for >2 minutes!',
          }).catch(err => console.error('ntfy error:', err));
        }
      }, 2 * 60 * 1000); // 2 minutes
    });

    socket.on("helper-join", () => {
      console.log("Helper joined:", socket.id);
      socket.join("helpers-room");
      onlineHelpers.add(socket.id);
      
      // Send current waiting list
      socket.emit("waiting-list", Array.from(waitingStudents.values()));
    });

    socket.on("accept-student", (studentId) => {
      if (waitingStudents.has(studentId)) {
        const roomName = `room-${studentId}-${socket.id}`;
        
        socket.join(roomName);
        
        // Notify student they are matched
        io.to(studentId).emit("matched-with-helper", { roomId: roomName });
        // Notify helper
        socket.emit("matched-with-student", { roomId: roomName });

        // Remove from waiting list
        waitingStudents.delete(studentId);
        
        // Update all helpers
        io.to("helpers-room").emit("waiting-list", Array.from(waitingStudents.values()));
      }
    });

    socket.on("send-message", ({ roomId, message }) => {
      socket.to(roomId).emit("new-message", { message, senderId: socket.id });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      onlineHelpers.delete(socket.id);
      waitingStudents.delete(socket.id);
      io.to("helpers-room").emit("waiting-list", Array.from(waitingStudents.values()));
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
