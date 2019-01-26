import { AxiosInstance } from "axios";

import Collections from "./collections";

import {
  authorizeCollections,
  createTokenRefresher,
  TokenRefresher
} from "./auth";
import { createAuthClient, createClient } from "./client";

import {
  Config,
  GlobalConfig,
  ProductConfig,
  SubscriptionConfig
} from "./types";

import Users from "./users";

type MomoClientCreator = (config?: GlobalConfig) => MomoClient;

interface MomoClient {
  Collections(productConfig: ProductConfig): Collections;
  Users(subscription: SubscriptionConfig): Users;
}

const defaultGlobalConfig: GlobalConfig = {
  baseUrl: "https://ericssonbasicapi2.azure-api.net",
  environment: "sandbox"
};

const createMomoClient: MomoClientCreator = (
  globalConfig: GlobalConfig = {}
): MomoClient => ({
  Collections(productConfig: ProductConfig): Collections {
    const config: Config = {
      ...defaultGlobalConfig,
      ...globalConfig,
      ...productConfig
    };
    const refresh: TokenRefresher = createTokenRefresher(
      authorizeCollections,
      config
    );
    const client: AxiosInstance = createAuthClient(
      refresh,
      createClient(config)
    );

    return new Collections(client);
  },

  Users(subscriptionConfig: SubscriptionConfig): Users {
    const client: AxiosInstance = createClient({
      ...defaultGlobalConfig,
      ...globalConfig,
      ...subscriptionConfig
    });

    return new Users(client);
  }
});

export = createMomoClient;
