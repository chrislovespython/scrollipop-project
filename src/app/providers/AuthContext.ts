// src/app/providers/AuthContext.ts
import { createContext } from "react";
import type { User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true 
});

export type { AuthContextType };