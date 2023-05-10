import Joi from "joi";

const customerSchema = Joi.object({
  name: Joi.string().required().empty().messages({
    "any.required": "O campo 'nome' é obrigatório.",
    "string.empty": "O campo 'nome' não pode estar vazio.",
  }),
  phone: Joi.string()
    .min(10)
    .max(11)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "any.required": "O campo 'telefone' é obrigatório.",
      "string.base": "O campo 'telefone' deve ser uma string.",
      "string.empty": "O campo 'telefone' não pode estar vazio.",
      "string.length": "O campo 'telefone' deve ter 10 ou 11 caracteres.",
      "string.pattern.base":
        "O campo 'telefone' deve conter apenas dígitos numéricos.",
    }),
  cpf: Joi.string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "any.required": "O campo 'cpf' é obrigatório.",
      "string.base": "O campo 'cpf' deve ser uma string.",
      "string.empty": "O campo 'cpf' não pode estar vazio.",
      "string.length": "O campo 'cpf' deve ter exatamente 11 caracteres.",
      "string.pattern.base":
        "O campo 'cpf' deve conter apenas dígitos numéricos.",
    }),
  birthday: Joi.date().required().messages({
    "any.required": "O campo 'data de nascimento' é obrigatório.",
    "date.base": "O campo 'data de nascimento' deve ser uma data válida.",
  }),
});

export default customerSchema;
