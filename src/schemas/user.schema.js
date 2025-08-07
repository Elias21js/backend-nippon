import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().min(2).max(10).required().messages({
    "string.empty": "O nome é obrigatório!",
    "string.min": "O nome deve ter pelo menos {#limit} caracteres.",
    "any.required": "O nome é obrigatório!",
  }),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]+$/)
    .min(6)
    .max(20)
    .required()
    .messages({
      "string.pattern.base": "A senha só pode conter letras ou números (ou os dois)! Nada de símbolos esquisitos 😡",
      "string.min": "A senha deve ter no mínimo {#limit} caracteres!",
      "string.max": "A senha pode ter no máximo {#limit} caracteres!",
      "string.empty": "Senha não pode ser vazia, né campeão?",
    }),
});
