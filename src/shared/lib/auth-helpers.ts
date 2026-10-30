

const PENDING_ROLE_KEY = 'elara_pending_role';
const PENDING_EMAIL_KEY = 'elara_pending_email';

export type PendingRole = 'customer' | 'seller';

export function setPendingRole(role: PendingRole, email: string): void {
  sessionStorage.setItem(PENDING_ROLE_KEY, role);
  sessionStorage.setItem(PENDING_EMAIL_KEY, email);
}

export function getPendingRole(): PendingRole | null {
  const role = sessionStorage.getItem(PENDING_ROLE_KEY);
  if (role === 'customer' || role === 'seller') return role;
  return null;
}

export function getPendingEmail(): string | null {
  return sessionStorage.getItem(PENDING_EMAIL_KEY);
}

export function clearPendingRole(): void {
  sessionStorage.removeItem(PENDING_ROLE_KEY);
  sessionStorage.removeItem(PENDING_EMAIL_KEY);
}
