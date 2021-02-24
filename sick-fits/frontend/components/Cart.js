import CartStyles from './styles/CartStyles';
import CloseButton from './styles/CloseButton';
import Supreme from './styles/Supreme';
import CartItem from './CartItem';
import { useUser } from './User';
import formatMoney from '../lib/formatMoney';
import calcTotalPrice from '../lib/calcTotalPrice';
import { useCart } from '../lib/cartState';
import Checkout from './Checkout';

function Cart() {
  const currentUser = useUser();
  const { cartOpen, closeCart } = useCart();
  if (!currentUser) return null;
  return (
    <CartStyles open={cartOpen}>
      <header>
        <Supreme>{currentUser.name}'s Cart</Supreme>
        <CloseButton onClick={closeCart}>&times;</CloseButton>
      </header>
      <ul>
        {currentUser.cart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </ul>
      <footer>
        <p>{formatMoney(calcTotalPrice(currentUser.cart))}</p>
        <Checkout />
      </footer>
    </CartStyles>
  );
}

export default Cart;
