import { AuthenticatedRequest } from "@/middlewares";
import { bookingsService } from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBookings(req: AuthenticatedRequest, res: Response){
    const { userId } = req;

    const bookings = await bookingsService.getBookings(userId);

    res.status(httpStatus.OK).send(bookings);
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body;

    const booking = await bookingsService.createBooking(userId, roomId);

    return res.status(httpStatus.OK).send(booking);
}

export async function updateBookingById(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const bookingId = parseInt(req.params.bookingId);
    const { roomId } = req.body;

    const booking = await bookingsService.updateBooking(userId, bookingId, roomId);

    return res.status(httpStatus.OK).send(booking);
}