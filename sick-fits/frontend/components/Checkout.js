import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useState } from 'react';
import nProgress from 'nprogress';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import SickButton from './styles/SickButton';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

// const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {
  const [stateError, setStateError] = useState();
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [checkout, { error: graphqlError }] = useMutation(
    CREATE_ORDER_MUTATION
  );
  async function handleSubmit(e) {
    console.log('need to do some work to handle submit');
    // 1. Stop the form from submitting and turn the loader on
    e.preventDefault();
    setLoading(true);
    // 2. Start the page transition
    nProgress.start();
    // 3. Create payment method via Stripe
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    console.log('paymentMethod', paymentMethod);
    // 4a. Handle any errors from Stripe (CC not accepted/declined, credit limit, Discover not accepted in country, etc)
    if (error) {
      console.log('we got an error', error);
      setStateError(error);
      nProgress.done();
      return; // this stops the checkout from happening
    }
    // 4b. Send token from successful payment to Keystone server via custom mutation
    const order = await checkout({
      variables: {
        token: paymentMethod.id,
      },
    });
    console.log('finished with the order', order);
    // 5. Change page to view the order
    // 6. Close the cart
    // 7. Turn the loader off
    setLoading(false);
    nProgress.done();
  }

  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {stateError && <p style={{ fontSize: 12 }}>{stateError.message}</p>}
      {graphqlError && <p style={{ fontSize: 12 }}>{graphqlError.message}</p>}
      <CardElement />
      <SickButton>Check Out Now</SickButton>
    </CheckoutFormStyles>
  );
}

function Checkout() {
  const [stripeLib, loadStripeLib] = useState(() =>
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
  );
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}

export default Checkout;
