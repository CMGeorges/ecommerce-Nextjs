import {createCheckout} from '../../server/checkout';
import {findProducts} from '../../server/catalog';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({error: 'Method Not Allowed'});
  }
  if (!process.env.STRIPE_SECRET_KEY || !process.env.APP_BASE_URL) {
    return res.status(503).json({error: 'Paiements désactivés : configurez Stripe et APP_BASE_URL.'});
  }
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const session = await createCheckout({items: req.body, key: req.headers['idempotency-key'],
      origin: req.headers.origin, baseUrl: process.env.APP_BASE_URL, findProducts, stripe});
    return res.status(200).json({id: session.id, url: session.url});
  } catch (error) {
    if (!error.status) console.error('Checkout failed', error.type || error.name);
    return res.status(error.status || 502).json({error: error.status ? error.message : 'Paiement indisponible. Réessayez.'});
  }
}
