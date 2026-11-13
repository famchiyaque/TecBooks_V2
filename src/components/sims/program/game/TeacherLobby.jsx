export function TeacherLobby({ code, students, onStart }) {
  return (
    <div>
      <h1>Game lobby</h1>
      <p>
        Room code: <strong>{code}</strong>
      </p>

      <h2>Connected students ({students.length})</h2>
      <ul>
        {students.map((s) => (
          <li key={s.userId}>{s.name}</li>
        ))}
      </ul>

      <button onClick={onStart} disabled={students.length === 0}>
        Start game
      </button>
    </div>
  );
}
