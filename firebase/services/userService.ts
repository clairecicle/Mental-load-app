import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "@/firebase/config";
import { User } from "firebase/auth";

export interface FirestoreUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function createOrFetchUser(firebaseUser: User): Promise<FirestoreUser> {
  const userRef = doc(db, "users", firebaseUser.uid);
  
  try {
    // Try to get existing user
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      // User exists, return the data
      const userData = userSnap.data() as FirestoreUser;
      console.log("User found:", userData);
      return userData;
    } else {
      // User doesn't exist, create new user
      const newUser: FirestoreUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName: firebaseUser.displayName || "",
        photoURL: firebaseUser.photoURL || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await setDoc(userRef, newUser);
      console.log("New user created:", newUser);
      return newUser;
    }
  } catch (error) {
    console.error("Error creating/fetching user:", error);
    throw error;
  }
}

export async function getUserById(uid: string): Promise<FirestoreUser | null> {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as FirestoreUser;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
} 