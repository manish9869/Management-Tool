import * as joi from "joi";
const schema = {
  user: joi.object({
    name: joi.string().max(100).required(),
    username: joi.string().max(100).required(),
    email: joi
      .string()
      .email()
      .message("Please enter a valid Email")
      .required(),
    password: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    role_id: joi
      .number()
      .integer()
      .min(1)
      .message("Role Id must be grester than 0")
      .max(10)
      .message("Role Id must be less than 10")
      .required(),
    profile_img: joi.string().allow(null).max(100),
  }),
};
module.exports = schema;
