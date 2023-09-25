import { prisma } from "@/config";
import { Ticket, TicketType } from "@prisma/client";


export type CreateTicket = Omit<Ticket, 'id'>
export type CreateTicketPost = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>


async function getTypeTicketsDB(): Promise<TicketType[]> {
    const result = await prisma.ticketType.findMany()

    return result;
}

async function userEnrollmentDB(userId: number){
    return await prisma.enrollment.findUnique({
        where: {
            userId,
        },
    })
}

async function userEnrollmentNoTicketDB(enrollmentId: number){
    return await prisma.ticket.findUnique({
        where: {
            enrollmentId,
        },
        include: {
            TicketType: true,
        },
    })
}

async function postTicketsDB(ticket: CreateTicketPost) {
    return prisma.ticket.create({
        data: {
            ...ticket,
        },
    })
}

export const ticketsRepository = {
    getTypeTicketsDB,
    userEnrollmentDB,
    userEnrollmentNoTicketDB,
    postTicketsDB
}