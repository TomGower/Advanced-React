/* eslint-disable react/prop-types */
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-style: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;

// function doesn't need to be inside component itself
function update(cache, payload) {
  const id = cache.identify(payload.data.deleteCartItem);
  cache.evict(id);
}
// could improve on this with optimistic response, but optimisticResponse isn't working

function RemoveFromCart({ id }) {
  const [removeFromCart, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: { id },
    update,
    // optimisticResponse: {
    //   deleteCartItem: {
    //     __typename: 'CartItem',
    //     id,
    //   },
    // },
  });
  return (
    <BigButton
      disabled={loading}
      type="button"
      onClick={removeFromCart}
      title="Remove this item from your cart"
    >
      &times;
    </BigButton>
  );
}

export default RemoveFromCart;
