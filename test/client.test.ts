import sinon from "sinon";

import { createAuthClient, createClient } from "../src/client";
import { expect } from "./chai";
import { createMock } from "./mock";

import { Config, Environment } from "../src/common";

describe("Client", function() {
  const config: Config = {
    environment: Environment.SANDBOX,
    baseUrl: "test",
    primaryKey: "key",
    userId: "id",
    userSecret: "secret"
  };

  describe("createClient", function() {
    it("creates an axios instance with the right default headers", function() {
      const [mockClient] = createMock();
      const client = createClient(config, mockClient);
      expect(client.defaults.headers).to.have.deep.property(
        "Ocp-Apim-Subscription-Key",
        "key"
      );
      expect(client.defaults.headers).to.have.deep.property(
        "X-Target-Environment",
        "sandbox"
      );
    });

    it("makes requests with the right headers", function() {
      const [mockClient, mockAdapter] = createMock();
      const client = createClient(config, mockClient);
      return expect(client.get("/test")).to.be.fulfilled.then(() => {
        expect(mockAdapter.history.get[0].headers).to.have.deep.property(
          "Ocp-Apim-Subscription-Key",
          "key"
        );
        expect(mockAdapter.history.get[0].headers).to.have.deep.property(
          "X-Target-Environment",
          "sandbox"
        );
      });
    });
  });

  describe("createAuthClient", function() {
    it("makes requests with the right headers", function() {
      const [mockClient, mockAdapter] = createMock();
      const refresher = sinon.fake.resolves("token");
      const client = createAuthClient(refresher, mockClient);
      return expect(client.get("/test")).to.be.fulfilled.then(() => {
        expect(mockAdapter.history.get[0].headers).to.have.deep.property(
          "Authorization",
          "Bearer token"
        );
        expect(refresher.callCount).to.eq(1);
      });
    });
  });
});
