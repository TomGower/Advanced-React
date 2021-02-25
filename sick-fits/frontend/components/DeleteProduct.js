import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteProduct));
}

// eslint-disable-next-line react/prop-types
function DeleteProduct({ id, children }) {
  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT_MUTATION, {
    variables: { id },
    update,
  });
  function handleClick() {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to delete this product?')) {
      // delete the product
      deleteProduct().catch((error) => alert(error.message));
      // item still shows up on browser because it is in cache
    }
  }
  return (
    <button type="button" disabled={loading} onClick={handleClick}>
      {children}
    </button>
  );
}

export default DeleteProduct;
