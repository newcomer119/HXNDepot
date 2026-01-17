import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import { useEffect } from "react";

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
  // Always call useAuth - ClerkProvider should always be present now
  // If Clerk key is missing, auth won't work but useAuth can still be called
  const { getToken } = useAuth();

  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      try {
        const token = await getToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // If token retrieval fails, continue without auth
        // This can happen if user is not signed in or Clerk key is invalid
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
