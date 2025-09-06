import React from 'react';
import { permissionRules } from '@/lib/permission-rules';

interface RBACProps {
  children: React.ReactNode;
  requiredPermission: string;
  renderNoAccess?: React.ReactNode;
  roles: (keyof typeof permissionRules)[];
}

const getPermissionsForRoles = (roles: (keyof typeof permissionRules)[]) => {
  const permissionSet = new Set<string>();
  roles.forEach((role) => {
    const permissions = permissionRules[role] || [];
    permissions.forEach((permission) => permissionSet.add(permission));
  });
  return Array.from(permissionSet);
};

/**
 * Handles Role-Based Access Control (RBAC) for rendering components based on user roles and permissions.
 * Permission rules are defined in `lib/permission-rules.ts`.
 *
 * Sample usage:
 * ```tsx
 * <RBAC
 *   roles={['churchAdmin', 'branchAdmin']}
 *   requiredPermission="church:edit"
 *   renderNoAccess={<div>No access</div>}
 * >
 *   <EditChurchComponent />
 * </RBAC>
 * ```
 * @param {{
 *  children: React.ReactNode;
 *  requiredPermission: string;
 *  renderNoAccess?: React.ReactNode;
 *  roles: (keyof typeof permissionRules)[];
 * }} props
 * @returns
 */
export default function RBAC({
  children,
  requiredPermission,
  renderNoAccess = null,
  roles,
}: RBACProps) {
  const permissions = getPermissionsForRoles(roles);
  if (!permissions.includes(requiredPermission)) {
    return renderNoAccess || null;
  }
  return <>{children}</>;
}
