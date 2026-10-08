function invalid(message) { throw Object.assign(new Error(message), {status: 400}); }
async function createCheckout({items, key, origin, baseUrl, findProducts, stripe}) {
  if (!Array.isArray(items) || !items.length || items.length > 50) invalid('Panier invalide.');
  if (typeof key !== 'string' || !/^[a-f0-9-]{36}$/i.test(key)) invalid('Clé de paiement invalide.');
  const base = new URL(baseUrl);
  if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password) invalid('URL de boutique invalide.');
  if (origin && origin !== base.origin) throw Object.assign(new Error('Origine refusée.'), {status: 403});
  const quantities = new Map();
  for (const item of items) {
    if (!item || typeof item._id !== 'string' || !/^[\w.-]{1,128}$/.test(item._id)
        || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) invalid('Produit ou quantité invalide.');
    const quantity = (quantities.get(item._id) || 0) + item.quantity;
    if (quantity > 99) invalid('Quantité maximale : 99.');
    quantities.set(item._id, quantity);
  }
  const products = await findProducts([...quantities.keys()]);
  const lines = [...quantities].map(([id, quantity]) => {
    const product = products.find(p => p._id === id);
    if (!product) invalid('Produit indisponible.');
    // Catalog prices only. Never use prices, names, or images submitted by a browser.
    if (typeof product.price !== 'number' || !Number.isFinite(product.price) || product.price <= 0
        || product.price > 100000 || Math.abs(product.price * 100 - Math.round(product.price * 100)) > 1e-7) invalid('Prix du catalogue invalide.');
    return {quantity, price_data: {currency: 'cad', unit_amount: Math.round(product.price * 100),
      product_data: {name: String(product.name).slice(0, 120)}}};
  });
  return stripe.checkout.sessions.create({mode: 'payment', payment_method_types: ['card'],
    line_items: lines,
    success_url: `${base.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base.origin}/?canceled=true`}, {idempotencyKey: `checkout:${key}`});
}
module.exports = {createCheckout};
