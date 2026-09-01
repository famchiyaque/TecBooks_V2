export function projectDisplayName(project) {
  return (
    project?.name
    || project?.cbm?.metadata?.name
    || project?.cbm?.bom?.productName
    || ''
  )
}

export function toSidebarPrograms(programs = []) {
  return programs.map((program) => ({
    id: program.id,
    name: program.name,
    projects: (program.projects ?? []).map((project) => ({
      id: project.id,
      name: projectDisplayName(project) || `Project ${project.id}`,
    })),
  }))
}

export function findProgramProject(programs, programId, projectId) {
  const program = (programs ?? []).find((item) => String(item.id) === String(programId))
  if (!program) return { program: null, project: null }
  const project = (program.projects ?? []).find((item) => String(item.id) === String(projectId))
  return { program, project: project ?? null }
}
