export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  plan: 'Pro Candidate' | 'Enterprise' | 'Free Tier';
  joinedDate: string;
  analysesCount: number;
}

const AUTH_STORAGE_KEY = 'socialsense_auth_user';

export const DEMO_RECRUITER_USER: UserAccount = {
  id: 'usr_recruiter_demo',
  name: 'Ankur (Lead Evaluator)',
  email: 'ankur.evaluator@antigravity.ai',
  role: 'Technical Lead & Product Reviewer',
  plan: 'Pro Candidate',
  joinedDate: 'August 2026',
  analysesCount: 42,
};

export function getStoredUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return DEMO_RECRUITER_USER; // Default to demo user for seamless first impression
    return JSON.parse(raw);
  } catch (err) {
    return DEMO_RECRUITER_USER;
  }
}

export function saveUserSession(user: UserAccount | null): void {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Error saving user session:', err);
  }
}

export function signInWithCredentials(email: string, pass: string): UserAccount {
  const username = email.split('@')[0] || 'Creator';
  const formattedName = username.charAt(0).toUpperCase() + username.slice(1);

  const user: UserAccount = {
    id: `usr_${Date.now()}`,
    name: formattedName,
    email: email.trim().toLowerCase(),
    role: 'Content Strategist',
    plan: 'Pro Candidate',
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    analysesCount: 1,
  };

  saveUserSession(user);
  return user;
}

export function signInWithProvider(provider: 'google' | 'github'): UserAccount {
  const providerName = provider === 'google' ? 'Google User' : 'GitHub Developer';
  const user: UserAccount = {
    id: `usr_${provider}_${Date.now()}`,
    name: provider === 'google' ? 'Alex Rivera (Google)' : 'Devon Vance (GitHub)',
    email: `${provider}.user@socialsense.ai`,
    role: provider === 'google' ? 'Growth Marketing Lead' : 'Senior Full-Stack Engineer',
    plan: 'Pro Candidate',
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    analysesCount: 15,
  };

  saveUserSession(user);
  return user;
}

export function signOutUser(): void {
  saveUserSession(null);
}
