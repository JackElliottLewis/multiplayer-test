const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  
  // Add new player
  players[socket.id] = { x: 0, y: 0 };
  
  // Send current players to everyone
  io.emit("update", players);
  
  // Handle movement from client
  socket.on("move", (data) => {
    players[socket.id] = data;
    io.emit("update", players);
  });
  
  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("update", players);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
