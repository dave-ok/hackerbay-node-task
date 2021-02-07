import { expect } from "chai";
import {
  isObject,
  validateJSON,
  validateJsonPatchObject,
  validateStringField,
  validateURL,
} from "../validators";

describe("Validation Utils", function () {
  describe("'isObject' function", function () {
    it("should return true for a valid object", function () {
      expect(isObject({ someObject: "property" })).true;
    });
    it("should return false for an invalid object (string)", function () {
      expect(isObject("A string")).false;
    });
  });

  describe("'validateStringField' function", function () {
    it("should return error on empty string", function () {
      expect(validateStringField("testField")).to.contain(
        "testField is required"
      );
    });
    it("should return error for invalid string", function () {
      expect(validateStringField("testField", 3000)).to.contain(
        "testField must be a string"
      );
    });
    it("should return no error with valid string", function () {
      expect(validateStringField("testField", "test string")).undefined;
    });
  });

  describe("'validateJSON' function", function () {
    it("should return error on empty string", function () {
      expect(validateJSON("testField")).to.contain("testField is required");
    });
    it("should return error for invalid string", function () {
      expect(validateJSON("testField", 3000)).to.contain(
        "testField is an invalid JSON object"
      );
    });
    it("should return no error with valid string", function () {
      expect(validateJSON("testField", { prop: "value" })).undefined;
    });
  });

  describe("'validateURL' function", function () {
    it("should return error on empty string", function () {
      expect(validateURL("")).to.contain("No URL provided");
    });
    it("should return error for invalid URL", function () {
      expect(validateURL("httx//some-invalid-url")).to.contain(
        "Invalid URL provided"
      );
    });
    it("should return no error with valid string", function () {
      expect(validateURL("http://localhost:3000")).undefined;
    });
  });

  describe("'validateJsonPatch' function", function () {
    it("should return error string on undefined argument", function () {
      expect(validateJsonPatchObject()).to.contain(
        "No JSONPatch object provided"
      );
    });
    it("should return error string for invalid JSON patch object", function () {
      expect(
        validateJsonPatchObject({ someAbritaryField: "someValue" })
      ).to.be.a("string");
    });
    it("should return no error for valid JSON patch object", function () {
      expect(
        validateJsonPatchObject([
          {
            op: "add",
            path: "/biscuits/1",
            value: { name: "Ginger Nut" },
          },
        ])
      ).undefined;
    });
  });
});
