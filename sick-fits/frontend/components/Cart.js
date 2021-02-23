import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CartItem from './CartItem';
import { useUser } from './User';
import formatMoney from '../lib/formatMoney';
import calcTotalPrice from '../lib/calcTotalPrice';

function Cart() {
  const currentUser = useUser();
  if (!currentUser) return null;
  console.log('currentUser', currentUser);
  return (
    <CartStyles open>
      <header>
        <Supreme>{currentUser.name}'s Cart</Supreme>
      </header>
      <ul>
        {currentUser.cart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </ul>
      <footer>
        <p>{formatMoney(calcTotalPrice(currentUser.cart))}</p>
      </footer>
    </CartStyles>
  );
}

export default Cart;
