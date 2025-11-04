const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const socket = io();

let players = {};
let myId = null;

socket.on("connect", () => { myId = socket.id; });
socket.on("update", (data) => { players = data; });

document.addEventListener("keydown", (e) => {
  if (!myId) return;
  let player = players[myId];
  if (!player) return;
  if (e.key === "ArrowUp") player.y -= 5;
  if (e.key === "ArrowDown") player.y += 5;
  if (e.key === "ArrowLeft") player.x -= 5;
  if (e.key === "ArrowRight") player.x += 5;
  socket.emit("move", player);
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let id in players) {
    let p = players[id];
    ctx.fillStyle = id === myId ? "red" : "blue";
    ctx.fillRect(p.x, p.y, 50, 50);
  }
  requestAnimationFrame(draw);
}

draw();
