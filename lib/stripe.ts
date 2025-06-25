import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export { stripePromise };

// Stripe configuration for subscription plans
export const STRIPE_PLANS = {
  starter: {
    priceId: 'price_starter_monthly',
    amount: 1000, // $10.00
    name: 'Starter',
    features: ['5 Apps', 'Basic AI Features', 'Community Support']
  },
  pro: {
    priceId: 'price_pro_monthly',
    amount: 2500, // $25.00
    name: 'Pro',
    features: ['25 Apps', 'Advanced AI Features', 'Priority Support', 'Custom Domains']
  },
  enterprise: {
    priceId: 'price_enterprise_monthly',
    amount: 5000, // $50.00
    name: 'Enterprise',
    features: ['Unlimited Apps', 'Full AI Suite', '24/7 Support', 'White-label Options']
  }
};

export async function createCheckoutSession(priceId: string, userId: string) {
  // This would integrate with your backend to create a Stripe checkout session
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      priceId,
      userId,
    }),
  });

  return response.json();
}