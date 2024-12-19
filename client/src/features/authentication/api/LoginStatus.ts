import { LoginStatusResponse } from "../types/LoginStatusResponse";
import { User } from "../types/User";

export const LoginStatus = async (): Promise<LoginStatusResponse> => {
  const serverUrl = import.meta.env.VITE_SERVER_API_URL;
  const token = localStorage.getItem('token');
  if (!token) {
    return { user: null, isLoggedIn: false }; 
  }

  const res = await fetch(`${serverUrl}/api/user/auth/status`, {
    method: "GET",
    credentials: "include",
    headers: {
      'Authorization': `Bearer ${token}`, 
    },
  });
  const data = await res.json();
  const user: User | null = data.isLoggedIn
    ? {
        user_id: data.user.user_id,
        username: data.user.username,
        email: data.user.email,
        role_id: data.user.role_id,
      }
    : null;
  return { isLoggedIn: data.isLoggedIn, user: user };
};
