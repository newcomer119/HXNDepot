import useSocialAuth from "@/hooks/useSocialAuth";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useAuth, useSignIn, useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import { TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "@/components/SafeScreen";

const AuthScreen = () => {
  const { loadingStrategy, handleSocialAuth } = useSocialAuth();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { signUp } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleEmailAuth = async () => {
    if (!isLoaded) return;
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (isSignUp) {
        if (!signUp) {
          setError("Sign up is not available");
          setIsLoading(false);
          return;
        }
        // Sign up
        const result = await signUp.create({
          emailAddress: email,
          password: password,
        });
        
        // Send email verification code
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        
        // For now, we'll just sign them in after signup
        // In production, you'd want to verify email first
        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
        }
      } else {
        // Sign in
        const result = await signIn.create({
          identifier: email,
          password: password,
        });
        
        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
        }
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6 py-8 bg-background">
            {/* HXN LOGO/BRANDING */}
            <View className="items-center mb-8">
              <Text className="text-primary text-3xl font-black tracking-tight mb-2 text-center">
                HXN BUILDING DEPOT
              </Text>
              <Text className="text-text-secondary text-xs italic tracking-widest text-center">
                Premium Surfaces & Fixtures
              </Text>
            </View>

            {/* DEMO IMAGE */}
            <View className="items-center mb-6">
              <Image
                source={require("../../assets/images/auth-image.png")}
                className="w-64 h-64"
                resizeMode="contain"
              />
            </View>

            {/* EMAIL/PASSWORD FORM */}
            <View className="mb-6">
              <View className="mb-4">
                <Text className="text-text-primary font-semibold text-sm mb-2">Email</Text>
                <View className="bg-surface-light border border-surface-dark rounded-xl px-4 py-3 flex-row items-center">
                  <Ionicons name="mail-outline" size={20} color="#005a2b" />
                  <TextInput
                    className="flex-1 ml-3 text-text-primary text-base"
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setError("");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-text-primary font-semibold text-sm mb-2">Password</Text>
                <View className="bg-surface-light border border-surface-dark rounded-xl px-4 py-3 flex-row items-center">
                  <Ionicons name="lock-closed-outline" size={20} color="#005a2b" />
                  <TextInput
                    className="flex-1 ml-3 text-text-primary text-base"
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setError("");
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete={isSignUp ? "password-new" : "password"}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="ml-2"
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#005a2b"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {error ? (
                <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
                  <Text className="text-red-600 text-sm">{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                className="bg-primary rounded-xl px-6 py-4 items-center mb-4"
                onPress={handleEmailAuth}
                disabled={isLoading || loadingStrategy !== null}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    {isSignUp ? "Sign Up" : "Sign In"}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
                className="items-center"
              >
                <Text className="text-text-secondary text-sm">
                  {isSignUp ? "Already have an account? " : "Don't have an account? "}
                  <Text className="text-primary font-semibold">
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* DIVIDER */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-surface-dark" />
              <Text className="mx-4 text-text-secondary text-sm">OR</Text>
              <View className="flex-1 h-px bg-surface-dark" />
            </View>

            {/* SOCIAL AUTH BUTTONS */}
            <View className="gap-3 mb-6">
              {/* GOOGLE SIGN IN BTN */}
              <TouchableOpacity
                className="flex-row items-center justify-center bg-white border-2 rounded-xl px-6 py-4"
                onPress={() => handleSocialAuth("oauth_google")}
                disabled={loadingStrategy !== null || isLoading}
                style={{
                  borderColor: "#005a2b",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
                activeOpacity={0.7}
              >
                {loadingStrategy === "oauth_google" ? (
                  <ActivityIndicator size={"small"} color={"#005a2b"} />
                ) : (
                  <View className="flex-row items-center">
                    <Image
                      source={require("../../assets/images/google.png")}
                      className="w-5 h-5 mr-3"
                      resizeMode="contain"
                    />
                    <Text className="text-primary font-bold text-base">Continue with Google</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* APPLE SIGN IN BTN */}
              {Platform.OS === "ios" && (
                <TouchableOpacity
                  className="flex-row items-center justify-center bg-white border-2 rounded-xl px-6 py-4"
                  onPress={() => handleSocialAuth("oauth_apple")}
                  disabled={loadingStrategy !== null || isLoading}
                  style={{
                    borderColor: "#005a2b",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                  activeOpacity={0.7}
                >
                  {loadingStrategy === "oauth_apple" ? (
                    <ActivityIndicator size={"small"} color={"#005a2b"} />
                  ) : (
                    <View className="flex-row items-center">
                      <Image
                        source={require("../../assets/images/apple.png")}
                        className="w-5 h-5 mr-3"
                        resizeMode="contain"
                      />
                      <Text className="text-primary font-bold text-base">Continue with Apple</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* TERMS */}
            <Text className="text-center text-text-secondary text-xs leading-4 px-4">
              By signing up, you agree to our{" "}
              <Text className="text-primary font-semibold">Terms</Text>
              {", "}
              <Text className="text-primary font-semibold">Privacy Policy</Text>
              {", and "}
              <Text className="text-primary font-semibold">Cookie Use</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
};

export default AuthScreen;
