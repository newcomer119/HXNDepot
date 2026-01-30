import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { hasCompletedOnboardingThisSession } from "@/lib/onboardingState";

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  if (isSignedIn) {
    return <Redirect href={"/(tabs)"} />;
  }

  // Always show onboarding before sign-in (per session; no persistence)
  if (!hasCompletedOnboardingThisSession()) {
    return <Redirect href="/onboarding" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
