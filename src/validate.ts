import { strictEqual } from "assert";
import {
  Environment,
  GlobalConfig,
  PaymentRequest,
  ProductConfig,
  SubscriptionConfig,
  UserConfig
} from "./types";

export function validateRequestToPay(paymentRequest: PaymentRequest) {
  const {
    amount,
    currency,
    callbackUrl,
    externalId,
    payer,
    payeeNote,
    payerMessage
  }: PaymentRequest = paymentRequest;
}

export function validateGlobalConfig(config: GlobalConfig): void {
  const { callbackHost, baseUrl, environment } = config;
  strictEqual(isTruthy(callbackHost), true, "callbackHost is required");

  if (environment && environment !== Environment.sandbox) {
    strictEqual(
      isValidEnvironment(environment),
      true,
      "environment must be either sandbox or production"
    );
    strictEqual(
      isTruthy(baseUrl),
      true,
      "baseUrl is required if environment is not sandbox"
    );
    strictEqual(isString(baseUrl), true, "baseUrl must be a string");
  }
}

export function validateProductConfig(config: ProductConfig): void {
  validateSubscriptionConfig(config);
  validateUserConfig(config);
}

export function validateSubscriptionConfig(config: SubscriptionConfig): void {
  const { primaryKey } = config;
  strictEqual(isTruthy(primaryKey), true, "primaryKey is required");
  strictEqual(isString(primaryKey), true, "primaryKey must be a string");
}

export function validateUserConfig({ userId, userSecret }: UserConfig): void {
  strictEqual(isTruthy(userId), true, "userId is required");
  strictEqual(isString(userId), true, "userId must be a string");

  strictEqual(isTruthy(userSecret), true, "userSecret is required");
  strictEqual(isString(userSecret), true, "userSecret must be a string");

  strictEqual(isUuid4(userId), true, "userId must be a valid uuid v4");
}

function isNumeric(value: any): boolean {
  return !isNaN(parseInt(value, 10));
}

function isTruthy(value: any): boolean {
  return !!value;
}

function isString(value: any): boolean {
  return typeof value === "string";
}

function isUuid4(value: string): boolean {
  return /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
    value
  );
}

function isValidEnvironment(value: string): boolean {
  return isTruthy(Environment[value as Environment]);
}
