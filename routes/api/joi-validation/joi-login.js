const Joi = require('joi');

module.exports = function loginValidation(data, res) {
  const { name, email, password, photo } = data;
  const schema = {
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .regex(/^[a-zA-Z-0-9]{6,50}$/)
      .required()
  };

  const Validate = Joi.validate(data, schema);
  if (Validate.error) {
    return res.status(400).send(Validate.error.details[0].message);
  }
};
