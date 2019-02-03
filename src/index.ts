import { AxiosInstance } from "axios";

import Collections from "./collections";

import { authorizeCollections, createTokenRefresher } from "./auth";
import { createAuthClient, createClient } from "./client";
import {
  validateGlobalConfig,
  validateProductConfig,
  validateSubscriptionConfig
} from "./validate";

import {
  Config,
  Environment,
  GlobalConfig,
  ProductConfig,
  SubscriptionConfig
} from "./types";

import Users from "./users";

interface MomoClient {
  Collections(productConfig: ProductConfig): Collections;
  Users(subscription: SubscriptionConfig): Users;
}

const defaultGlobalConfig: GlobalConfig = {
  baseUrl: "https://ericssonbasicapi2.azure-api.net",
  environment: Environment.sandbox
};

export = (globalConfig: GlobalConfig): MomoClient => {
  validateGlobalConfig(globalConfig);

  return {
    Collections(productConfig: ProductConfig): Collections {
      validateProductConfig(productConfig);

      const config: Config = {
        ...defaultGlobalConfig,
        ...globalConfig,
        ...productConfig
      };

      const client: AxiosInstance = createAuthClient(
        createTokenRefresher(authorizeCollections, config),
        createClient(config)
      );

      return new Collections(client);
    },

    Users(subscriptionConfig: SubscriptionConfig): Users {
      validateSubscriptionConfig(subscriptionConfig);

      const config: GlobalConfig & SubscriptionConfig = {
        ...defaultGlobalConfig,
        ...globalConfig,
        ...subscriptionConfig
      };

      const client: AxiosInstance = createClient(config);

      return new Users(client);
    }
  };
};
