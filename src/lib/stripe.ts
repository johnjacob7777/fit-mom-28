// ---------------------------------------------------------
// Stripe setup — handles payments
// ---------------------------------------------------------
import { loadStripe } from "@stripe/stripe-js";

// This loads Stripe on the browser side (public key is safe to expose)
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");
};
