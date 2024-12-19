export const FetchCartId = async (id: string) => {
  const serverUrl = import.meta.env.VITE_SERVER_API_URL;
  const token = localStorage.getItem("token");

  const res = await fetch(`${serverUrl}/api/cart/${id}/cid`, {
    method: "GET",
    credentials: "include",
    headers: {
      'Authorization': `Bearer ${token}`, 
    },
  });
  const data = await res.json();
  return data.cid;
};
