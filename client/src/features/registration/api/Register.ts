export const Register = async (
  email: string,
  password: string,
  username: string
) => {
  const serverUrl = import.meta.env.VITE_SERVER_API_URL;
  const res = await fetch(`${serverUrl}/api/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password, role_id: 1 }),
    credentials: "include",
  });
  return res;
};
