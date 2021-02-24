/* eslint-disable react/prop-types */
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Head from 'next/head';
import DisplayError from './ErrorMessage';
import formatMoney from '../lib/formatMoney';
import OrderStyles from './styles/OrderStyles';

const ORDER_QUERY = gql`
  query ORDER_QUERY($id: ID!) {
    Order(where: { id: $id }) {
      id
      label
      total
      charge
      user {
        id
        name
      }
      items {
        id
        name
        description
        photo {
          image {
            publicUrlTransformed
          }
        }
        price
        quantity
      }
    }
  }
`;

function Order({ id }) {
  const { data, loading, error } = useQuery(ORDER_QUERY, {
    variables: {
      id,
    },
  });
  console.log('id', id);
  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;
  const { user, items, total, id: orderId, charge } = data.Order;
  return (
    <OrderStyles>
      <Head>
        <title>Sick Fits - {orderId}</title>
      </Head>
      <p>
        <span>Order Id:</span>
        <span>{orderId}</span>
      </p>
      <p>
        <span>Charge:</span>
        <span>{charge}</span>
      </p>
      <p>
        <span>Order Total:</span>
        <span>{formatMoney(total)}</span>
      </p>
      <p>
        <span>Item Count:</span>
        <span>{items.length}</span>
      </p>
      <div className="items">
        {items.map((item) => (
          <div className="order-item" key={item.id}>
            <img src={item.photo.image.publicUrlTransformed} alt={item.name} />
            <div className="item-details">
              <h2>{item.name}</h2>
              <p>Qty: {item.quantity}</p>
              <p>Unit Price: {formatMoney(item.price)}</p>
              <p>Subtotal: {formatMoney(item.quantity * item.price)}</p>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* <h2>Hey, {user.name}</h2>
      <h4>
        Thank you for your order of {formatMoney(total)}. We appreciate your
        business.
      </h4>
      You ordered:
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.quantity} of {item.name}
          </li>
        ))}
      </ul> */}
    </OrderStyles>
  );
}

export default Order;
