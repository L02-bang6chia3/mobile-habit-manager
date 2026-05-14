import { apiRequest } from './apiClient';
import { setAuthToken } from './tokenStorage';

type ApiEnvelope<T> = {
  data: T;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  username: string;
};

export async function login(payload: LoginPayload) {
  const response = await apiRequest<ApiEnvelope<string>>('/api/auth/login', {
    method: 'POST',
    body: payload,
    skipAuth: true,
  });

  await setAuthToken(response.data);
  return response.data;
}

export async function register(payload: RegisterPayload) {
  const response = await apiRequest<ApiEnvelope<string>>('/api/auth/register', {
    method: 'POST',
    body: payload,
    skipAuth: true,
  });

  return response.data;
}
