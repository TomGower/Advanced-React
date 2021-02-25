// folder that holds all of our access functions
// at its simplest, access control is either yes or not based on user's session

import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}
