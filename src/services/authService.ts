import { INITIAL_USERS } from '../data/mockData';
import { UserProfile } from '../types/sisantri';

const CURRENT_USER_KEY = 'siap_current_user';
const USERS_KEY = 'sisantri_app_users';
const PASSWORDS_KEY = 'siap_admin_passwords';
const DEMO_PASSWORD = '123456';

function getStoredUsers(): UserProfile[] {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) return INITIAL_USERS;
    const users = JSON.parse(stored) as UserProfile[];
    return users.filter(user => user.role === 'admin_yayasan');
  } catch {
    return INITIAL_USERS;
  }
}

function getPassword(username: string): string {
  try {
    const passwords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || '{}') as Record<string, string>;
    return passwords[username] || DEMO_PASSWORD;
  } catch {
    return DEMO_PASSWORD;
  }
}

export function saveAuthenticatedUser(user: UserProfile): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export async function login(username: string, password: string): Promise<UserProfile> {
  const normalizedUsername = username.trim().toLowerCase();
  const user = getStoredUsers().find(item => item.username.toLowerCase() === normalizedUsername);

  if (!user || password !== getPassword(user.username)) {
    throw new Error('Username atau kata sandi salah.');
  }

  saveAuthenticatedUser(user);
  return user;
}

export function changeAdminPassword(username: string, currentPassword: string, newPassword: string): void {
  if (currentPassword !== getPassword(username)) {
    throw new Error('Kata sandi saat ini salah.');
  }
  const passwords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || '{}') as Record<string, string>;
  passwords[username] = newPassword;
  localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
}

export function renameAdminPassword(oldUsername: string, newUsername: string): void {
  if (oldUsername === newUsername) return;
  const passwords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || '{}') as Record<string, string>;
  if (passwords[oldUsername]) {
    passwords[newUsername] = passwords[oldUsername];
    delete passwords[oldUsername];
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
  }
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const storedUser = localStorage.getItem(CURRENT_USER_KEY);
  if (!storedUser) return null;

  try {
    const user = JSON.parse(storedUser) as UserProfile;
    if (user.role !== 'admin_yayasan') {
      localStorage.removeItem(CURRENT_USER_KEY);
      return null;
    }
    return user;
  } catch {
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
}

export function logout(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}
