import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import { useEffect } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Get the local IP address from Expo constants (works for physical devices)
const getLocalIP = () => {
  try {
    // Method 1: Check manifest2 (newer Expo versions)
    const manifest2 = Constants.manifest2;
    if (manifest2) {
      // Try debuggerHost first
      const debuggerHost = manifest2.extra?.expoGo?.debuggerHost;
      if (debuggerHost) {
        const ip = debuggerHost.split(':')[0];
        if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
          console.log("Found IP from manifest2.debuggerHost:", ip);
          return ip;
        }
      }
      
      // Try hostUri
      const hostUri = manifest2.hostUri;
      if (hostUri) {
        const ip = hostUri.split(':')[0];
        if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
          console.log("Found IP from manifest2.hostUri:", ip);
          return ip;
        }
      }
    }
    
    // Method 2: Check legacy manifest
    const manifest = Constants.manifest;
    if (manifest) {
      const hostUri = manifest.hostUri;
      if (hostUri) {
        const ip = hostUri.split(':')[0];
        if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
          console.log("Found IP from manifest.hostUri:", ip);
          return ip;
        }
      }
    }
    
    // Method 3: Check expoConfig
    const expoConfig = Constants.expoConfig;
    if (expoConfig?.hostUri) {
      const ip = expoConfig.hostUri.split(':')[0];
      if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
        console.log("Found IP from expoConfig.hostUri:", ip);
        return ip;
      }
    }
    
    // Method 4: Try to get from the connection (for physical devices)
    // When connected via QR code, Expo sets this
    const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.hostUri;
    if (debuggerHost) {
      const parts = debuggerHost.split(':');
      if (parts.length > 0) {
        const ip = parts[0];
        if (ip && ip !== 'localhost' && ip !== '127.0.0.1' && !ip.includes('.')) {
          // If it's not a valid IP format, skip it
        } else if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
          console.log("Found IP from debuggerHost:", ip);
          return ip;
        }
      }
    }
  } catch (error) {
    console.warn("Could not get local IP:", error);
  }
  
  console.warn("⚠️ Could not auto-detect IP address. You may need to set EXPO_PUBLIC_API_URL manually.");
  return null;
};

// Use the hosted website URL for API calls
const getApiUrl = () => {
  // Always use the hosted production URL
  const productionUrl = "https://www.hxnbuildingdepot.ca/api";
  
  // Check for environment variable for local development override
  if (process.env.EXPO_PUBLIC_API_URL && process.env.EXPO_PUBLIC_API_URL !== productionUrl) {
    console.log("Using API URL from environment:", process.env.EXPO_PUBLIC_API_URL);
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  console.log("✅ Using hosted API URL:", productionUrl);
  return productionUrl;
};

const API_URL = getApiUrl();
console.log("🌐 Final API URL:", API_URL);

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
