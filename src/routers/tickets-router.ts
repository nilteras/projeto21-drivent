import { getTickets, getTypeTickets, postTickets } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express"

const ticketsRouter = Router();

ticketsRouter
    .all('/*', authenticateToken)
    .get('/types', getTypeTickets)
    .get('/', getTickets)
    .post('/', postTickets)

export { ticketsRouter }