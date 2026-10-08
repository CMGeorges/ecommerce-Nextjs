function changeQuantity(items, id, delta) {
  return items.map(item => item._id === id ? {...item, quantity: Math.max(1, Math.min(99, item.quantity + delta))} : item);
}
function totals(items) {
  return {totalQuantity: items.reduce((n, item) => n + item.quantity, 0),
    totalPrice: items.reduce((n, item) => n + Math.round(item.price * 100) * item.quantity, 0) / 100};
}
module.exports = {changeQuantity, totals};
