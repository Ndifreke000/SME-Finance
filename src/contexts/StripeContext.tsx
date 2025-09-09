import React, { createContext, useContext, ReactNode } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

interface StripeContextType {
  stripe: Stripe | null;
  processPayment: (amount: number, description: string) => Promise<boolean>;
}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (context === undefined) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};

interface StripeProviderProps {
  children: ReactNode;
}

// Initialize Stripe with a test key (replace with your actual publishable key)
const stripePromise = loadStripe('pk_test_51234567890abcdef...');

export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  const [stripe, setStripe] = React.useState<Stripe | null>(null);

  React.useEffect(() => {
    stripePromise.then((stripeInstance) => {
      setStripe(stripeInstance);
    });
  }, []);

  const processPayment = async (amount: number, description: string): Promise<boolean> => {
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    try {
      // In a real application, you would call your backend to create a payment intent
      // For demo purposes, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        return true;
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return false;
    }
  };

  const value: StripeContextType = {
    stripe,
    processPayment,
  };

  return <StripeContext.Provider value={value}>{children}</StripeContext.Provider>;
};