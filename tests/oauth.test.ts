import { createBasicAuthToken } from "../src/oauth";
import { expect } from "chai";

describe("OAuth", function() {
  describe("createBasicAuthToken", function() {
    it("encodes id and secret in base64", function() {
      expect(
        createBasicAuthToken({
          subscriptionKey: "test",
          userId: "id",
          userSecret: "secret"
        })
      ).to.equal(Buffer.from("id:secret").toString("base64"));
    });
  });
});
