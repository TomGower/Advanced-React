// folder that holds all of our access functions
// at its simplest, access control is either yes or not based on user's session

import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

// Permission check if someone meets a criterion, yes or no
export const permissions = {
  ...generatedPermissions,
  canDance({ session }: ListAccessArgs): boolean {
    if (!session) return true;
    return false;
  },
};

// Rule based functions - return Boolean or set of filters that can be updated
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) return false;
    // 1. do they have permission of canManageProducts?
    if (permissions.canManageProducts({ session })) return true;
    // 2. if not, do they own this item?
    return { user: { id: session.itemId } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) return false;
    if (permissions.canManageProducts({ session })) return true; // can read everything
    // otherwise, should only see available products based on status field
    return { status: 'AVAILABLE' };
  },
  canOrder({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) return false;
    if (permissions.canManageCart({ session })) return true;
    // if they can't manage anybody's cart, is this their cart?
    return { user: { id: session.itemId } };
  },
  canManageOrderItems({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) return false;
    if (permissions.canManageCart({ session })) return true;
    // if they can't manage anybody's cart, is this their cart?
    return { order: { user: { id: session.itemId } } };
  },
};
