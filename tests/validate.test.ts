import { AssertionError } from "assert";
import uuid from "uuid/v4";

import { expect } from "./chai";

import {
  validateGlobalConfig,
  validateProductConfig,
  validateSubscriptionConfig,
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
      context("and it's not valid", function() {
        it("thows an error", function() {
          expect(
            validateGlobalConfig.bind(null, {
              callbackHost: "example.com",
              environment: "test"
            })
          ).to.throw(
            AssertionError,
            "environment must be either sandbox or production"
          );
        });
      });

      context("and it's valid", function() {
        it("thows an error", function() {
          expect(
            validateGlobalConfig.bind(null, {
              callbackHost: "example.com",
              environment: "sandbox"
            })
          ).to.not.throw();
        });
      });

      context("and is production", function() {
        context("and baseUrl is not specified", function() {
          it("throws", function() {
            expect(
              validateGlobalConfig.bind(null, {
                callbackHost: "example.com",
                environment: "production"
              })
            ).to.throw(
              AssertionError,
              "baseUrl is required if environment is not sandbox"
            );
          });
        });

        context("and baseUrl isu specified", function() {
          it("doesn't throw", function() {
            expect(
              validateGlobalConfig.bind(null, {
                callbackHost: "example.com",
                environment: "production",
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
        expect(validateProductConfig.bind(null, {})).to.throw(
          AssertionError,
          "primaryKey is required"
        );
      });
    });

    context("when userId is not specified", function() {
      it("throws an error", function() {
        expect(
          validateProductConfig.bind(null, { primaryKey: "test primary key" })
        ).to.throw(AssertionError, "userId is required");
      });
    });

    context("when userSecret is not specified", function() {
      it("throws an error", function() {
        expect(
          validateProductConfig.bind(null, {
            primaryKey: "test primary key",
            userId: "test user id"
          })
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
        expect(validateSubscriptionConfig.bind(null, {})).to.throw(
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
        expect(validateUserConfig.bind(null, {})).to.throw(
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
          })
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
});
