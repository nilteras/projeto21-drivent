import { ticketsService } from "@/services/tickets-service";
import httpStatus from "http-status";
import { Request, Response } from "express";
import { CreateTicket } from "@/repositories/tickets-repository";
import { invalidDataError } from "@/errors";
import { AuthenticatedRequest } from "@/middlewares";

export async function getTypeTickets(req: AuthenticatedRequest, res: Response) {
    const typeTickets = await ticketsService.getTypeTickets()

    return res.status(httpStatus.OK).send(typeTickets)
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
   const tickets = await ticketsService.getTickets(req.userId)

    return res.status(httpStatus.OK).send(tickets)
}

export async function postTickets(req: AuthenticatedRequest, res: Response) {
    const { ticketTypeId } = req.body as CreateTicket
    if(!ticketTypeId) throw invalidDataError('TicketTypeId não enviado')

    const resultPost = await ticketsService.postTickets(req.userId, ticketTypeId)

    return res.status(httpStatus.CREATED).send(resultPost)
}