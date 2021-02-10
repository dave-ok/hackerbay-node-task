import jwt from "jsonwebtoken";

export const generateToken = (payload) => {
  const secretPhrase = Buffer.from(
    process.env.JWT_SECRET || "My Super-Duper Secret",
    "base64"
  );
  const token = jwt.sign({ payload }, secretPhrase, { expiresIn: "24h" });

  return token;
};

export const makeRandomId = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
