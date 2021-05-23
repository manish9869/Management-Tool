const { user } = require("./user.schema");

import * as ResponseHandler from "../helpers/response.handler";

export const addUserValidation = async (req, res, next) => {
  const value = await user.validate(req.body);

  if (value.error) {
    res.locals.errors = value.error.details[0].message;
    ResponseHandler.JSONERROR(req, res);
  } else {
    next();
  }
};
