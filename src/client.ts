import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

import { handleError } from "./errors";

import { TokenRefresher } from "./auth";
import { GlobalConfig, SubscriptionConfig } from "./common";

export function createClient(
  config: SubscriptionConfig & GlobalConfig,
  client: AxiosInstance = axios.create()
): AxiosInstance {
  client.defaults.baseURL = config.baseUrl;
  client.defaults.headers = {
    "Ocp-Apim-Subscription-Key": config.primaryKey,
    "X-Target-Environment": config.environment || "sandbox"
  };

  return withErrorHandling(client);
}

export function createAuthClient(
  refresh: TokenRefresher,
  client: AxiosInstance
): AxiosInstance {
  client.interceptors.request.use((request: AxiosRequestConfig) => {
    return refresh().then(accessToken => {
      return {
        ...request,
        headers: {
          ...request.headers,
          Authorization: `Bearer ${accessToken}`
        }
      };
    });
  });

  return client;
}

export function withErrorHandling(client: AxiosInstance): AxiosInstance {
  client.interceptors.response.use(
    response => response,
    error => Promise.reject(handleError(error))
  );

  return client;
}
