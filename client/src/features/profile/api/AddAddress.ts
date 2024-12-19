export const addAddress = async (
  userId: string,
  country: string,
  state: string,
  city: string,
  street: string,
  postal: string
) => {
  const serverUrl = import.meta.env.VITE_SERVER_API_URL;
  const token = localStorage.getItem("token");

  const res = await fetch(`${serverUrl}/api/user/${userId}/address`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ country, state, city, street, postal }),
  });
  return res;
};
