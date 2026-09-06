import { INITIAL_USERS } from '../data/mockData';
import { UserProfile } from '../types/sisantri';

const CURRENT_USER_KEY = 'siap_current_user';
const DEMO_PASSWORD = '123456';

export async function login(username: string, password: string): Promise<UserProfile> {
  const user = INITIAL_USERS.find(item => item.username.toLowerCase() === username.trim().toLowerCase());

  if (!user || password !== DEMO_PASSWORD) {
    throw new Error('Username atau kata sandi salah.');
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const storedUser = localStorage.getItem(CURRENT_USER_KEY);
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as UserProfile;
  } catch {
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
}

export function logout(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}
