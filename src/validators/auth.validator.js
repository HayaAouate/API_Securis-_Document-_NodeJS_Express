const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': "L'email doit être valide",
    'any.required': "L'email est requis"
  }),
  password: Joi.string().pattern(new RegExp('^(?=.*[A-Z])(?=.*\\d).{8,}$')).required().messages({
    'string.pattern.base': "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.",
    'any.required': "Le mot de passe est requis"
  }),
  first_name: Joi.string().min(2).max(80).required(),
  last_name: Joi.string().min(2).max(80).required(),
  role: Joi.string().valid('learner', 'trainer').required().messages({
    'any.only': "Le rôle doit être 'learner' ou 'trainer'"
  }),
  bio: Joi.string().max(500).optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().required()
});

module.exports = {
  registerSchema,
  loginSchema
};
