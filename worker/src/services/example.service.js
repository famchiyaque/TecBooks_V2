import { findExampleById, listExamples, insertExample } from '../models/example.model.js';

export async function getExample(db, id) {
  const example = await findExampleById(db, id);
  if (!example) {
    const error = new Error('Example not found');
    error.status = 404;
    throw error;
  }
  return example;
}

export async function getAllExamples(db) {
  return listExamples(db);
}

export async function createExample(db, name) {
  const trimmed = (name ?? '').trim();
  if (!trimmed) {
    const error = new Error('name is required');
    error.status = 400;
    throw error;
  }
  return insertExample(db, trimmed);
}
