import { prisma } from "@/config";


async function createBookingDB(userId: number, roomId: number) {
    return prisma.booking.create({
        data: {
            userId,
            roomId
        },
        include: {
            Room: true
        }
    });
}

async function getBookingsDB(userId: number){
    return prisma.booking.findFirst({
        where: {
            User: {
                id: userId
            }
        },
        include: {
            Room: true
        }
    });
}

async function getRoomIdDB(roomId: number) {
    const room = await prisma.room.findFirst({
        where: {
            id: roomId
        },
        include: {
            Booking: true
        }
    });

    return room;
}

async function updateBookingDB(bookingId: number, roomId: number) {
    return prisma.booking.update({
        where: {
            id: bookingId
        },
        data: {
            roomId
        },
        include: {
            Room: true
        }
    });
}

export const bookingsRepository = {
    createBookingDB,
    getBookingsDB,
    getRoomIdDB,
    updateBookingDB
}