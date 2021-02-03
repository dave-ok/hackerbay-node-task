import { CustomError } from "../utils/errorUtils";
import { jsonResponse } from "../utils/responseUtils";
import { validateJSON, validateJsonPatchObject } from "../utils/validators";

const { applyPatch } = require("fast-json-patch");

export const protectedCtrl = {
  jsonPatch: async (req, res, next) => {
    const { jsonObject, jsonPatch } = req.body;
    let error;
    const errors = [];

    try {
      // validate json object
      error = validateJSON("jsonObject", jsonObject);
      if (error) {
        errors.push(error);
      }

      // validate jsonPatchObject
      error = validateJsonPatchObject(jsonPatch);
      if (error) {
        errors.push(error);
      }

      if (errors.length) {
        throw new CustomError(400, "JSON patch validation error", errors);
      }

      // patch json
      try {
        const result = applyPatch(jsonObject, jsonPatch);

        // return result
        return jsonResponse(res, 200, result);
      } catch (error) {
        return next(
          new CustomError(400, `JSON patching error: ${error.message}`)
        );
      }
    } catch (error) {
      return next(error);
    }
  },
};
