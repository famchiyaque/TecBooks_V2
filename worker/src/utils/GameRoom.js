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
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    const role = request.headers.get("X-Role");
    const userId = request.headeres.get("X-User-Id");
    const name = request.headers.get("X-Name");

    // Hibernation API
    this.ctx.acceptWebSocket(server, [role]);
    server.serializeAttachment({ role, uerId, name });

    this.broadcast({ type: "presence", event: "join", name, role });
    server.send(
      JSON.stringify({
        type: "welcome",
        online: this.ctx
          .getWebSockets()
          .map((ws) => ws.deserializeAttachment()),
      }),
    );

    return new Response(null, { status: 101, webSocket: client });
  }
  async webSocketMessage(ws, message) {
    const who = ws.deserializeAttachment();
    const msg = JSON.parse(raw);

    switch (msg.type) {
      case "start_game":
        if (who.role !== "teacher") return;
        await this.ctx.storage.put("status", "running");
        this.broadcast({ type: "game_started" });
        break;

      case "action":
        if (who.role !== "student") return;
        this.broadcast({ type: "action", by: who.name, payload: msg.payload });
        break;
    }
  }

  async webSocketClose(ws, code, reason) {
    const who = ws.deserializeAttachment();
    ws.close(code, "closing");
    this.broadcast({ type: "presence", event: "leave", name: who?.name });
  }

  async webSocketError(ws) {
    /* Optional logging */
  }

  broadcast(obj, only) {
    const data = JSON.stringify(obj);
    for (const ws of this.ctx.getWebSockets(only)) {
      try {
        ws.send(data);
      } catch {}
    }
  }
}
