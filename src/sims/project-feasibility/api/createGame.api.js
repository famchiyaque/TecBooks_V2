import workerApi from "@/utils/worker.util";

export async function createGame(form) {
  const { data } = await workerApi.post("/api/games/create", form);
  return data;
}
