import { notFoundError } from "@/errors";
import { forbiddenError } from "@/errors/forbidden-error";
import { enrollmentRepository, ticketsRepository } from "@/repositories";
import { bookingsRepository } from "@/repositories/booking-repository";
import { TicketStatus } from "@prisma/client";


async function createBooking(userId: number, roomId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    const type = ticket.TicketType;

    if (ticket.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel) {
        throw forbiddenError();
    }

    await capacityRoom(roomId);

    const result = await bookingsRepository.createBookingDB(userId, roomId);

    const booking = {
        bookingId: result.id,
        Room: result.Room
    };

    return booking;
}

async function getBookings(userId: number) {
    const result = await bookingsRepository.getBookingsDB(userId);
    if (!result) throw notFoundError();

    const booking = {
        id: result.id,
        Room: result.Room
    };

    return booking;
}

async function updateBooking(userId: number, bookingId: number, roomId: number) {
    const userBooking = await bookingsRepository.getBookingsDB(userId);
    if (!userBooking || userBooking.id !== bookingId) throw forbiddenError();
    
    await capacityRoom(roomId);

    const result = await bookingsRepository.updateBookingDB(bookingId, roomId);

    const booking = {
        bookingId: result.id,
        Room: result.Room
    };

    return booking;
}

async function capacityRoom(roomId: number) {
    const room = await bookingsRepository.getRoomIdDB(roomId);
    if (!room) throw notFoundError();
    if (room.capacity <= room.Booking.length) throw forbiddenError();
}

export const bookingsService = {
    createBooking,
    getBookings,
    updateBooking
}