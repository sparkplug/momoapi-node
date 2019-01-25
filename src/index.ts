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
  Subscription as SubscriptionConfig
} from "./types";

import Users from "./users";

interface MomoClient {
  Collections(productConfig: ProductConfig): Collections;
  Users(subscription: SubscriptionConfig): Users;
}

const defaultGlobalConfig: GlobalConfig = {
  baseUrl: "https://ericssonbasicapi2.azure-api.net",
  environment: "sandbox"
};

export = function(globalConfig: GlobalConfig = {}): MomoClient {
  return {
    Collections(productConfig: ProductConfig) {
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

    Users(subscriptionConfig: SubscriptionConfig) {
      const client: AxiosInstance = createClient({
        ...defaultGlobalConfig,
        ...globalConfig,
        ...subscriptionConfig
      });

      return new Users(client);
    }
  };
};
