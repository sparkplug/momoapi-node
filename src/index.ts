export { Payment, PaymentRequest } from "./collections";
export { Transfer, TransferRequest } from "./disbursements";
export { Remit, RemittanceRequest } from "./remittances";

export * from "./errors";
export {
  PartyIdType as PayerType,
  Party as Payer,
  TransactionStatus as Status,
  Balance,
  Environment,
  FailureReason,
  GlobalConfig,
  ProductConfig
} from "./common";

import { AxiosInstance } from "axios";

import Collections from "./collections";
import Disbursements from "./disbursements";
import Remittances from "./remittances";
import Users from "./users";

import {
  authorizeCollections,
  authorizeDisbursements,
  authorizeRemittances,
  createTokenRefresher
} from "./auth";
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
} from "./common";

export interface MomoClient {
  Collections(productConfig: ProductConfig): Collections;
  Disbursements(productConfig: ProductConfig): Disbursements;
  Remittances(productConfig: ProductConfig): Remittances;
  Users(subscription: SubscriptionConfig): Users;
}

const defaultGlobalConfig: GlobalConfig = {
  baseUrl: "https://sandbox.momodeveloper.mtn.com",
  environment: Environment.SANDBOX
};

/**
 * Initialise the library
 *
 * @param globalConfig Global configuration required to use any product
 */
export function create(globalConfig: GlobalConfig): MomoClient {
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

    Disbursements(productConfig: ProductConfig): Disbursements {
      const config: Config = {
        ...defaultGlobalConfig,
        ...globalConfig,
        ...productConfig
      };

      const client: AxiosInstance = createAuthClient(
        createTokenRefresher(authorizeDisbursements, config),
        createClient(config)
      );

      return new Disbursements(client);
    },

    Remittances(productConfig: ProductConfig): Remittances {
      const config: Config = {
        ...defaultGlobalConfig,
        ...globalConfig,
        ...productConfig,
      };

      const client: AxiosInstance = createAuthClient(
        createTokenRefresher(authorizeRemittances, config),
        createClient(config)
      );

      return new Remittances(client);
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
}
