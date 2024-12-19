export const updateCartActive = async (cid: string, active: boolean) => {
  const serverUrl = import.meta.env.VITE_SERVER_API_URL;
  const token = localStorage.getItem("token");
  
  await fetch(`${serverUrl}/api/cart/status/${cid}`, {
    method: "PUT",
    body: JSON.stringify({ active }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
