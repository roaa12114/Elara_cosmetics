import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@shared/lib/auth-store';
import type { Role } from '@shared/types';

const roleHome: Record<Role, string> = {
  customer: '/',
  seller: '/seller',
  admin: '/admin',
};

// Protects seller/admin routes — bounces unauthenticated users to /sign-in,
// and authenticated-but-wrong-role users to their own role's home.
export function RequireRole({ roles }: { roles: Role[] }) {
  const { isAuthenticated, hasRole, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
  }

  if (!user || !hasRole(...roles)) {
    return <Navigate to={roleHome[user?.role ?? 'customer']} replace />;
  }

  return <Outlet />;
}

// Protects auth routes — bounces already-authenticated users to their role home
// so they can't re-login or re-register while signed in.
export function PublicOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated && user) {
    return <Navigate to={roleHome[user.role]} replace />;
  }
  return <>{children}</>;
}
