import { createContext, ReactNode, useContext, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User } from "@shared/schema";

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

interface AuthResponse {
  id: number;
  username: string;
  email: string;
  fullName: string | null;
  accountType: string | null;
  projectsLimit: number | null;
  storage: number | null;
  avatarUrl: string | null;
  isActive: boolean | null;
  createdAt: string;
  isGuest?: boolean;
}

type AuthContextType = {
  user: AuthResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  
  loginMutation: UseMutationResult<AuthResponse, Error, LoginCredentials>;
  registerMutation: UseMutationResult<AuthResponse, Error, RegisterCredentials>;
  logoutMutation: UseMutationResult<void, Error, void>;
  guestLoginMutation: UseMutationResult<AuthResponse, Error, void>;
  
  isAuthenticated: boolean;
  isGuest: boolean;
  isPremium: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch the current user if they're logged in
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<AuthResponse, Error>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/user");
        if (!response.ok) {
          if (response.status === 401) {
            return null;
          }
          throw new Error("Failed to get user data");
        }
        return await response.json();
      } catch (error) {
        console.error("Error fetching user:", error);
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Login mutation
  const loginMutation = useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const response = await apiRequest("POST", "/api/login", credentials);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.username}!`,
      });
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation<AuthResponse, Error, RegisterCredentials>({
    mutationFn: async (credentials) => {
      const response = await apiRequest("POST", "/api/register", credentials);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
      }
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/logout");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Logout failed");
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      // Also invalidate any user-specific data
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Guest login mutation (for temporary access)
  const guestLoginMutation = useMutation<AuthResponse, Error, void>({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/guest");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Guest login failed");
      }
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
      toast({
        title: "Welcome, Guest!",
        description: "You're now using LaunchPlate in guest mode. Your work will be saved temporarily.",
      });
    },
    onError: (error) => {
      toast({
        title: "Guest login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Computed properties
  const isAuthenticated = !!user;
  const isGuest = !!user?.isGuest;
  const isPremium = isAuthenticated && user?.accountType !== "free" && user?.accountType !== "guest";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isError,
        error,
        loginMutation,
        registerMutation,
        logoutMutation,
        guestLoginMutation,
        isAuthenticated,
        isGuest,
        isPremium,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}