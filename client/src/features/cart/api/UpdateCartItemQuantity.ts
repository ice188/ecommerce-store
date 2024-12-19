export const updateCartItemQuantity = async (
  cartItemId: string,
  quantity: number
) => {
  const serverUrl = import.meta.env.VITE_SERVER_API_URL;
  const token = localStorage.getItem("token");

  const res = await fetch(`${serverUrl}/api/cart/item/${cartItemId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`, 
    },
    body: JSON.stringify({ quantity }),
  });
  return res;
};
