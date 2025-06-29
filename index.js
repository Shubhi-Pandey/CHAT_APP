import express from "express"; //To create web server
import { Server } from "socket.io"; //To create Socket.IO server
import http from "http"; //To create http server
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve index.html file
app.get("/user", (req, res) => {
  res.sendFile(path.join(__dirname, "user.html"));
});
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});
const users = {};
io.on("connection", (socket) => {
  console.log("New Connection:", socket.id);

  /**************used for broadcasting the message to all connected users************************ */
  // socket.on("chat message", (msg) => {
  //   console.log(msg);

  //   io.emit("chat message", msg);
  // });

  socket.on("register", (username) => {
    console.log(username);

    users[username] = socket.id;
    console.log(`User registered ${username}->${socket.id}`);
  });
  socket.on("private message", ({ from, to, message }) => {
    console.log(from, to, message);

    const toSocketId = users[to];
    if (toSocketId) {
      io.to(toSocketId).emit("private message", { from, message });
    } else {
      socket.emit("private message", {
        from: "System",
        message: "User not online",
      });
    }
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
