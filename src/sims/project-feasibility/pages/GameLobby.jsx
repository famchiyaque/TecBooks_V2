import { useParams } from "react-router-dom";
import { useGameSocket } from "../hooks/useGameSocket";
import { TeacherLobby } from "@/components/sims/program/game/TeacherLobby";
import { StudentLobby } from "@/components/sims/program/game/StudentLobby";

export default function GameLobby() {
  const { code } = useParams();

  const token = sessionStorage.getItem(`session:${code}`); // ?? getAuthToken();

  const { connected, me, online, gameStatus, send } = useGameSocket(
    code,
    token,
  );

  if (!token) return <p>You need to join this game first.</p>;
  if (!me) return <p>{connected ? "Loading…" : "Connecting…"}</p>;
  if (gameStatus === "running") return <p>Game in progress…</p>;

  const students = online.filter((u) => u.role === "student");

  return me.role === "teacher" ? (
    <TeacherLobby
      code={code}
      students={students}
      onStart={() => send({ type: "start_game" })}
    />
  ) : (
    <StudentLobby name={me.name} students={students} />
  );
}
