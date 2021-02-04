import { CustomError } from "../utils/errorUtils";
import { jsonResponse } from "../utils/responseUtils";
import {
  validateJSON,
  validateJsonPatchObject,
  validateURL,
} from "../utils/validators";
import fetch from "node-fetch";

const { applyPatch } = require("fast-json-patch");
const sharp = require("sharp");

export const convertImageToThumbnail = async (
  imageBuffer,
  width = 50,
  height = 50
) => {
  let thumbnail, mimeType;
  const { data, info } = await sharp(imageBuffer)
    .resize(width, height)
    .toBuffer({
      resolveWithObject: true,
    });
  thumbnail = data;
  mimeType = info.format;
  return { thumbnail, mimeType };
};

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
        const document = applyPatch(jsonObject, jsonPatch).newDocument;

        // return result
        return jsonResponse(res, 200, { document });
      } catch (error) {
        return next(
          new CustomError(400, `JSON patching error: ${error.message}`)
        );
      }
    } catch (error) {
      return next(error);
    }
  },
  createThumbnail: async (req, res, next) => {
    const { imageUrl } = req.body;
    const { raw } = req.query;

    try {
      // validate url
      const error = validateURL(imageUrl);
      if (error) {
        throw new CustomError(400, "URL validation error", [error]);
      }

      // fetch image from url
      let imageBuffer;
      try {
        const response = await fetch(imageUrl);
        imageBuffer = await response.buffer();
      } catch (error) {
        throw new CustomError(400, `Error fetching image: ${error.message}`);
      }

      try {
        // convert imageBuffer to thumbnail and store in buffer
        const { thumbnail, mimeType } = await convertImageToThumbnail(
          imageBuffer
        );

        if (raw) {
          // return buffered thumbnail
          res.type(mimeType);
          return res.send(thumbnail);
        } else {
          const base64Thumbnail = thumbnail.toString("base64");
          return jsonResponse(res, 200, { base64Thumbnail });
        }
      } catch (error) {
        throw new CustomError(
          400,
          `Error creating thumbnail: ${error.message}`
        );
      }
    } catch (error) {
      return next(error);
    }
  },
};
