import type { Role, User } from '@shared/types';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasRole: (...roles: Role[]) => boolean;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
}
