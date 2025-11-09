import { API_BASE_URL } from '../config';
import type { ApiError } from './types';

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  let errorMessage = 'Unexpected error';
  try {
    const errorBody = (await response.json()) as ApiError;
    if (errorBody?.message) {
      errorMessage = errorBody.message;
    }
  } catch (error) {
    if (error instanceof Error) {
      errorMessage = error.message;
    }
  }

  throw new Error(errorMessage);
}

export async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return parseResponse<T>(response);
}
