export const updateUsername = async (userId: string, username: string) => {
  const serverUrl = import.meta.env.VITE_SERVER_API_URL;
  const token = localStorage.getItem("token");

  const res = await fetch(`${serverUrl}/api/user/${userId}/name`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username }),
  });
  return res;
};
