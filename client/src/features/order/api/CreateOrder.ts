/* eslint-disable @typescript-eslint/no-unused-vars */
export const createOrder = async (
  id: string,
  cart_id: string,
  amount: number,
  currency: string
) => {
  const serverUrl = import.meta.env.VITE_SERVER_API_URL;
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${serverUrl}/api/order/${id}`, {
    method: "POST",
    body: JSON.stringify({ cart_id, amount }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });
};
