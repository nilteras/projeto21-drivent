import joi from 'joi'

export const schemaTicket = joi.object({
    ticketTypeId: joi.number().required()
})