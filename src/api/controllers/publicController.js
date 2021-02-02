import { generateToken, makeRandomId } from "../utils/authUtils";
import { CustomError } from "../utils/errorUtils";
import { jsonResponse } from "../utils/responseUtils";
import { validateStringField } from "../utils/validators";

export const publicCtrl = {
  login: (req, res, next) => {
    const { username, password } = req.body;
    let validationError;
    const errors = [];
    try {
      validationError = validateStringField("username", username);
      if (validationError) errors.push(validationError);

      validationError = validateStringField("password", password);
      if (validationError) errors.push(validationError);

      //check errors array
      if (errors.length) {
        throw new CustomError(400, "Validation Error", errors);
      }

      // return a signed jsonwebtoken
      const randomId = makeRandomId(8);
      const token = generateToken(randomId);

      return jsonResponse(res, 200, { token });
    } catch (error) {
      next(error);
    }
  },
};
