import Joi from "joi";

export const registroSchema = Joi.object({
  data: Joi.date().required(),
  solds20: Joi.number().min(0).required().messages({
    "number.base": "solds20 dever conter apenas números.",
  }),
  solds15: Joi.number().min(0).required().messages({
    "number.base": "solds15 dever conter apenas números.",
  }),
  digitais: Joi.number().min(0).required().messages({
    "number.base": "digitais dever conter apenas números.",
  }),
  sobras: Joi.number().min(0).required().messages({
    "number.base": "sobras dever conter apenas números.",
  }),
});
