import { getBookings, postBooking, updateBookingById } from "@/controllers/booking-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { bookingsSchema } from "@/schemas/booking-schemas";
import { Router } from "express";

const bookingsRouter = Router();

bookingsRouter
    .all('/*', authenticateToken)
    .get('/', getBookings)
    .post('/',validateBody(bookingsSchema), postBooking)
    .put('/:bookingId',validateBody(bookingsSchema), updateBookingById);

export { bookingsRouter };