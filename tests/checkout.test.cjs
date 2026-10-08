const {test} = require('node:test');
const assert = require('node:assert/strict');
const {createCheckout} = require('../server/checkout');
function setup(overrides = {}) {
  const calls = [];
  const args = {items: [{_id: 'one', quantity: 2, price: .01, name: 'FAKE'}],
    key: '12345678-1234-1234-1234-123456789abc', origin: 'https://shop.example',
    baseUrl: 'https://shop.example', findProducts: async () => [{_id: 'one', name: 'Real', price: 19.99}],
    stripe: {checkout: {sessions: {create: async (...params) => {calls.push(params); return {id: 'cs_test_example'};}}}},
    ...overrides};
  return {args, calls};
}
test('uses catalog price and configured callback origin', async () => {
  const {args, calls} = setup();
  await createCheckout(args);
  assert.equal(calls[0][0].line_items[0].price_data.unit_amount, 1999);
  assert.equal(calls[0][0].line_items[0].price_data.product_data.name, 'Real');
  assert.equal(calls[0][0].success_url, 'https://shop.example/success?session_id={CHECKOUT_SESSION_ID}');
  assert.match(calls[0][1].idempotencyKey, /^checkout:/);
});
for (const quantity of [0, -1, .5, 100, '2', NaN]) {
  test(`rejects invalid quantity ${quantity}`, async () => {
    const {args, calls} = setup({items: [{_id: 'one', quantity}]});
    await assert.rejects(createCheckout(args), /quantité/); assert.equal(calls.length, 0);
  });
}
test('combines duplicates and prevents exceeding limit', async () => {
  const {args, calls} = setup({items: [{_id: 'one', quantity: 50}, {_id: 'one', quantity: 49}]});
  await createCheckout(args); assert.equal(calls[0][0].line_items[0].quantity, 99);
  args.items[1].quantity = 50;
  await assert.rejects(createCheckout(args), /maximale/);
});
test('unknown products fail before Stripe call', async () => {
  const {args, calls} = setup({findProducts: async () => []});
  await assert.rejects(createCheckout(args), /indisponible/); assert.equal(calls.length, 0);
});
test('refuses foreign origin', async () => {
  const {args, calls} = setup({origin: 'https://evil.example'});
  await assert.rejects(createCheckout(args), /Origine/); assert.equal(calls.length, 0);
});
const {changeQuantity, totals} = require('../server/cart');
test('cart cannot decrement below one or mutate original items', () => {
  const original = [{_id: 'one', quantity: 1, price: .1}];
  assert.equal(changeQuantity(original, 'one', -1)[0].quantity, 1);
  assert.equal(changeQuantity(original, 'one', 1)[0].quantity, 2);
  assert.equal(original[0].quantity, 1);
  assert.deepEqual(totals([{_id: 'one', quantity: 3, price: .1}]), {totalPrice: .3, totalQuantity: 3});
});
