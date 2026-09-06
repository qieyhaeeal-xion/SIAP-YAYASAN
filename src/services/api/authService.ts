import { api, tokenStorage } from './client';
import { UserProfile } from '../../types/sisantri';

interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: UserProfile;
    accessToken: string;
    refreshToken: string;
  };
}

interface MeResponse {
  success: boolean;
  data: UserProfile;
}

export async function login(username: string, password: string): Promise<UserProfile> {
  const response = await api.post<AuthResponse>('/auth/login', { username, password });
  tokenStorage.setTokens(response.data.data.accessToken, response.data.data.refreshToken);
  return response.data.data.user;
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  if (!tokenStorage.getAccessToken() && !tokenStorage.getRefreshToken()) return null;

  try {
    const response = await api.get<MeResponse>('/auth/me');
    return response.data.data;
  } catch {
    tokenStorage.clear();
    return null;
  }
}

export async function logout(): Promise<void> {
  const refreshToken = tokenStorage.getRefreshToken();
  try {
    if (tokenStorage.getAccessToken()) await api.post('/auth/logout', { refreshToken });
  } finally {
    tokenStorage.clear();
  }
}
