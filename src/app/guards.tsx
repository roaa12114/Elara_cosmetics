import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@shared/lib/useAuth';
import type { Role } from '@shared/types';

const roleHome: Record<Role, string> = {
  customer: '/',
  seller: '/seller',
  admin: '/admin',
};

type RequireRoleProps = {
  roles: Role[];
  children?: ReactNode;
};

export function RequireRole({ roles, children }: RequireRoleProps) {
  const { isAuthenticated, hasRole, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
  }

  if (!user || !hasRole(...roles)) {
    return <Navigate to={roleHome[user?.role ?? 'customer']} replace />;
  }

  return <>{children ?? <Outlet />}</>;
}

export function PublicOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated && user) {
    return <Navigate to={roleHome[user.role]} replace />;
  }
  return <>{children}</>;
}
