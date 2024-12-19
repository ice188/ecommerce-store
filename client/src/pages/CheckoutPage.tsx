import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../features/checkout/components/CheckoutForm";
import Header from "../features/navigation/components/Header";
import { useEffect, useState } from "react";
import { fetchClientSecret } from "../features/checkout/api/FetchClientSecret";
import LoadCycle from "../components/LoadCycle";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY as string);

const CheckoutPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState<string>("");
  const amount = sessionStorage.getItem("amount");
  const currency = sessionStorage.getItem("currency");

  useEffect(() => {
    if (amount && currency) {
      const loadClientSecret = async () => {
        const data = await fetchClientSecret(
          parseFloat(amount) * 100,
          currency
        );
        setClientSecret(data as string);
      };
      loadClientSecret();
    }
  }, [amount, currency]);

  return (
    <>
      <Header />
      {clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      ) : (
        <LoadCycle />
      )}
    </>
  );
};

export default CheckoutPage;
