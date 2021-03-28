import { AssertionError } from "assert";
import { v4 as uuid } from "uuid";

import { PaymentRequest } from "../src/collections";
import { expect } from "./chai";

import { Environment, PartyIdType, ProductConfig, SubscriptionConfig, UserConfig } from "../src/common";
import { TransferRequest } from "../src/disbursements";
import {
  validateGlobalConfig,
  validateProductConfig,
  validateRequestToPay,
  validateSubscriptionConfig,
  validateTransfer,
  validateUserConfig
} from "../src/validate";

describe("Validate", function() {
  describe("validateGlobalConfig", function() {
    context("when callbackHost is not specified", function() {
      it("throws an error", function() {
        expect(validateGlobalConfig.bind(null, {})).to.throw(
          AssertionError,
          "callbackHost is required"
        );
      });
    });

    context("when callbackHost is specified", function() {
      it("doesn't throw", function() {
        expect(
          validateGlobalConfig.bind(null, { callbackHost: "example.com" })
        ).to.not.throw();
      });
    });

    context("when environment is specified", function() {
      context("and is not sandbox", function() {
        context("and baseUrl is not specified", function() {
          it("throws", function() {
            expect(
              validateGlobalConfig.bind(null, {
                callbackHost: "example.com",
                environment: Environment.PRODUCTION
              })
            ).to.throw(
              AssertionError,
              "baseUrl is required if environment is not sandbox"
            );
          });
        });

        context("and baseUrl is specified", function() {
          it("doesn't throw", function() {
            expect(
              validateGlobalConfig.bind(null, {
                callbackHost: "example.com",
                environment: Environment.PRODUCTION,
                baseUrl: "mtn production base url"
              })
            ).to.not.throw();
          });
        });
      });
    });
  });

  describe("validateProductConfig", function() {
    context("when primaryKey is not specified", function() {
      it("throws an error", function() {
        expect(validateProductConfig.bind(null, {} as ProductConfig)).to.throw(
          AssertionError,
          "primaryKey is required"
        );
      });
    });

    context("when userId is not specified", function() {
      it("throws an error", function() {
        expect(
          validateProductConfig.bind(null, {
            primaryKey: "test primary key"
          } as ProductConfig)
        ).to.throw(AssertionError, "userId is required");
      });
    });

    context("when userSecret is not specified", function() {
      it("throws an error", function() {
        expect(
          validateProductConfig.bind(null, {
            primaryKey: "test primary key",
            userId: "test user id"
          } as ProductConfig)
        ).to.throw(AssertionError, "userSecret is required");
      });
    });

    context("when userId is not a valid uuid", function() {
      it("throws an error", function() {
        expect(
          validateProductConfig.bind(null, {
            primaryKey: "test primary key",
            userId: "test user id",
            userSecret: "test user secret"
          })
        ).to.throw(AssertionError, "userId must be a valid uuid v4");
      });
    });

    context("when the config is valid", function() {
      it("throws an error", function() {
        expect(
          validateProductConfig.bind(null, {
            primaryKey: "test primary key",
            userId: uuid(),
            userSecret: "test user secret"
          })
        ).to.not.throw();
      });
    });
  });

  describe("validateSubscriptionConfig", function() {
    context("when primaryKey is not specified", function() {
      it("throws an error", function() {
        expect(validateSubscriptionConfig.bind(null, {} as SubscriptionConfig)).to.throw(
          AssertionError,
          "primaryKey is required"
        );
      });
    });

    context("when primaryKey is specified", function() {
      it("throws an error", function() {
        expect(
          validateSubscriptionConfig.bind(null, {
            primaryKey: "test primary key"
          })
        ).to.not.throw();
      });
    });
  });

  describe("validateUserConfig", function() {
    context("when userId is not specified", function() {
      it("throws an error", function() {
        expect(validateUserConfig.bind(null, {} as UserConfig)).to.throw(
          AssertionError,
          "userId is required"
        );
      });
    });

    context("when userSecret is not specified", function() {
      it("throws an error", function() {
        expect(
          validateUserConfig.bind(null, {
            userId: "test user id"
          } as UserConfig)
        ).to.throw(AssertionError, "userSecret is required");
      });
    });

    context("when userId is not a valid uuid", function() {
      it("throws an error", function() {
        expect(
          validateUserConfig.bind(null, {
            userId: "test user id",
            userSecret: "test user secret"
          })
        ).to.throw(AssertionError, "userId must be a valid uuid v4");
      });
    });

    context("when the config is valid", function() {
      it("throws an error", function() {
        expect(
          validateUserConfig.bind(null, {
            userId: uuid(),
            userSecret: "test user secret"
          })
        ).to.not.throw();
      });
    });
  });

  describe("validateRequestToPay", function() {
    context("when the amount is missing", function() {
      it("throws an error", function() {
        const request = {} as PaymentRequest;
        return expect(validateRequestToPay(request)).to.be.rejectedWith(
          "amount is required"
        );
      });
    });

    context("when the amount is not numeric", function() {
      it("throws an error", function() {
        const request = { amount: "alphabetic" } as PaymentRequest;
        return expect(validateRequestToPay(request)).to.be.rejectedWith(
          "amount must be a number"
        );
      });
    });

    context("when the currency is missing", function() {
      it("throws an error", function() {
        const request = {
          amount: "1000"
        } as PaymentRequest;
        return expect(validateRequestToPay(request)).to.be.rejectedWith(
          "currency is required"
        );
      });
    });

    context("when the payer is missing", function() {
      it("throws an error", function() {
        const request = {
          amount: "1000",
          currency: "UGX"
        } as PaymentRequest;
        return expect(validateRequestToPay(request)).to.be.rejectedWith(
          "payer is required"
        );
      });
    });

    context("when the party id is missing", function() {
      it("throws an error", function() {
        const request = {
          amount: "1000",
          currency: "UGX",
          payer: {}
        } as PaymentRequest;
        return expect(validateRequestToPay(request)).to.be.rejectedWith(
          "payer.partyId is required"
        );
      });
    });

    context("when the party id type is missing", function() {
      it("throws an error", function() {
        const request = {
          amount: "1000",
          currency: "UGX",
          payer: {
            partyId: "xxx"
          }
        } as PaymentRequest;
        return expect(validateRequestToPay(request)).to.be.rejectedWith(
          "payer.partyIdType is required"
        );
      });
    });

    context("when the request is valid", function() {
      it("fulfills", function() {
        const request = {
          amount: "1000",
          currency: "UGX",
          payer: {
            partyId: "xxx",
            partyIdType: PartyIdType.MSISDN
          }
        } as PaymentRequest;
        return expect(validateRequestToPay(request)).to.be.fulfilled;
      });
    });
  });

  describe("validateTransfer", function() {
    context("when the referenceId is missing", function() {
      it("throws an error", function() {
        const request = {} as TransferRequest;
        return expect(validateTransfer(request)).to.be.rejectedWith(
          "referenceId is required"
        );
      });
    });
      
    context("when referenceId is not a valid uuid", function() {
      it("throws an error", function () {
        const request = { referenceId: "test reference id" } as TransferRequest;
        return expect(validateTransfer(request)).to.be.rejectedWith(
          "referenceId must be a valid uuid v4"
        );
      });
    });
      
    context("when the amount is missing", function() {
      it("throws an error", function() {
        const request = { referenceId: uuid() } as TransferRequest;
        return expect(validateTransfer(request)).to.be.rejectedWith(
          "amount is required"
        );
      });
    });

    context("when the amount is not numeric", function() {
      it("throws an error", function() {
        const request = { referenceId: uuid(), amount: "alphabetic" } as TransferRequest;
        return expect(validateTransfer(request)).to.be.rejectedWith(
          "amount must be a number"
        );
      });
    });

    context("when the currency is missing", function() {
      it("throws an error", function() {
        const request = {
          referenceId: uuid(),
          amount: "1000"
        } as TransferRequest;
        return expect(validateTransfer(request)).to.be.rejectedWith(
          "currency is required"
        );
      });
    });

    context("when the payee is missing", function() {
      it("throws an error", function() {
        const request = {
          referenceId: uuid(),
          amount: "1000",
          currency: "UGX"
        } as TransferRequest;
        return expect(validateTransfer(request)).to.be.rejectedWith(
          "payee is required"
        );
      });
    });

    context("when the party id is missing", function() {
      it("throws an error", function() {
        const request = {
          referenceId: uuid(),
          amount: "1000",
          currency: "UGX",
          payee: {}
        } as TransferRequest;
        return expect(validateTransfer(request)).to.be.rejectedWith(
          "payee.partyId is required"
        );
      });
    });

    context("when the party id type is missing", function() {
      it("throws an error", function() {
        const request = {
          referenceId: uuid(),
          amount: "1000",
          currency: "UGX",
          payee: {
            partyId: "xxx"
          }
        } as TransferRequest;
        return expect(validateTransfer(request)).to.be.rejectedWith(
          "payee.partyIdType is required"
        );
      });
    });

    context("when the request is valid", function() {
      it("fulfills", function() {
        const request = {
          referenceId: uuid(),
          amount: "1000",
          currency: "UGX",
          payee: {
            partyId: "xxx",
            partyIdType: PartyIdType.MSISDN
          }
        } as TransferRequest;
        return expect(validateTransfer(request)).to.be.fulfilled;
      });
    });
  });
});
