// Central place to calculate all prices
// Keeps logic consistent across pages
export function calculateCartTotals(userCart) {
  // Sum of all items
  const items = userCart?.items || [];
  const discountRate = userCart?.discountRate || 0;

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity
  , 0);

  const discount = subtotal * discountRate;
  // Free shipping over $50
  const shipping = 0;
  // Simple 8% tax
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