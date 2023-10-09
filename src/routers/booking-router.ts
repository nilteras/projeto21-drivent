import { getBookings, postBooking, updateBookingById } from "@/controllers/booking.controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { Router } from "express";

const bookingsRouter = Router();

bookingsRouter
    .all('/*', authenticateToken)
    .get('/', getBookings)
    .post('/', postBooking)
    .put('/:bookingId', updateBookingById);

export { bookingsRouter };