import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    endSession
  }
`;

function SignOut() {
  const [signout, { data, error, loading }] = useMutation(SIGNOUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  // I did this one initially, but it's really not needed. Signout is all you need, and there's no real event
  // async function handleClick(e) {
  //   e.preventDefault();
  //   await signout();
  // }
  return (
    <div>
      <button type="button" onClick={signout}>
        Click here to sign out of your account.
      </button>
    </div>
  );
}

export default SignOut;
