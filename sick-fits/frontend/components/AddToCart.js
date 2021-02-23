import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useCart } from '../lib/cartState';
import { CURRENT_USER_QUERY } from './User';

/* eslint-disable react/prop-types */
const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(productId: $id) {
      id
    }
  }
`;

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
  // need to do loading state
  return (
    <button disabled={loading} type="button" onClick={toggleClick}>
      Add{loading && 'ing'} to Cart 🛒
    </button>
  );
}

export default AddToCart;
