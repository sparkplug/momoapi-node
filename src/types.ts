export type Config = GlobalConfig & ProductConfig;

export type ProductConfig = SubscriptionConfig & UserConfig;

export interface GlobalConfig {
  /**
   * The provider callback host
   */
  callbackHost?: string;

  /**
   * The base URL of the EWP system where the transaction shall be processed.
   * This parameter is used to route the request to the EWP system that will
   * initiate the transaction.
   */
  baseUrl?: string;

  /**
   * The identifier of the EWP system where the transaction shall be processed.
   * This parameter is used to route the request to the EWP system that will
   * initiate the transaction.
   */
  environment?: Environment;
}

export interface SubscriptionConfig {
  /**
   * Subscription key which provides access to this API. Found in your Profile
   */
  primaryKey: string;
}

export interface UserConfig {
  /**
   * The API user's key
   */
  userSecret: string;

  /**
   * Recource ID for the API user
   */
  userId: string;
}

export interface Credentials {
  apiKey: string;
}

export interface AccessToken {
  /**
   * A JWT token which can be used to authrize against the other API end-points.
   * The format of the token follows the JWT standard format (see jwt.io for an example).
   * This is the token that should be sent in in the Authorization header when calling the other API end-points.
   */
  access_token: string;

  /**
   * The token type.
   *
   * TODO: Find list of complete token types
   */
  token_type: "access_token" | string;

  /**
   * The validity time in seconds of the token
   */
  expires_in: number;
}

export interface PaymentRequest {
  /**
   * Amount that will be debited from the payer account
   */
  amount: string;

  /**
   * ISO4217 Currency
   */
  currency: string;

  /**
   * External id is used as a reference to the transaction.
   * External id is used for reconciliation.
   * The external id will be included in transaction history report.
   * External id is not required to be unique.
   */
  externalId: string;

  /**
   * Party identifies a account holder in the wallet platform.
   * Party consists of two parameters, type and partyId.
   * Each type have its own validation of the partyId
   *   - MSISDN - Mobile Number validated according to ITU-T E.164. Validated with IsMSISDN
   *   - EMAIL - Validated to be a valid e-mail format. Validated with IsEmail
   *   - PARTY_CODE - UUID of the party. Validated with IsUuid
   */
  payer: Payer;

  /**
   * Message that will be written in the payer transaction history message field.
   */
  payerMessage: string;

  /**
   * Message that will be written in the payee transaction history note field.
   */
  payeeNote: string;

  /**
   * URL to the server where the callback should be sent.
   */
  callbackUrl?: string;
}

export interface Transaction {
  /**
   * Financial transactionIdd from mobile money manager.
   * Used to connect to the specific financial transaction made in the account
   */
  financialTransactionId: string;

  /**
   * External id provided in the creation of the requestToPay transaction
   */
  externalId: string;

  /**
   * Amount that will be debited from the payer account.
   */
  amount: string;

  /**
   * ISO4217 Currency
   */
  currency: string;

  /**
   * Party identifies a account holder in the wallet platform.
   * Party consists of two parameters, type and partyId.
   * Each type have its own validation of the partyId
   *   - MSISDN - Mobile Number validated according to ITU-T E.164. Validated with IsMSISDN
   *   - EMAIL - Validated to be a valid e-mail format. Validated with IsEmail
   *   - PARTY_CODE - UUID of the party. Validated with IsUuid
   */
  payer: Payer;

  /**
   * Message that will be written in the payer transaction history message field.
   */
  payerMessage: string;

  /**
   * Message that will be written in the payee transaction history note field.
   */
  payeeNote: string;

  reason: TransactionFailure;

  status: TransactionStatus;
}

/**
 * The available balance of the account
 */
export interface AccountBalance {
  /**
   * The available balance of the account
   */
  availableBalance: string;

  /**
   * ISO4217 Currency
   */
  currency: string;
}

export interface Payer {
  partyIdType: PartyIdType;
  partyId: string;
}

export type PartyIdType = "MSISDN" | "EMAIL" | "PARTY_CODE";

export enum Environment {
  sandbox = "sandbox",
  production = "production"
}

export interface TransactionFailure {
  type: TransactionFailureType;
  message: string;
}

export enum TransactionFailureType {
  payeeNotFound = "PAYEE_NOT_FOUND",
  payerNotFound = "PAYER_NOT_FOUND",
  notAllowed = "NOT_ALLOWED",
  notAllowedTargetEnviroment = "NOT_ALLOWED_TARGET_ENVIRONMENT",
  invalidCallbackUrlHost = "INVALID_CALLBACK_URL_HOST",
  invalidCurrency = "INVALID_CURRENCY",
  serviceUnavailable = "SERVICE_UNAVAILABLE",
  internalProcessingError = "INTERNAL_PROCESSING_ERROR",
  notEnoughFunds = "NOT_ENOUGH_FUNDS",
  payerLimitReached = "PAYER_LIMIT_REACHED",
  payeeNotAllowedToReceive = "PAYEE_NOT_ALLOWED_TO_RECEIVE",
  paymentNotApproved = "PAYMENT_NOT_APPROVED",
  resourceNotFound = "RESOURCE_NOT_FOUND",
  approvalReject = "APPROVAL_REJECTED",
  expired = "EXPIRED",
  transactionCancelled = "TRANSACTION_CANCELED",
  resourceAlreadyExist = "RESOURCE_ALREADY_EXIST"
}

export type TransactionStatus = "SUCCESSFUL" | "PENDING" | "FAILED";
