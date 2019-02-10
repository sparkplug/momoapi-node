import sinon from "sinon";

import { expect } from "./chai";

import {
  authorizeCollections,
  authorizeDisbursements,
  createBasicAuthToken,
  createTokenRefresher
} from "../src/auth";
import { createMock } from "./mock";

import { AccessToken, Config, Environment } from "../src/common";

describe("Auth", function() {
  const config: Config = {
    environment: Environment.SANDBOX,
    baseUrl: "test",
    primaryKey: "key",
    userId: "id",
    userSecret: "secret"
  };

  describe("getTokenRefresher", function() {
    context("when the access token is not expired", function() {
      it("doesn't call the authorizer for a new access token", function() {
        const authorizer = sinon.fake.resolves({
          access_token: "token",
          token_type: "string",
          expires_in: 3600
        } as AccessToken);
        const refresh = createTokenRefresher(authorizer, config);
        return expect(refresh().then(() => refresh())).to.be.fulfilled.then(
          () => {
            expect(authorizer.callCount).to.eq(1);
          }
        );
      });
    });

    context("when the access token expires", function() {
      it("calls the authorizer again for a new access token", function() {
        const authorizer = sinon.fake.resolves({
          access_token: "token",
          token_type: "string",
          expires_in: -3600
        } as AccessToken);
        const refresh = createTokenRefresher(authorizer, config);
        return expect(refresh().then(() => refresh())).to.be.fulfilled.then(
          () => {
            expect(authorizer.callCount).to.eq(2);
          }
        );
      });
    });
  });

  describe("authorizeCollections", function() {
    it("makes the correct request", function() {
      const [mockClient, mockAdapter] = createMock();
      return expect(
        authorizeCollections(config, mockClient)
      ).to.be.fulfilled.then(() => {
        expect(mockAdapter.history.post).to.have.lengthOf(1);
        expect(mockAdapter.history.post[0].url).to.eq("/collection/token/");
        expect(mockAdapter.history.post[0].headers.Authorization).to.eq(
          "Basic " + Buffer.from("id:secret").toString("base64")
        );
      });
    });
  });

  describe("authorizeDisbursements", function() {
    it("makes the correct request", function() {
      const [mockClient, mockAdapter] = createMock();
      return expect(
        authorizeDisbursements(config, mockClient)
      ).to.be.fulfilled.then(() => {
        expect(mockAdapter.history.post).to.have.lengthOf(1);
        expect(mockAdapter.history.post[0].url).to.eq("/disbursement/token/");
        expect(mockAdapter.history.post[0].headers.Authorization).to.eq(
          "Basic " + Buffer.from("id:secret").toString("base64")
        );
      });
    });
  });

  describe("createBasicAuthToken", function() {
    it("encodes id and secret in base64", function() {
      expect(
        createBasicAuthToken({
          userId: "id",
          userSecret: "secret"
        })
      ).to.equal(Buffer.from("id:secret").toString("base64"));
    });
  });
});
