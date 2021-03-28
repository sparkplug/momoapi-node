import { AxiosInstance } from "axios";
import { v4 as uuid } from "uuid";

import { getTransactionError } from "./errors";
import { validateTransfer } from "./validate";

import {
  Balance,
  FailureReason,
  PartyIdType,
  TransactionStatus
} from "./common";

export interface TransferRequest {
  /**
   * Unique Transfer Reference (UUID v4), will be automatically generated if not explicitly supplied
   */
  referenceId?: string;
  /**
   * Amount that will be debited from the payer account.
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
  externalId?: string;

  /**
   * Party identifies a account holder in the wallet platform.
   * Party consists of two parameters, type and partyId.
   * Each type have its own validation of the partyId
   *   MSISDN - Mobile Number validated according to ITU-T E.164. Validated with IsMSISDN
   *   EMAIL - Validated to be a valid e-mail format. Validated with IsEmail
   *   PARTY_CODE - UUID of the party. Validated with IsUuid
   */
  payee: {
    partyIdType: PartyIdType;
    partyId: string;
  };

  /**
   * Message that will be written in the payer transaction history message field.
   */
  payerMessage?: string;
  /**
   * Message that will be written in the payee transaction history note field.
   */
  payeeNote?: string;
  /**
   * URL to the server where the callback should be sent.
   */
  callbackUrl?: string;
}

export interface Transfer {
  /**
   * Amount that will be debited from the payer account.
   */
  amount: string;

  /**
   * ISO4217 Currency
   */
  currency: string;

  /**
   * Financial transactionIdd from mobile money manager.
   * Used to connect to the specific financial transaction made in the account
   */
  financialTransactionId: string;

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
   *   MSISDN - Mobile Number validated according to ITU-T E.164. Validated with IsMSISDN
   *   EMAIL - Validated to be a valid e-mail format. Validated with IsEmail
   *   PARTY_CODE - UUID of the party. Validated with IsUuid
   */
  payee: {
    partyIdType: "MSISDN";
    partyId: string;
  };
  status: TransactionStatus;
  reason?: FailureReason;
}

export default class Disbursements {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Transfer operation is used to transfer an amount from the owner’s
   * account to a payee account.
   * Status of the transaction can be validated by using the
   *
   * @param paymentRequest
   */
  public transfer({
    callbackUrl,
    referenceId = uuid(),
    ...payoutRequest
  }: TransferRequest): Promise<string> {
    return validateTransfer({ referenceId, ...payoutRequest }).then(() => {
      return this.client
        .post<void>("/disbursement/v1_0/transfer", payoutRequest, {
          headers: {
            "X-Reference-Id": referenceId,
            ...(callbackUrl ? { "X-Callback-Url": callbackUrl } : {})
          }
        })
        .then(() => referenceId);
    });
  }

  /**
   * This method is used to retrieve the transaction. You can invoke this method
   * to at intervals until your transaction fails or succeeds.
   *
   * If the transaction has failed, it will throw an appropriate error. The error will be a subclass
   * of `MtnMoMoError`. Check [`src/error.ts`](https://github.com/sparkplug/momoapi-node/blob/master/src/errors.ts)
   * for the various errors that can be thrown
   *
   * @param referenceId the value returned from `transfer`
   */
  public getTransaction(referenceId: string): Promise<Transfer> {
    return this.client
      .get<Transfer>(`/disbursement/v1_0/transfer/${referenceId}`)
      .then(response => response.data)
      .then(transaction => {
        if (transaction.status === TransactionStatus.FAILED) {
          return Promise.reject(getTransactionError(transaction));
        }

        return Promise.resolve(transaction);
      });
  }

  /**
   * Get the balance of the account.
   */
  public getBalance(): Promise<Balance> {
    return this.client
      .get<Balance>("/disbursement/v1_0/account/balance")
      .then(response => response.data);
  }

  /**
   * This method is used to check if an account holder is registered and active in the system.
   *
   * @param id Specifies the type of the party ID. Allowed values [msisdn, email, party_code].
   *   accountHolderId should explicitly be in small letters.
   *
   * @param type The party number. Validated according to the party ID type (case Sensitive).
   *   msisdn - Mobile Number validated according to ITU-T E.164. Validated with IsMSISDN
   *   email - Validated to be a valid e-mail format. Validated with IsEmail
   *   party_code - UUID of the party. Validated with IsUuid
   */
  public isPayerActive(
    id: string,
    type: PartyIdType = PartyIdType.MSISDN
  ): Promise<boolean> {
    return this.client
      .get<{ result: boolean }>(`/disbursement/v1_0/accountholder/${String(type).toLowerCase()}/${id}/active`)
      .then(response => response.data)
      .then(data => data.result ? data.result : false);
  }
}
