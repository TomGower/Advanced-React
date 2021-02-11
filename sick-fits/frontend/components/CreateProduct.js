import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Router from 'next/router';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import { ALL_PRODUCTS_QUERY } from './Products';

const CREATE_PRODUCT_MUTATON = gql`
  mutation CREATE_PRODUCT_MUTATION(
    # Which variables are getting passed in, and which types are they?
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        status: "AVAILABLE"
        # photo is its own type, so it needs to be a ProductImage
        photo: { create: { image: $image, altText: $name } }
      }
    ) {
      id
      price
      description
      name
    }
  }
`;

export default function CreateProduct() {
  const { inputs, handleChange, resetForm, clearForm } = useForm({
    image: '',
    name: '',
    price: 12345,
    description: 'this is the best short',
  });

  const [createProduct, { loading, error, data }] = useMutation(
    CREATE_PRODUCT_MUTATON,
    {
      variables: inputs,
      // this next line lets you refetch queries (duh) that mutation affects
      // refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
    }
  );

  async function handleSubmit(e) {
    e.preventDefault();
    // console.log(inputs);

    // submit the input fields to the back end;

    // createProduct is defined with variables, which can be pre-known
    // otherwise, you can pass the variables here
    const res = await createProduct();
    clearForm();
    // Go to that product's page
    Router.push({
      pathname: `/product/${res.data.createProduct.id}`,
      // can pass other properties, check NextJS docs for those
    });
  }

  return (
    <Form onSubmit={handleSubmit}>
      <DisplayError error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="image">
          Name:
          <input
            required
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="name">
          Name:
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price:
          <input
            type="number"
            id="price"
            name="price"
            placeholder="price"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description:
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">+ Add Product</button>
      </fieldset>
    </Form>
  );
}
