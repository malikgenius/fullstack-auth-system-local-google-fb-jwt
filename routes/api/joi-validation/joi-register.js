const Joi = require('joi');

module.exports = function registerValidation(data, res) {
  const { name, email, password, photo } = data;
  const schema = {
    name: Joi.string()
      .regex(/^[a-zA-Z-0-9_ ]{3,30}$/)
      .min(3)
      .max(50)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .regex(/^[a-zA-Z-0-9]{6,50}$/)
      .required(),
    photo: Joi.string()
  };

  const Validate = Joi.validate(data, schema);
  if (Validate.error) {
    return res.status(400).send(Validate.error.details[0].message);
  }
};
