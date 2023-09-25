import { getTickets, getTypeTickets, postTickets } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { schemaTicket } from "@/schemas/tickets-schemas";
import { Router } from "express"

const ticketsRouter = Router();

ticketsRouter
    .all('/*', authenticateToken)
    .get('/types', getTypeTickets)
    .get('/', getTickets)
    .post('/',validateBody(schemaTicket) , postTickets)

export { ticketsRouter }