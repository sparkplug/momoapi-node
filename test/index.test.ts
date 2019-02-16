import { AssertionError } from "assert";

import * as momo from "../src";

import { expect } from "./chai";

describe("MomoClient", function() {
  describe("#create", function() {
    context("when there is no callback host", function() {
      it("throws an error", function() {
        expect(momo.create.bind(null, {})).to.throw(AssertionError);
      });
    });

    context("when there is a callback host", function() {
      it("throws doesn't throw  an error", function() {
        expect(
          momo.create.bind(null, { callbackHost: "example.com" })
        ).to.not.throw();
      });

      it("returns a creator for Collections client", function() {
        expect(momo.create({ callbackHost: "example.com" }))
          .to.have.property("Collections")
          .that.is.a("function");
      });

      it("returns a creator for Disbursements client", function() {
        expect(momo.create({ callbackHost: "example.com" }))
          .to.have.property("Disbursements")
          .that.is.a("function");
      });
    });
  });
});
