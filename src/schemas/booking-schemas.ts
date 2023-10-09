import Joi from "joi";

export const bookingsSchema = Joi.object({
    roomId: Joi.number().required()
});