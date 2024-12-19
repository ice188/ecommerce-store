export const changeOrderStatus = async (cid: string, status: string) => {
  const serverUrl = import.meta.env.VITE_SERVER_API_URL;
  const token = localStorage.getItem('token');

  const res = await fetch(`${serverUrl}/api/order/${cid}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`, 
    },
    body: JSON.stringify({ status }),
  });
  return res;
};
