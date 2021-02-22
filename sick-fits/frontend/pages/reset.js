/* eslint-disable react/prop-types */
import RequestReset from '../components/RequestReset';
import Reset from '../components/Reset';

function ResetPage({ query }) {
  if (!query?.token) {
    return (
      <div>
        <p>You must include a token to reset your password.</p>
        <RequestReset />
      </div>
    );
  }
  return (
    <div>
      <p>RESET YOUR PASSWORD {query?.token}</p>
      <Reset token={query?.token} />
    </div>
  );
}

export default ResetPage;
