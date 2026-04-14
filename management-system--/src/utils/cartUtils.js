export function calculateCartTotals(userCart) {
  const items = userCart?.items || [];
  const discountRate = userCart?.discountRate || 0;

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discount = subtotal * discountRate;
  const shipping = subtotal > 0 ? 10 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal - discount + shipping + tax;

  return {
    subtotal,
    discount,
    shipping,
    tax,
    total,
  };
}