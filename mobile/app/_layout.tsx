import { Stack } from "expo-router";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import Constants from "expo-constants";
import { Text, View } from "react-native";
import { Component, ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes (formerly cacheTime)
    },
  },
});

// Get Clerk publishable key from environment
const clerkPublishableKey = 
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  Constants.expoConfig?.extra?.clerkPublishableKey ||
  null;

// Simple Error Boundary
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#EF4444" }}>
            Something went wrong
          </Text>
          <Text style={{ fontSize: 14, color: "#666", marginBottom: 10, textAlign: "center" }}>
            {this.state.error?.message || "An unexpected error occurred"}
          </Text>
          <Text style={{ fontSize: 12, color: "#999", marginTop: 20, textAlign: "center" }}>
            Check the console for more details
          </Text>
          <Text style={{ fontSize: 10, color: "#ccc", marginTop: 10, textAlign: "center" }}>
            API URL: {process.env.EXPO_PUBLIC_API_URL || "https://www.hxnbuildingdepot.ca/api"}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function RootLayout() {
  console.log("App initializing...");
  console.log("Clerk Key:", clerkPublishableKey ? "Set" : "Missing - App may not work");
  console.log("API URL from env:", process.env.EXPO_PUBLIC_API_URL || "https://www.hxnbuildingdepot.ca/api");
  
  // Always wrap with ClerkProvider, even if key is missing
  // This ensures useAuth can be called safely, but auth won't work without a key
  // Use a dummy key if none is provided to prevent errors
  const safeClerkKey = clerkPublishableKey || "pk_test_dummy_key_for_development";
  
  if (!clerkPublishableKey) {
    console.warn("⚠️ Clerk publishable key is missing! Authentication will not work.");
    console.warn("Set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file");
  }
  
  return (
    <ErrorBoundary>
      <ClerkProvider 
        publishableKey={safeClerkKey}
        tokenCache={tokenCache}
        afterSignInUrl="/(tabs)"
        afterSignUpUrl="/(tabs)"
      >
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }} />
        </QueryClientProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}
