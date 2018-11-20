import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

import { Config } from ".";

import getTokenRefresher, { Authenticator, TokenRefresher } from "./oauth";
import { Subscription } from "./users";

export function createBasicClient(config: Subscription): AxiosInstance {
  const baseURL = "https://ericssonbasicapi2.azure-api.net";
  return axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": config.subscriptionKey
    }
  });
}

export function createOAuthClient(
  config: Config,
  authenticator: Authenticator
): AxiosInstance {
  const instance = createBasicClient(config);
  const refresh: TokenRefresher = getTokenRefresher(authenticator, config);

  instance.interceptors.request.use((request: AxiosRequestConfig) => {
    return refresh().then(({ accessToken }) => {
      return {
        ...request,
        headers: {
          ...request.headers,
          Authorization: `Bearer ${accessToken}`,
          "X-Target-Environment": "sandbox"
        }
      };
    });
  });

  return instance;
}
