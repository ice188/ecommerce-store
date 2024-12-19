export const sendCode = async (email: string, code: string) => {
  const serverUrl = import.meta.env.VITE_SERVER_API_URL;
  const res = await fetch(`${serverUrl}/api/user/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code }),
    credentials: "include",
  });
  return res;
};
