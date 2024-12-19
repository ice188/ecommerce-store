export const addCartItem = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const serverUrl = import.meta.env.VITE_SERVER_API_URL;
  const token = localStorage.getItem("token");

  const res = await fetch(`${serverUrl}/api/cart/${userId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`, 
    },
    body: JSON.stringify({ product_id: productId, quantity }),
  });
  return res;
};
