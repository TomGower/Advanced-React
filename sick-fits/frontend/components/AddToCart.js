import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useCart } from '../lib/cartState';
import { CURRENT_USER_QUERY } from './User';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(productId: $id) {
      id
    }
  }
`;

// eslint-disable-next-line react/prop-types
function AddToCart({ id }) {
  const [addToCart, { loading }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  const { openCart } = useCart();
  const toggleClick = () => {
    addToCart();
    openCart();
  };
  return (
    <button disabled={loading} type="button" onClick={toggleClick}>
      Add{loading && 'ing'} to Cart 🛒
    </button>
  );
}

export default AddToCart;
