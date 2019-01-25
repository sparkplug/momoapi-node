import { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";
import { expect } from "chai";

import Collections from "../src/collections";

import { createMock } from "./mock";

import { PaymentRequest } from "../src/types";

describe("Collections", function() {
  let collections: Collections;
  let mockAdapter: MockAdapter;
  let mockClient: AxiosInstance;

  beforeEach(() => {
    [mockClient, mockAdapter] = createMock();
    collections = new Collections(mockClient);
  });

  describe("requestToPay", function() {
    it("makes the correct request", function() {
      const request: PaymentRequest = {
        amount: "50",
        currency: "EUR",
        externalId: "123456",
        payer: {
          partyIdType: "MSISDN",
          partyId: "256774290781"
        },
        payerMessage: "testing",
        payeeNote: "hello"
      };
      return expect(
        collections.requestToPay({ ...request, callbackUrl: "callback url" })
      ).to.be.fulfilled.then(() => {
        expect(mockAdapter.history.post).to.have.lengthOf(1);
        expect(mockAdapter.history.post[0].url).to.eq(
          "/collection/v1_0/requesttopay"
        );
        expect(mockAdapter.history.post[0].data).to.eq(JSON.stringify(request));
        expect(mockAdapter.history.post[0].headers["X-Reference-Id"]).to.be.a(
          "string"
        );
        expect(mockAdapter.history.post[0].headers["X-Callback-Url"]).to.eq(
          "callback url"
        );
      });
    });
  });

  describe("getTransaction", function() {
    it("makes the correct request", function() {
      return expect(
        collections.getTransaction("reference")
      ).to.be.fulfilled.then(() => {
        expect(mockAdapter.history.get).to.have.lengthOf(1);
        expect(mockAdapter.history.get[0].url).to.eq(
          "/collection/v1_0/requesttopay/reference"
        );
      });
    });
  });

  describe("getBalance", function() {
    it("makes the correct request", function() {
      return expect(collections.getBalance()).to.be.fulfilled.then(() => {
        expect(mockAdapter.history.get).to.have.lengthOf(1);
        expect(mockAdapter.history.get[0].url).to.eq(
          "/collection/v1_0/account/balance"
        );
      });
    });
  });

  describe("isPayerActive", function() {
    it("makes the correct request", function() {
      return expect(
        collections.isPayerActive("0772000000", "MSISDN")
      ).to.be.fulfilled.then(() => {
        expect(mockAdapter.history.get).to.have.lengthOf(1);
        expect(mockAdapter.history.get[0].url).to.eq(
          "/collection/v1_0/accountholder/MSISDN/0772000000/active"
        );
      });
    });
  });
});
