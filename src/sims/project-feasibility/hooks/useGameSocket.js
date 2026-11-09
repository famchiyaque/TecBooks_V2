import workerApi from "@/utils/worker.util";
import { useEffect, useRef, useState, useCallback } from "react";

const WS_BASE = workerApi.defaults.baseURL.replace(/^http/, "ws");

export function useGameSocket(code, token) {
  const [connected, setConnected] = useState(false);
  const [me, setMe] = useState(null);
  const [online, setOnline] = useState([]);
  const [gameStatus, setGameStatus] = useState("lobby");
  const wsRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    let stopped = false;
    let retryTimer;

    function connect() {
      const ws = new WebSocket(
        `${WS_BASE}/ws/rooms/${code}?token=${encodeURIComponent(token)}`,
      );
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);

      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        switch (msg.type) {
          case "welcome":
            setMe(msg.you);
            setGameStatus(msg.status);
            break;
          case "presence":
            setOnline(msg.online);
            break;
          case "game_started":
            setGameStatus("running");
            break;
        }
      };

      ws.onclose = () => {
        setConnected(false);
        if (!stopped) retryTimer = setTimeout(connect, 2000);
      };
    }

    connect();
    return () => {
      stopped = true;
      clearTimeout(retryTimer);
      wsRef.current?.close();
    };
  }, [code, token]);

  const send = useCallback((obj) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(obj));
    }
  }, []);

  return { connected, me, online, gameStatus, send };
}
