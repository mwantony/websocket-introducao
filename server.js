// server.js
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
const clients = new Map();

wss.on("connection", ws => {
  ws.on("message", msg => {
    const data = JSON.parse(msg);

    if (data.type === "join") {
      clients.set(ws, data.name);
      broadcast(`${data.name} entrou no chat`);
    }

    if (data.type === "chat") {
      const name = clients.get(ws) || "Anônimo";
      broadcast(`${name}: ${data.message}`);
    }
  });

  ws.on("close", () => {
    const name = clients.get(ws);
    clients.delete(ws);
    broadcast(`${name} saiu do chat`);
  });
});

function broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

console.log("Servidor WebSocket rodando em ws://localhost:8080");
