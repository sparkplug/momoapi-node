import { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";
import { expect } from "chai";

import Remittances from "../src/remittances";

import { createMock } from "./mock";

import { PartyIdType } from "../src/common";
import {RemittanceRequest} from "./../src/remittances";

describe("Remittances", function() {
  let remittances: Remittances;
  let mockAdapter: MockAdapter;
  let mockClient: AxiosInstance;

  beforeEach(() => {
    [mockClient, mockAdapter] = createMock();
    remittances = new Remittances(mockClient);
  });

  describe("remit", function() {
    context("when the amount is missing", function() {
      it("throws an error", function() {
        const request = {} as RemittanceRequest;
        return expect(remittances.remit(request)).to.be.rejectedWith(
          "amount is required"
        );
      });
    });

    context("when the amount is not numeric", function() {
      it("throws an error", function() {
        const request = { amount: "alphabetic" } as RemittanceRequest;
        return expect(remittances.remit(request)).to.be.rejectedWith(
          "amount must be a number"
        );
      });
    });

    context("when the currency is missing", function() {
      it("throws an error", function() {
        const request = {
          amount: "1000"
        } as RemittanceRequest;
        return expect(remittances.remit(request)).to.be.rejectedWith(
          "currency is required"
        );
      });
    });

    context("when the payee is missing", function() {
      it("throws an error", function() {
        const request = {
          amount: "1000",
          currency: "UGX"
        } as RemittanceRequest;
        return expect(remittances.remit(request)).to.be.rejectedWith(
          "payee is required"
        );
      });
    });

    context("when the party id is missing", function() {
      it("throws an error", function() {
        const request = {
          amount: "1000",
          currency: "UGX",
          payee: {
          }
        } as RemittanceRequest;
        return expect(remittances.remit(request)).to.be.rejectedWith(
          "payee.partyId is required"
        );
      });
    });

    context("when the party id type is missing", function() {
      it("throws an error", function() {
        const request = {
          amount: "1000",
          currency: "UGX",
          payee: {
            partyId: "xxx",
          }
        } as RemittanceRequest;
        return expect(remittances.remit(request)).to.be.rejectedWith(
          "payee.partyIdType is required"
        );
      });
    });

    it("makes the correct request", function() {
      const request: RemittanceRequest = {
        amount: "50",
        currency: "EUR",
        externalId: "123456",
        payee: {
          partyIdType: PartyIdType.MSISDN,
          partyId: "256774290781"
        },
        payerMessage: "testing",
        payeeNote: "hello"
      };
      return expect(
        remittances.remit({ ...request, callbackUrl: "callback url" })
      ).to.be.fulfilled.then(() => {
        expect(mockAdapter.history.post).to.have.lengthOf(1);
        expect(mockAdapter.history.post[0].url).to.eq(
          "/remittance/v1_0/transfer"
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
        remittances.getTransaction("reference")
      ).to.be.fulfilled.then(() => {
        expect(mockAdapter.history.get).to.have.lengthOf(1);
        expect(mockAdapter.history.get[0].url).to.eq(
          "/remittance/v1_0/transfer/reference"
        );
      });
    });
  });

  describe("getBalance", function() {
    it("makes the correct request", function() {
      return expect(remittances.getBalance()).to.be.fulfilled.then(() => {
        expect(mockAdapter.history.get).to.have.lengthOf(1);
        expect(mockAdapter.history.get[0].url).to.eq(
          "/remittance/v1_0/account/balance"
        );
      });
    });
  });

  describe("isPayerActive", function() {
    it("makes the correct request", function() {
      return expect(
        remittances.isPayerActive("0772000000", PartyIdType.MSISDN)
      ).to.be.fulfilled.then(() => {
        expect(mockAdapter.history.get).to.have.lengthOf(1);
        expect(mockAdapter.history.get[0].url).to.eq(
          "/remittance/v1_0/accountholder/msisdn/0772000000/active"
        );
      });
    });
  });
});
