export default function calcTotalPrice(cart) {
  // let total = 0;
  // for (const item of cart) {
  //   total += item.quantity * item.product.price;
  // }
  // return total;

  // Wes solution
  return cart.reduce((acc, curr) => {
    if (!curr.product) return acc;
    return acc + curr.quantity * curr.product.price;
  }, 0);
}
