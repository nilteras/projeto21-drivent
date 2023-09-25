import { notFoundError } from "@/errors";
import { ticketsRepository } from "@/repositories/tickets-repository";
import { TicketStatus } from "@prisma/client";

async function getTypeTickets(){
    const typeTickets = await ticketsRepository.getTypeTicketsDB();

    return typeTickets
}

async function getTickets(userId: number){
    const resultEnrollment = await ticketsRepository.userEnrollmentDB(userId)
    if(!resultEnrollment) throw notFoundError()

    const resultTicket = await ticketsRepository.userEnrollmentNoTicketDB(resultEnrollment.id)
    if(!resultTicket) throw notFoundError()

    return resultTicket
}

async function postTickets(userId: number, ticketTypeId: number){
    const enrollment = await ticketsRepository.userEnrollmentDB(userId)
    if(!enrollment) throw notFoundError()

    const ticketData = {
        ticketTypeId,
        enrollmentId: enrollment.id,
        status: TicketStatus.RESERVED,
    }

    await ticketsRepository.postTicketsDB(ticketData)

    const ticket = await ticketsRepository.userEnrollmentNoTicketDB(enrollment.id)
    return ticket

}

export const ticketsService = {
    getTypeTickets,
    getTickets,
    postTickets
}