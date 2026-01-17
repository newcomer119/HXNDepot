import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert, Platform } from "react-native";
import * as Linking from "expo-linking";

function useSocialAuth() {
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    setLoadingStrategy(strategy);

    try {
      // For web, use redirect URL
      const redirectUrl = Platform.OS === "web" 
        ? `${Linking.createURL("/sso-callback")}`
        : undefined;

      const { createdSessionId, setActive } = await startSSOFlow({ 
        strategy,
        redirectUrl,
      });
      
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error: any) {
      console.log("💥 Error in social auth:", error);
      const provider = strategy === "oauth_google" ? "Google" : "Apple";
      
      // Don't show error if user cancelled
      if (error?.status !== "user_cancelled") {
        Alert.alert("Error", `Failed to sign in with ${provider}. Please try again.`);
      }
    } finally {
      setLoadingStrategy(null);
    }
  };

  return { loadingStrategy, handleSocialAuth };
}

export default useSocialAuth;
