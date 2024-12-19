import { User } from "./User";

export interface LoginStatusResponse {
  isLoggedIn: boolean;
  user: User | null;
}
