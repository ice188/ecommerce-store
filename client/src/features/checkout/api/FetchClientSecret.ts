export const fetchClientSecret = async (amount: number, currency: string) => {
  const serverUrl = import.meta.env.VITE_SERVER_API_URL;
  const res = await fetch(`${serverUrl}/api/payment/create-payment-intent`, {
    method: "POST",
    body: JSON.stringify({ amount: amount, currency: currency }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return data.clientSecret;
};
