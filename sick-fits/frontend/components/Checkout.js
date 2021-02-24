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
import SickButton from './styles/SickButton';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

// const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {
  const [stateError, setStateError] = useState();
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
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
    console.log('pyamentMethod', paymentMethod);
    // 4a. Handle any errors from Stripe (CC not accepted/declined, credit limit, Discover not accepted in country, etc)
    if (error) {
      console.log('we got an error', error);
      setStateError(error);
    }
    // 4b. Send token from successful payment to Keystone server via custom mutation
    // 5. Change page to view the order
    // 6. Close the cart
    // 7. Turn the loader off
    setLoading(false);
    nProgress.done();
  }

  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {stateError && <p style={{ fontSize: 12 }}>{stateError.message}</p>}
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
