export function StudentLobby({ name, students }) {
  return (
    <div>
      <h1>Welcome, {name}</h1>
      <p>Waiting for the teacher to start the game…</p>
      <p>{students.length} student(s) connected</p>
    </div>
  );
}
