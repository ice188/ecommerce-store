export const deleteOrder = async (oid: string) => {
  const serverUrl = import.meta.env.VITE_SERVER_API_URL;
  const token = localStorage.getItem('token');

  await fetch(`${serverUrl}/api/order/${oid}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
