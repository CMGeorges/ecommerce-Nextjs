import {useEffect, useRef} from 'react';
import Link from 'next/link';
import {useStateContext} from '../context/StateContext';

export default function Success({paid}) {
  const {setCartItems, loaded} = useStateContext();
  const cleared = useRef(false);
  useEffect(() => {
    if (paid && loaded && !cleared.current) {
      cleared.current = true;
      setCartItems([]);
    }
  }, [paid, setCartItems, loaded]);
  return <div className="success-wrapper"><div className="success">
    <h2>{paid ? 'Paiement confirmé par Stripe.' : 'Paiement non confirmé.'}</h2>
    <p>{paid ? 'Votre paiement a été accepté.' : 'Votre panier est conservé. Réessayez ou contactez la boutique.'}</p>
    <Link href="/">Retour à la boutique</Link>
  </div></div>;
}
export async function getServerSideProps({query, res}) {
  res.setHeader('Cache-Control', 'private, no-store');
  const id = query.session_id;
  if (typeof id !== 'string' || !/^cs_(test_|live_)?[A-Za-z0-9]+$/.test(id) || !process.env.STRIPE_SECRET_KEY) {
    return {props: {paid: false}};
  }
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(id);
    return {props: {paid: session.payment_status === 'paid' && session.mode === 'payment'}};
  } catch { return {props: {paid: false}}; }
}
