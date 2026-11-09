import { DurableObject } from "cloudflare:workers";

export class GameRoom extends DurableObject {
  async fetch(request) {
    const [client, server] = Object.values(new WebSocketPair());

    const me = {
      role: request.headers.get("X-Role"),
      userId: request.headers.get("X-User-Id"),
      name: request.headers.get("X-Name"),
    };

    // Hibernation API
    this.ctx.acceptWebSocket(server, [me.role]);
    server.serializeAttachment(me);

    const status = (await this.ctx.storage.get("status")) ?? "lobby";
    server.send(JSON.stringify({ type: "welcome", you: me, status }));
    this.broadcastPresence();

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws, message) {
    const who = ws.deserializeAttachment();
    let msg;
    try {
      msg = JSON.parse(message);
    } catch {
      return;
    }

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

  async webSocketClose(ws, code) {
    try {
      ws.close(code, "closing");
    } catch {
      //
    } // some codes (1005/1006) can't be echoed back
    this.broadcastPresence(ws);
  }

  async webSocketError(ws) {
    this.broadcastPresence(ws);
  }

  // Unique connected users, excluding a socket that is closing
  online(exclude) {
    const seen = new Map();
    for (const ws of this.ctx.getWebSockets()) {
      if (ws === exclude) continue;
      const who = ws.deserializeAttachment();
      if (who) seen.set(`${who.role}:${who.userId}`, who);
    }
    return [...seen.values()];
  }

  broadcastPresence(exclude) {
    this.broadcast({ type: "presence", online: this.online(exclude) }, exclude);
  }

  broadcast(obj, exclude) {
    const data = JSON.stringify(obj);
    for (const ws of this.ctx.getWebSockets()) {
      if (ws === exclude) continue;
      try {
        ws.send(data);
      } catch {
        console.log("Error broadcasting to a socket");
      }
    }
  }
}
