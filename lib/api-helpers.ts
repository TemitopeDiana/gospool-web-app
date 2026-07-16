import type { ApiResponse } from '@/types/api.type';
import { normalizeError } from './normaliseError';
import { api, apiV1 } from './api';

export const buildQuery = (
  params: Record<string, string | number | undefined | null>
): string => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query ? `?${query}` : '';
};

export const toErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as { message?: string; error?: string } | undefined;
  return err?.message || err?.error || fallback;
};

export async function fetchResource<T>(
  path: string,
  fallback: string
): Promise<ApiResponse<T>> {
  try {
    const response = await apiV1.get(path);
    if (process.env.NODE_ENV === 'development')
      console.log(`${path.toUpperCase()}`, { response });

    return {
      success: response.data.success ?? true,
      message: response?.data.message,
      data: response?.data.data as T,
    };
  } catch (error) {
    console.log(`${path.toUpperCase()}`, { error });
    return normalizeError(error, fallback);
  }
}

export async function postResource<T>(
  path: string,
  payload: unknown,
  fallback: string,
  asV1 = true
): Promise<ApiResponse<T>> {
  try {
    const response = asV1
      ? await apiV1.post(path, payload)
      : await api.post(path, payload);

    if (process.env.NODE_ENV === 'development')
      console.log(`${path.toUpperCase()}`, 'RESPONSE', response.data);

    return {
      success: response.data.success ?? true,
      message: response?.data.message,
      data: response?.data.data as T,
    };
  } catch (error) {
    console.log(`${path.toUpperCase()}`, { error });

    return normalizeError(error, fallback);
  }
}

export async function patchResource<T>(
  path: string,
  payload: unknown,
  fallback: string
): Promise<ApiResponse<T>> {
  try {
    const response = await apiV1.patch(path, payload);
    if (process.env.NODE_ENV === 'development')
      console.log(`${path.toUpperCase()}`, { response });
    return {
      success: response.data.success ?? true,
      message: response?.data.message,
      data: response?.data.data as T,
    };
  } catch (error) {
    console.log(`${path.toUpperCase()}`, { error });

    return normalizeError(error, fallback);
  }
}
export async function putResource<T>(
  path: string,
  payload: unknown,
  fallback: string
): Promise<ApiResponse<T>> {
  try {
    const response = await apiV1.put(path, payload);
    if (process.env.NODE_ENV === 'development')
      console.log(`${path.toUpperCase()}`, { response });
    return {
      success: response.data.success ?? true,
      message: response?.data.message,
      data: response?.data.data as T,
    };
  } catch (error) {
    console.log(`${path.toUpperCase()}`, { error });

    return normalizeError(error, fallback);
  }
}

export async function deleteResource<T>(
  path: string,
  fallback: string
): Promise<ApiResponse<T>> {
  try {
    const response = await apiV1.delete(path);
    if (process.env.NODE_ENV === 'development')
      console.log(`${path.toUpperCase()}`, { response });

    return {
      success: response.data.success ?? true,
      message: response?.data.message,
      data: response?.data.data as T,
    };
  } catch (error) {
    console.log(`${path.toUpperCase()}`, { error });
    return normalizeError(error, fallback);
  }
}
