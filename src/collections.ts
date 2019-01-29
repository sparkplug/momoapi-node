import { AxiosInstance } from "axios";
import uuid from "uuid/v4";

import {
  AccountBalance,
  PartyIdType,
  PaymentRequest,
  Transaction
} from "./types";

export default class Collections {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * This method is used to request a payment from a consumer (Payer).
   * The payer will be asked to authorize the payment. The transaction will
   * be executed once the payer has authorized the payment.
   * The requesttopay will be in status PENDING until the transaction
   * is authorized or declined by the payer or it is timed out by the system.
   * Status of the transaction can be validated by using `getTransation`
   *
   * @param paymentRequest
   */
  public requestToPay({
    callbackUrl,
    ...paymentRequest
  }: PaymentRequest): Promise<string> {
    const referenceId: string = uuid();
    return this.client
      .post<void>("/collection/v1_0/requesttopay", paymentRequest, {
        headers: {
          "X-Reference-Id": referenceId,
          ...(callbackUrl ? { "X-Callback-Url": callbackUrl } : {})
        }
      })
      .then(() => referenceId);
  }

  /**
   * This method is used to get the Transaction object.
   *
   * @param referenceId the value returned from `requestToPay`
   */
  public getTransaction(referenceId: string): Promise<Transaction> {
    return this.client
      .get<Transaction>(`/collection/v1_0/requesttopay/${referenceId}`)
      .then(response => response.data);
  }

  /**
   * Get the balance of the account.
   */
  public getBalance(): Promise<AccountBalance> {
    return this.client
      .get<AccountBalance>("/collection/v1_0/account/balance")
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
  public isPayerActive(id: string, type: PartyIdType = "MSISDN"): Promise<any> {
    return this.client
      .get(`/collection/v1_0/accountholder/${type}/${id}/active`)
      .then(response => response.data);
  }
}
