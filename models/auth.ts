import { ReactNode } from "react";

export interface UserDetails {
    email: string
    password: string
}
export interface AuthContextProps {
    userLoggedIn: boolean;
    setUserLoggedIn: (loggedIn: boolean) => void;
    validateJWT: () => Promise<void>;
}
export type AuthProviderProps = {
    children: ReactNode;
};