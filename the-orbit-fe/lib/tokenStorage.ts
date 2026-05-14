import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const AUTH_TOKEN_KEY = 'orbit.authToken';

type WebStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

let cachedToken: string | null = null;

function getWebStorage(): WebStorage | null {
  if (Platform.OS !== 'web') {
    return null;
  }

  return (globalThis as typeof globalThis & { localStorage?: WebStorage }).localStorage ?? null;
}

export async function getAuthToken() {
  if (cachedToken) {
    return cachedToken;
  }

  const webStorage = getWebStorage();
  if (webStorage) {
    cachedToken = webStorage.getItem(AUTH_TOKEN_KEY);
    return cachedToken;
  }

  cachedToken = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  return cachedToken;
}

export async function setAuthToken(token: string) {
  cachedToken = token;

  const webStorage = getWebStorage();
  if (webStorage) {
    webStorage.setItem(AUTH_TOKEN_KEY, token);
    return;
  }

  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
}

export async function clearAuthToken() {
  cachedToken = null;

  const webStorage = getWebStorage();
  if (webStorage) {
    webStorage.removeItem(AUTH_TOKEN_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
}
