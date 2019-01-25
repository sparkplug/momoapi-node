import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

import { TokenRefresher } from "./auth";

import { Config, GlobalConfig, Subscription } from "./types";

export function createClient(
  config: Subscription & GlobalConfig,
  client: AxiosInstance = axios.create()
): AxiosInstance {
  client.defaults.baseURL = config.baseUrl;
  client.defaults.headers = {
    "Ocp-Apim-Subscription-Key": config.primaryKey,
    "X-Target-Environment": config.environment || "sandbox"
  };

  return client;
}

export function createAuthClient(
  refresh: TokenRefresher,
  client: AxiosInstance
): AxiosInstance {
  client.interceptors.request.use((request: AxiosRequestConfig) => {
    return refresh().then(({ accessToken }) => {
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
