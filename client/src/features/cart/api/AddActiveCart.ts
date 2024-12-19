export const addActiveCart = async (id: string) => {
  const serverUrl = import.meta.env.VITE_SERVER_API_URL;
  const res = await fetch(`${serverUrl}/api/cart/new/${id}`, {
    method: "POST",
    credentials: "include",
  });
  return res;
};
