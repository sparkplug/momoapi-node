import { strictEqual } from "assert";

import { PaymentRequest } from "./collections";
import {
  Environment,
  GlobalConfig,
  ProductConfig,
  SubscriptionConfig,
  UserConfig
} from "./common";
import { TransferRequest } from "./disbursements";

export function validateRequestToPay(
  paymentRequest: PaymentRequest
): Promise<void> {
  const { amount, currency, payer }: PaymentRequest = paymentRequest || {};
  return Promise.resolve().then(() => {
    strictEqual(isTruthy(amount), true, "amount is required");
    strictEqual(isNumeric(amount), true, "amount must be a number");
    strictEqual(isTruthy(currency), true, "currency is required");
    strictEqual(isTruthy(payer), true, "payer is required");
    strictEqual(isTruthy(payer.partyId), true, "payer.partyId is required");
    strictEqual(
      isTruthy(payer.partyIdType),
      true,
      "payer.partyIdType is required"
    );
    strictEqual(isString(currency), true, "amount must be a string");
  });
}

export function validateTransfer(
  payoutRequest: TransferRequest
): Promise<void> {
  const { amount, currency, payee, referenceId }: TransferRequest = payoutRequest || {};
  return Promise.resolve().then(() => {
    strictEqual(isTruthy(referenceId), true, "referenceId is required");
    strictEqual(isUuid4(referenceId as string), true, "referenceId must be a valid uuid v4");
    strictEqual(isTruthy(amount), true, "amount is required");
    strictEqual(isNumeric(amount), true, "amount must be a number");
    strictEqual(isTruthy(currency), true, "currency is required");
    strictEqual(isTruthy(payee), true, "payee is required");
    strictEqual(isTruthy(payee.partyId), true, "payee.partyId is required");
    strictEqual(
      isTruthy(payee.partyIdType),
      true,
      "payee.partyIdType is required"
    );
    strictEqual(isString(currency), true, "amount must be a string");
  });
}

export function validateGlobalConfig(config: GlobalConfig): void {
  const { callbackHost, baseUrl, environment } = config;
  strictEqual(isTruthy(callbackHost), true, "callbackHost is required");

  if (environment && environment !== Environment.SANDBOX) {
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
