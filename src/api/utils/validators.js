const { validate } = require("fast-json-patch");
const { PatchError } = require("fast-json-patch/commonjs/helpers");

export const isObject = (inVariable) => {
  return typeof inVariable === "object" && inVariable !== null;
};

export const validateStringField = (fieldName, fieldValue) => {
  let error;
  // if username is empty
  if (!fieldValue) {
    error = `${fieldName} is required`;
  } else if (typeof fieldValue !== "string") {
    error = `${fieldName} must be a string`;
  }
  return error;
};

export const validateJSON = (fieldName, json) => {
  let error;

  // if json is undefined
  if (!json) {
    error = `${fieldName} is required`;
  } else {
    if (!isObject(json)) {
      error = `${fieldName} is an invalid JSON object`;
    }
  }

  return error;
};

export const validateJsonPatchObject = (patch) => {
  // if json-patch is undefined
  let error;
  if (!patch) {
    error = `No JSONPatch object provided`;
  } else {
    const error = validate(patch);
    if (error && error instanceof PatchError) {
      return error.message;
    }
  }

  return error;
};
