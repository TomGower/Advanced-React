import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

/* eslint-disable react/prop-types */
const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;

function DeleteProduct({ id, children }) {
  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT_MUTATION, {
    variables: { id },
  });
  function handleClick() {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to delete this product?')) {
      // delete the product
      console.log(`DELETING ${id}`);
      deleteProduct().catch((error) => alert(error.message));
    }
  }
  return (
    <button type="button" disabled={loading} onClick={handleClick}>
      {children}
    </button>
  );
}

export default DeleteProduct;
