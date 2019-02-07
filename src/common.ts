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
  token_type: string;

  /**
   * The validity time in seconds of the token
   */
  expires_in: number;
}

/**
 * The available balance of the account
 */
export interface Balance {
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

export enum PartyIdType {
  MSISDN = "MSISDN",
  EMAIL = "EMAIL",
  PARTY_CODE = "PARTY_CODE"
}

export enum Environment {
  SANDBOX = "sandbox",
  PRODUCTION = "production"
}

export enum TransactionStatus {
  SUCCESSFUL = "SUCCESSFUL",
  PENDING = "PENDING",
  FAILED = "FAILED"
}

export enum FailureReasonType {
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
