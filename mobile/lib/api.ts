import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import { useEffect } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Get the local IP address from Expo constants (works for physical devices)
const getLocalIP = () => {
  // Expo provides the local IP in development
  const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
  if (debuggerHost) {
    return debuggerHost;
  }
  // Fallback: try to get from manifest
  const manifest = Constants.manifest2?.extra?.expoGo?.debuggerHost?.split(':')[0];
  if (manifest) {
    return manifest;
  }
  // Last resort: return null and use localhost (for simulator/emulator)
  return null;
};

// For Android emulator, use 10.0.2.2 instead of localhost
// For iOS simulator, use localhost
// For physical device, use your computer's IP address
const getApiUrl = () => {
  if (__DEV__) {
    // Development mode
    const localIP = getLocalIP();
    
    if (localIP && localIP !== 'localhost' && localIP !== '127.0.0.1') {
      // Physical device - use the computer's IP address
      return `http://${localIP}:3000/api`;
    }
    
    if (Platform.OS === "android") {
      // Android emulator uses 10.0.2.2 to access localhost
      return "http://10.0.2.2:3000/api";
    }
    // iOS simulator and web can use localhost
    return "http://localhost:3000/api";
  }
  // Production - update with your production URL
  return "https://your-hxn-depot-domain.com/api";
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useApi = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      const token = await getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    // cleanup: remove interceptor when component unmounts

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [getToken]);

  return api;
};

// on every single req, we would like have an auth token so that our backend knows that we're authenticated
// we're including the auth token under the auth headers
