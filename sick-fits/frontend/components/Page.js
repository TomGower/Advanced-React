import PropTypes from 'prop-types';

// eslint-disable-next-line react/prop-types
function Page({ children }) {
  return (
    <div>
      <h2>I am the page component</h2>
      {children}
    </div>
  );
}

export default Page;

Page.propTypes = {
  // children: PropTypes.oneOf([
  //   PropTypes.arrayOf(PropTypes.node),
  //   PropTypes.node,
  // ]),
  children: PropTypes.any,
};
