import { listProjects } from "../services/projects.service.js";

export async function getProjects(c) {
  try {
    const projects = await listProjects(c.env.DB);
    return c.json(projects);
  } catch (error) {
    console.error("getProjects failed:", error);
    return c.json({ error: "Could not load projects" }, 500);
  }
}
