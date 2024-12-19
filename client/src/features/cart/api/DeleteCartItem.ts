export const deleteCardItem = async (cartItemId: string) => {
  const serverUrl = import.meta.env.VITE_SERVER_API_URL;
  const token = localStorage.getItem("token");

  const res = await fetch(`${serverUrl}/api/cart/item/${cartItemId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};
