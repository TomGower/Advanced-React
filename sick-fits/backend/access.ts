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
