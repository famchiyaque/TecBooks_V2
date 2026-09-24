function safeFileName(fileName) {
  return String(fileName ?? 'project.xlsx').replace(/[^a-zA-Z0-9._-]/g, '_');
}

export function projectObjectKey({ createdBy, programId, gameId, fileName }) {
  return `feasibility/${createdBy}/${programId}/${gameId}/${safeFileName(fileName)}`;
}

export async function putProjectWorkbook(bucket, key, file) {
  if (!bucket) {
    const error = new Error('r2_not_configured');
    error.status = 500;
    throw error;
  }
  const body = await file.arrayBuffer();
  await bucket.put(key, body, {
    httpMetadata: {
      contentType: file.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    customMetadata: {
      fileName: file.name ?? 'project.xlsx',
    },
  });
  return key;
}

export async function deleteProjectWorkbook(bucket, key) {
  if (!bucket || !key) return;
  await bucket.delete(key);
}
