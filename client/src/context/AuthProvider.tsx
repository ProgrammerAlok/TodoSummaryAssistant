import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../types/User";
import axiosInstance, { endpoints } from "../apis";

type AuthContextType = {
  user: User | null | undefined;
  signIn: (credentials: {
    email: string;
    password: string;
  }) => Promise<unknown>;
  signOut: () => Promise<unknown>;
  signUp: (credentials: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<unknown>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
});

type AuthProviderProps = PropsWithChildren;

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null | undefined>();

  const handleFetchUser = useCallback(async () => {
    try {
      const response = await axiosInstance.get(endpoints.auth.me);
      setUser(response.data);
    } catch (error) {
      console.error(error);
      setUser(null);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(endpoints.auth.signout);
      if (data.success) {
        setUser(null);
      }
      return data;
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, []);

  const signIn = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      try {
        const { data } = await axiosInstance.post(endpoints.auth.signin, {
          email,
          password,
        });
        console.log("Sign in response:", data.data);
        if (data?.success) {
          setUser(data.data);
          return data.data;
        }
      } catch (error) {
        console.error("Error signing in:", error);
        setUser(null);
      }
    },
    []
  );

  const signUp = useCallback(
    async (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      try {
        const response = await axiosInstance.post(endpoints.auth.signup, data);
        if (response.data.success) {
          return response.data;
        }
      } catch (error) {
        console.error("Error signing up:", error);
      }
    },
    []
  );

  useEffect(() => {
    if (!user) {
      handleFetchUser();
    }
  }, [handleFetchUser, user]);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
