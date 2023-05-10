import Joi from "joi";

const gameSchema = Joi.object({
  name: Joi.string().required().empty().messages({
    "any.required": "O campo 'nome' é obrigatório.",
    "string.empty": "O campo 'nome' não pode estar vazio.",
  }),
  image: Joi.string().required().empty().messages({
    "any.required": "O campo 'imagem' deve ser uma string.",
    "string.empty": "O campo 'imagem' não pode estar vazio."
  }),
  stockTotal: Joi.number().min(1).required().messages({
    "any.required": "O campo 'estoque' é obrigatório.",
    "number.min": "O campo 'estoque' deve ser maior que 0.",
  }),
  pricePerDay: Joi.number().min(1).required().messages({
    "any.required": "O campo 'preçoPorDia' é obrigatório.",
    "number.min": "O campo 'preçoPorDia' deve ser maior que 0.",
  })
});

export default gameSchema;
