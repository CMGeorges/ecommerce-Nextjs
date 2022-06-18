import {loadStripe} from '@stripe/stripe-js';

let stripe;

const loadStripeInstance = async () => {
    if (!stripe) {
        console.log('Loading stripe...');

        stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY).then((_stripe) => {
            console.log('Stripe loaded');
            return _stripe;});
    }
    return stripe;
}



export default loadStripeInstance;