import { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter/types";
import { expect } from "./chai";

import Users from "../src/users";
import { createMock } from "./mock";

describe("Users", function() {
  let users: Users;
  let mockAdapter: MockAdapter;
  let mockClient: AxiosInstance;

  beforeEach(() => {
    [mockClient, mockAdapter] = createMock();
    users = new Users(mockClient);
  });

  describe("create", function() {
    it("makes the correct request", function() {
      return expect(users.create("host")).to.be.fulfilled.then(() => {
        expect(mockAdapter.history.post).to.have.lengthOf(1);
        expect(mockAdapter.history.post[0].url).to.eq("/v1_0/apiuser");
        expect(mockAdapter.history.post[0].data).to.eq(
          JSON.stringify({ providerCallbackHost: "host" })
        );
        expect(mockAdapter.history.post[0].headers["X-Reference-Id"]).to.be.a(
          "string"
        );
      });
    });
  });

  describe("login", function() {
    it("makes the correct request", function() {
      return expect(users.login("id")).to.be.fulfilled.then(() => {
        expect(mockAdapter.history.post).to.have.lengthOf(1);
        expect(mockAdapter.history.post[0].url).to.eq(
          "/v1_0/apiuser/id/apikey"
        );
      });
    });
  });
});
