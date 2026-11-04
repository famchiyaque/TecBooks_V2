import { DurableObject } from "cloudflare:workers";
import { data } from "jquery";

// Handle batches: To be defined
function sendBatch(ws, messages) {
  const batch = {
    messages,
    timestamp: Date.now(),
  };
  ws.send(JSON.stringify(batch));
}

export class GameRoom extends DurableObject {
  students = new Map();

  async fetch(request) {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected a WebSocket upgrade request", {
        status: 426,
      });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    // acceptWebSocket to enable hibernation
    this.ctx.acceptWebSocket(server);

    return new Response(null, { status: 101, webSocket: client });
  }
  async webSocketMessage(ws, message) {
    if (typeof message !== "string") return;

    const data = JSON.parse(message);
    this.handleMessage(ws, data);
  }

  async handleMessage(ws, msg) {
    switch (msg.type) {
      case "create":
        break;
      case "join":
        this.students.set(msg.id, { studentId: "PlaceholderStudentId" });
        // await this.ctx.storage.setAlarm(Date.now()+50)
        break;

      default:
        break;
    }
  }

  // TODO: Handle close
  async webSocketClose(ws, code, reason) {
    for (const [id] of this.students) {
      this.students.delete(id);
    }
  }

  broadcast(payload) {
    const message = JSON.stringify(payload);
    for (const ws of this.ctx.getWebSockets()) {
      ws.send(message);
    }
  }
}
