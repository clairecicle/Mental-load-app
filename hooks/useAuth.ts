"use client"

import { useState, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import { FirestoreUser, getUserById } from "@/firebase/services/userService";

export interface AuthState {
  user: User | null;
  firestoreUser: FirestoreUser | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    firestoreUser: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          try {
            // Fetch user data from Firestore
            const firestoreUser = await getUserById(user.uid);
            setAuthState({
              user,
              firestoreUser,
              loading: false,
              error: null,
            });
          } catch (error) {
            console.error("Error fetching user data:", error);
            setAuthState({
              user,
              firestoreUser: null,
              loading: false,
              error: "Failed to fetch user data",
            });
          }
        } else {
          setAuthState({
            user: null,
            firestoreUser: null,
            loading: false,
            error: null,
          });
        }
      },
      (error) => {
        console.error("Auth state change error:", error);
        setAuthState({
          user: null,
          firestoreUser: null,
          loading: false,
          error: error.message,
        });
      }
    );

    return () => unsubscribe();
  }, []);

  return authState;
} 