import axios, { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";

import { Payment } from "../src/collections";
import { AccessToken, Balance, Credentials } from "../src/common";
import { Transfer } from "../src/disbursements";

export function createMock(): [AxiosInstance, MockAdapter] {
  const client = axios.create({
    headers: {
      "Content-Type": "application/json"
    }
  });

  const mock = new MockAdapter(client);

  mock.onGet("/test").reply(200);

  mock.onPost("/v1_0/apiuser").reply(201);

  mock.onPost(/\/v1_0\/apiuser\/[\w\-]+\/apikey/).reply(200, {
    apiKey: "api-key"
  } as Credentials);

  mock.onPost("/collection/token/").reply(200, {
    access_token: "token",
    token_type: "access_token",
    expires_in: 3600
  } as AccessToken);

  mock
    .onGet(/\/collection\/v1_0\/accountholder\/(MSISDN|EMAIL|PARTY_CODE)\/\w+/)
    .reply(200, "true");

  mock.onPost("/collection/v1_0/requesttopay").reply(201);

  mock.onGet(/\/collection\/v1_0\/requesttopay\/[\w\-]+/).reply(200, {
    financialTransactionId: "tx id",
    externalId: "string",
    amount: "2000",
    currency: "UGX",
    payer: {
      partyIdType: "MSISDN",
      partyId: "256772000000"
    },
    payerMessage: "test",
    payeeNote: "test",
    status: "SUCCESSFUL"
  } as Payment);

  mock.onGet("/collection/v1_0/account/balance").reply(200, {
    availableBalance: "2000",
    currency: "UGX"
  } as Balance);

  mock.onPost("/disbursement/token/").reply(200, {
    access_token: "token",
    token_type: "access_token",
    expires_in: 3600
  } as AccessToken);

  mock
    .onGet(
      /\/disbursement\/v1_0\/accountholder\/(msisdn|email|party_code)\/\w+/
    )
    .reply(200, "true");

  mock.onPost("/disbursement/v1_0/transfer").reply(201);

  mock.onGet(/\/disbursement\/v1_0\/transfer\/[\w\-]+/).reply(200, {
    financialTransactionId: "tx id",
    externalId: "string",
    amount: "2000",
    currency: "UGX",
    payee: {
      partyIdType: "MSISDN",
      partyId: "256772000000"
    },
    status: "SUCCESSFUL"
  } as Transfer);

  mock.onGet("/disbursement/v1_0/account/balance").reply(200, {
    availableBalance: "2000",
    currency: "UGX"
  } as Balance);

  return [client, mock];
}
