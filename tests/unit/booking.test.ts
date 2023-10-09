import { bookingsRepository } from "@/repositories/booking-repository";
import { bookingsService } from "@/services/booking-service";
import faker from "@faker-js/faker";
import { Booking, Room } from "@prisma/client";

beforeEach(() => {
    jest.clearAllMocks();
});

describe('GET /booking', () => {
    it('should return 404 when user doesnt have a booking', async () => {
      jest.spyOn(bookingsRepository, 'getBookingsDB').mockResolvedValueOnce(null);
      
      const promise = bookingsService.getBookings(4);
      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!'
      });
    });
    it('should return getBookings data', async () => {
        const mockBooking: Booking & {
            Room: Room;
        } = {
            id: 1,
            userId: 1,
            roomId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            Room: {
                id: 1,
                capacity: 2,
                hotelId: 1,
                createdAt: new Date(),
            updatedAt: new Date(),
            name: faker.name.firstName()
            }
        };

        jest.spyOn(bookingsRepository, 'getBookingsDB').mockResolvedValueOnce(mockBooking);
        const bookData = await bookingsService.getBookings(mockBooking.userId);
        expect(bookData).toEqual({
            id: mockBooking.id,
            Room: {
                id: mockBooking.id,
                capacity: mockBooking.Room.capacity,
                hotelId: mockBooking.Room.hotelId,
                name: mockBooking.Room.name,
                createdAt: mockBooking.Room.createdAt,
                updatedAt: mockBooking.Room.updatedAt
            }
        });
    });
});