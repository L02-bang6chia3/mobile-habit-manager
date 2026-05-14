import { getAuthToken } from './tokenStorage';

const DEFAULT_API_URL = 'http://localhost:5000';

type ApiRequestOptions = Omit<RequestInit, 'body' | 'headers'> & {
  body?: unknown;
  headers?: Record<string, string>;
  skipAuth?: boolean;
};

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

function normalizeBaseUrl(url?: string) {
  const trimmed = url?.trim();
  if (!trimmed) {
    return DEFAULT_API_URL;
  }

  return trimmed.replace(/\/+$/, '');
}

export function getApiBaseUrl() {
  return normalizeBaseUrl(process.env.EXPO_PUBLIC_API_URL);
}

function buildUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

function parseJson(text: string) {
  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractErrorMessage(payload: unknown, status: number) {
  if (payload && typeof payload === 'object') {
    const data = payload as {
      error?: unknown;
      message?: unknown;
      title?: unknown;
      errors?: Record<string, string[]>;
    };

    if (typeof data.error === 'string') {
      return data.error;
    }

    if (typeof data.message === 'string') {
      return data.message;
    }

    if (data.errors) {
      const firstError = Object.values(data.errors).flat()[0];
      if (firstError) {
        return firstError;
      }
    }

    if (typeof data.title === 'string') {
      return data.title;
    }
  }

  return `Request failed with status ${status}.`;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, headers: customHeaders, skipAuth, ...requestOptions } = options;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...customHeaders,
  };

  let requestBody: BodyInit | undefined;
  if (body !== undefined) {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
    requestBody = JSON.stringify(body);
  }

  if (!skipAuth) {
    const token = await getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(buildUrl(path), {
    ...requestOptions,
    headers,
    body: requestBody,
  });

  const responsePayload = parseJson(await response.text());

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(responsePayload, response.status), response.status, responsePayload);
  }

  return responsePayload as T;
}
