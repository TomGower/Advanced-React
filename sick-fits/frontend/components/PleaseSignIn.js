import { useUser } from './User';
import SignIn from './SignIn';

function PleaseSignIn({ children }) {
  const currentUser = useUser();
  if (!currentUser) return <SignIn />;
  return children;
}

export default PleaseSignIn;
