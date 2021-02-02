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
