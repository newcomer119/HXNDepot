import { useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { View, Text, ActivityIndicator, Platform } from "react-native";

export default function SSOCallback() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { setActive } = useSignIn();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (!isLoaded) return;

    const handleCallback = async () => {
      try {
        // For web, Clerk handles the callback automatically via URL parameters
        // For native, we need to handle it differently
        if (Platform.OS === "web") {
          // On web, Clerk should handle the callback automatically
          // Just wait a bit and check if user is signed in
          setTimeout(() => {
            if (isSignedIn) {
              router.replace("/(tabs)");
            } else {
              router.replace("/(auth)");
            }
          }, 1000);
        } else {
          // For native, extract session ID from params
          const sessionId = params.created_session_id as string;
          
          if (sessionId && setActive) {
            await setActive({ session: sessionId });
            router.replace("/(tabs)");
          } else if (isSignedIn) {
            // Already signed in
            router.replace("/(tabs)");
          } else {
            // No session ID, redirect to auth
            router.replace("/(auth)");
          }
        }
      } catch (error) {
        console.error("SSO callback error:", error);
        router.replace("/(auth)");
      }
    };

    handleCallback();
  }, [isLoaded, isSignedIn, params, setActive, router]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <ActivityIndicator size="large" color="#005a2b" />
      <Text style={{ marginTop: 16, color: "#666", fontSize: 16 }}>
        Completing sign in...
      </Text>
    </View>
  );
}
