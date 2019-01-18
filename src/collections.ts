import { AxiosInstance } from "axios";
import uuid from "uuid/v4";

import { Config } from ".";
import { createOAuthClient } from "./client";
import { authorizeCollections } from "./oauth";

export interface PaymentRequest {
  amount: string;
  currency: string;
  externalId: string;
  payer: Payer;
  payerMessage: string;
  payeeNote: string;
  callbackUrl?: string;
}

export interface Transaction {
  financialTransactionId: string;
  externalId: string;
  amount: string;
  currency: string;
  payer: Payer;
  payerMessage: string;
  payeeNote: string;
  status: TransactionStatus;
}

export interface AccountBalance {
  availableBalance: string;
  currency: string;
}

export interface Payer {
  partyIdType: "MSISDN" | string;
  partyId: string;
}

// TODO: Get all valid transaction statuses
export type TransactionStatus = "SUCCESSFUL" | string;

export default class Collections {
  private client: AxiosInstance;

  constructor(config: Config) {
    this.client = createOAuthClient(config, authorizeCollections);
  }

  public requestToPay(paymentRequest: PaymentRequest): Promise<string> {
    const referenceId: string = uuid();
    return this.client
      .post<void>("/colection/v1_0/requesttopay", paymentRequest, {
        headers: {
          "X-Reference-Id": referenceId,
          "X-Callback-Url": paymentRequest.callbackUrl
        }
      })
      .then(() => referenceId);
  }

  public getTransactionStatus(referenceId: string): Promise<Transaction> {
    return this.client
      .get(`/colection/v1_0/requesttopay/${referenceId}`)
      .then(response => response.data);
  }

  public getAccountBalance(): Promise<AccountBalance> {
    return this.client
      .get("/colection/v1_0/account/balance")
      .then(response => response.data);
  }
}
