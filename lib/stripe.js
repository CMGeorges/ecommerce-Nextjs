import {loadStripe} from '@stripe/stripe-js';

let stripe;

const loadStripeInstance = async () => {
    if (!stripe) {
        stripe = await loadStripe(process.env.STRIPE_PUBLIC_KEY);
    }
    return stripe;
}



export default loadStripeInstance;