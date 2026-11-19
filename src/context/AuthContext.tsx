"use client";
// ---------------------------------------------------------
// AuthContext — keeps track of the logged-in user across
// all pages. Supports both real Firebase and instant Demo Mode.
// ---------------------------------------------------------
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface UserData {
  email: string;
  displayName: string;
  quizCompleted: boolean;
  isPaid: boolean;
  quizAnswers?: Record<string, unknown>;
  plan?: Record<string, unknown>;
  progress?: {
    workoutsCompleted: Record<string, boolean>;
    waterIntake: Record<string, number>;
    weightLog: Record<string, number>;
  };
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  userData: UserData | null;
  loading: boolean;
  isDemoMode: boolean;
  refreshUserData: () => Promise<void>;
  updateUserDocument: (updates: Record<string, unknown>) => Promise<void>;
  startDemoSession: (name?: string, email?: string, directToDashboard?: boolean) => void;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isDemoMode: false,
  refreshUserData: async () => {},
  updateUserDocument: async () => {},
  startDemoSession: () => {},
  logoutUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Load demo data from localStorage if active
  const loadDemoFromStorage = (): boolean => {
    if (typeof window === "undefined") return false;
    const storedUser = localStorage.getItem("fitmom_demo_user");
    const storedData = localStorage.getItem("fitmom_demo_userdata");
    if (storedUser && storedData) {
      setUser(JSON.parse(storedUser));
      setUserData(JSON.parse(storedData));
      setIsDemoMode(true);
      setLoading(false);
      return true;
    }
    return false;
  };

  // Fetch from real Firestore
  const fetchFirestoreData = async (uid: string) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data() as UserData);
      } else {
        setUserData(null);
      }
    } catch (err) {
      console.warn("Could not fetch user from Firestore:", err);
    }
  };

  const refreshUserData = async () => {
    if (isDemoMode && typeof window !== "undefined") {
      const storedData = localStorage.getItem("fitmom_demo_userdata");
      if (storedData) setUserData(JSON.parse(storedData));
    } else if (user) {
      await fetchFirestoreData(user.uid);
    }
  };

  const updateUserDocument = async (updates: Record<string, unknown>) => {
    if (isDemoMode || !user || user.uid.startsWith("demo_")) {
      // Local storage persistence
      const current = userData || {
        email: user?.email || "mom@fitmom20.demo",
        displayName: user?.displayName || "Fit Mom",
        quizCompleted: false,
        isPaid: false,
        progress: { workoutsCompleted: {}, waterIntake: {}, weightLog: {} },
      };

      // Deep merge helper for nested keys like "progress.workoutsCompleted.2024-01-01"
      const updated = { ...current };
      for (const [key, value] of Object.entries(updates)) {
        if (key.includes(".")) {
          const parts = key.split(".");
          let target: any = updated;
          for (let i = 0; i < parts.length - 1; i++) {
            if (!target[parts[i]]) target[parts[i]] = {};
            target = target[parts[i]];
          }
          target[parts[parts.length - 1]] = value;
        } else {
          (updated as any)[key] = value;
        }
      }

      setUserData(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("fitmom_demo_userdata", JSON.stringify(updated));
      }
      return;
    }

    // Firestore update
    try {
      await updateDoc(doc(db, "users", user.uid), updates);
      await fetchFirestoreData(user.uid);
    } catch (err) {
      console.error("Firestore update error:", err);
      // Fallback to local state if Firestore update fails
      const fallback = { ...(userData || {}), ...updates } as UserData;
      setUserData(fallback);
    }
  };

  const startDemoSession = (name = "Mama", email = "mom@example.com", directToDashboard = false) => {
    const demoUserObj: AppUser = {
      uid: "demo_user_" + Date.now(),
      email,
      displayName: name,
    };
    const demoDataObj: UserData = {
      email,
      displayName: name,
      quizCompleted: directToDashboard,
      isPaid: directToDashboard,
      progress: {
        workoutsCompleted: {},
        waterIntake: {},
        weightLog: {},
      },
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("fitmom_demo_user", JSON.stringify(demoUserObj));
      localStorage.setItem("fitmom_demo_userdata", JSON.stringify(demoDataObj));
    }

    setUser(demoUserObj);
    setUserData(demoDataObj);
    setIsDemoMode(true);
    setLoading(false);
  };

  const logoutUser = async () => {
    if (isDemoMode) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("fitmom_demo_user");
        localStorage.removeItem("fitmom_demo_userdata");
      }
      setUser(null);
      setUserData(null);
      setIsDemoMode(false);
    } else {
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        console.warn("Sign out error:", err);
      }
      setUser(null);
      setUserData(null);
    }
  };

  useEffect(() => {
    // Check if there is an active demo session first
    if (loadDemoFromStorage()) {
      return;
    }

    // Otherwise connect to Firebase Auth
    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          });
          await fetchFirestoreData(firebaseUser.uid);
        } else {
          setUser(null);
          setUserData(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn("Firebase Auth listener initialized in offline/build mode:", err);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        isDemoMode,
        refreshUserData,
        updateUserDocument,
        startDemoSession,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
