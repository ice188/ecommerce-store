import { User } from "./User";

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}
export const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
};
