import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createEnrollmentWithAddress, createPayment, createTicket, createTicketType, createUser } from "../factories";
import * as jwt from 'jsonwebtoken';
import { cleanDb, generateValidToken } from "../helpers";
import { createHotel, createRoomWithHotelId } from "../factories/hotels-factory";
import { createBooking, createRoom } from "../factories/booking-factory";
import { TicketStatus } from "@prisma/client";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
})

const server = supertest(app);

describe('GET /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const result = await server.get('/booking');

        expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const result = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const result = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 404 when user has no booking', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const result = await server.get('/booking').set('Authorization', `Bearer ${token}`);

            expect(result.status).toEqual(httpStatus.NOT_FOUND);
        });
        it('should respond with status 200 with getBooking data', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);
            const booking = await createBooking(user.id, room.id);

            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.OK);

            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toEqual({
                id: booking.id,
                Room: {
                    id: room.id,
                    name: room.name,
                    hotelId: hotel.id,
                    capacity: room.capacity,
                    createdAt: room.createdAt.toISOString(),
                    updatedAt: room.updatedAt.toISOString(),
                },
            });
        });
    });

});

describe('POST /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
      const result = await server.post('/booking');
  
      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const result = await server.post('/booking').set('Authorization', `Bearer ${token}`);
  
      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const result = await server.post('/booking').set('Authorization', `Bearer ${token}`);
  
      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    describe('when token is valid', () => {
      it('should respond with status 403 when user ticket is remote ', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(true, true);
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
  
        const result = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
          roomId: room.id,
        });
  
        expect(result.status).toEqual(httpStatus.FORBIDDEN);
      });
  
      it('should respond with status 403 when ticket is not paid ', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
  
        const result = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
          roomId: room.id,
        });
  
        expect(result.status).toEqual(httpStatus.FORBIDDEN);
      });
  
      it('should respond with status 403 when ticket doenst include hotel', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, false);
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
  
        const result = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
          roomId: room.id,
        });
  
        expect(result.status).toEqual(httpStatus.FORBIDDEN);
      });
  
      it('should respond with status 404 when roomId doesnt exist', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, false);
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);
        await createHotel();
  
        const result = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
          roomId: 6564735,
        });
  
        expect(result.status).toEqual(httpStatus.FORBIDDEN);
      });
  
      it('should respond with status 403 when room doesnt have capacity', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, false);
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);
        const hotel = await createHotel();
        const room = await createRoom(hotel.id);
  
        const result = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
          roomId: room.id,
        });
  
        expect(result.status).toEqual(httpStatus.FORBIDDEN);
      });
  
      it('should respond with status 200 with postBooking', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
  
        const result = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({
          roomId: room.id,
        });
  
        expect(result.status).toBe(httpStatus.OK);
        expect(result.body).toEqual({
          bookingId: expect.any(Number),
          Room: {
            id: room.id,
            name: room.name,
            hotelId: hotel.id,
            capacity: room.capacity,
            createdAt: room.createdAt.toISOString(),
            updatedAt: room.updatedAt.toISOString(),
          },
        });
      });
    });
  });