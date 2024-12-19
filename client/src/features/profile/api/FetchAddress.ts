import { Address } from "../types/Address";

export const FetchAddress = async (userId: string) => {
  const serverUrl = import.meta.env.VITE_SERVER_API_URL;
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${serverUrl}/api/user/${userId}/address`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },

  });

  if (res.status === 204) {
    return null;
  }

  const data = await res.json();
  const address: Address = {
    user_id: data.address.user_id,
    street: data.address.street,
    city: data.address.city,
    state: data.address.state,
    postal_code: data.address.postal_code,
    country: data.address.country,
  };
  return address;
};
