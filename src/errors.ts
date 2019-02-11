import { AxiosError } from "axios";
import { FailureReason } from "./common";

interface ErrorBody {
  code: FailureReason;
  message: string;
}

export class ApprovalRejectedError extends Error {
  public name = "ApprovalRejectedError";
}

export class ExpiredError extends Error {
  public name = "ExpiredError";
}

export class InternalProcessingError extends Error {
  public name = "InternalProcessingError";
}

export class InvalidCallbackUrlHostError extends Error {
  public name = "InvalidCallbackUrlHostError";
}

export class InvalidCurrencyError extends Error {
  public name = "InvalidCurrencyError";
}

export class NotAllowedTargetEnvironmentError extends Error {
  public name = "NotAllowedTargetEnvironmentError";
}

export class NotAllowedError extends Error {
  public name = "NotAllowedError";
}

export class NotEnoughFundsError extends Error {
  public name = "NotEnoughFundsError";
}

export class PayeeNotFoundError extends Error {
  public name = "PayeeNotFoundError";
}

export class PayeeNotAllowedToReceiveError extends Error {
  public name = "PayeeNotAllowedToReceiveError";
}

export class PayerLimitReachedError extends Error {
  public name = "PayerLimitReachedError";
}

export class PayerNotFoundError extends Error {
  public name = "PayerNotFoundError";
}

export class PaymentNotApprovedError extends Error {
  public name = "PaymentNotApprovedError";
}

export class ResourceAlreadyExistError extends Error {
  public name = "ResourceAlreadyExistError";
}

export class ResourceNotFoundError extends Error {
  public name = "ResourceNotFoundError";
}

export class ServiceUnavailableError extends Error {
  public name = "NotAllowedTargetEnvironment";
}

export class TransactionCancelledError extends Error {
  public name = "TransactionCancelledError";
}

export class UnspecifiedError extends Error {
  public name = "ResourceAlreadyExistError";
}

export function handleError(error: AxiosError): Error {
  if (!error.response) {
    return error;
  }

  const { code, message }: ErrorBody = error.response.data || {};

  return getError(code, message);
}

export function getError(code: FailureReason, message?: string) {
  if (code === FailureReason.APPROVAL_REJECTED) {
    return new ApprovalRejectedError(message);
  }

  if (code === FailureReason.EXPIRED) {
    return new ExpiredError(message);
  }

  if (code === FailureReason.INTERNAL_PROCESSING_ERROR) {
    return new InternalProcessingError(message);
  }

  if (code === FailureReason.INVALID_CALLBACK_URL_HOST) {
    return new InvalidCallbackUrlHostError(message);
  }

  if (code === FailureReason.INVALID_CURRENCY) {
    return new InvalidCurrencyError(message);
  }

  if (code === FailureReason.NOT_ALLOWED) {
    return new NotAllowedError(message);
  }

  if (code === FailureReason.NOT_ALLOWED_TARGET_ENVIRONMENT) {
    return new NotAllowedTargetEnvironmentError(message);
  }

  if (code === FailureReason.NOT_ENOUGH_FUNDS) {
    return new NotEnoughFundsError(message);
  }

  if (code === FailureReason.PAYEE_NOT_FOUND) {
    return new PayeeNotFoundError(message);
  }

  if (code === FailureReason.PAYEE_NOT_ALLOWED_TO_RECEIVE) {
    return new PayeeNotAllowedToReceiveError(message);
  }

  if (code === FailureReason.PAYER_LIMIT_REACHED) {
    return new PayerLimitReachedError(message);
  }

  if (code === FailureReason.PAYER_NOT_FOUND) {
    return new PayerNotFoundError(message);
  }

  if (code === FailureReason.PAYMENT_NOT_APPROVED) {
    return new PaymentNotApprovedError(message);
  }

  if (code === FailureReason.RESOURCE_ALREADY_EXIST) {
    return new ResourceAlreadyExistError(message);
  }

  if (code === FailureReason.RESOURCE_NOT_FOUND) {
    return new ResourceNotFoundError(message);
  }

  if (code === FailureReason.SERVICE_UNAVAILABLE) {
    return new ServiceUnavailableError(message);
  }

  if (code === FailureReason.TRANSACTION_CANCELED) {
    return new TransactionCancelledError(message);
  }

  return new UnspecifiedError();
}
