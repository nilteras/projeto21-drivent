import { notFoundError } from "@/errors";
import { forbiddenError } from "@/errors/forbidden-error";
import { bookingsRepository } from "@/repositories/booking-repository";


async function createBooking(userId: number, roomId: number){

    const result = await bookingsRepository.createBookingDB(userId, roomId);

    const booking = {
        bookingId: result.id,
        Room: result.Room
    };

    return booking;
}

async function getBookings(userId: number){
    const result = await bookingsRepository.getBookingsDB(userId);
    if(!result) throw notFoundError();

    const booking = {
        id: result.id,
        Room: result.Room
    };

    return booking;
}

async function updateBooking(userId: number, bookingId: number, roomId: number){
    const userBooking = await bookingsRepository.getBookingsDB(userId);
     if(!userBooking || userBooking.id !== bookingId) throw forbiddenError(); 

     const result = await bookingsRepository.updateBookingDB(bookingId, roomId);

     const booking = {
        bookingId: result.id,
        Room: result.Room 
     };

     return booking;
}

export const bookingsService = {
    createBooking,
    getBookings,
    updateBooking
}