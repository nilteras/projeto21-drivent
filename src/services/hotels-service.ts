import { notFoundError } from "@/errors";
import { PaymentRequired } from "@/errors/payment-required-error";
import { enrollmentRepository, ticketsRepository } from "@/repositories";
import { hotelsRepository } from "@/repositories/hotels-repository";

async function getAllHotels(userId: number){
  
    const enrollmentExist = await enrollmentRepository.findWithAddressByUserId(userId);
    if(!enrollmentExist) throw notFoundError();
    
    const ticketExist = await ticketsRepository.findTicketByEnrollmentId(enrollmentExist.id);
    if(!ticketExist) throw notFoundError();
    
    if(ticketExist.status !== 'PAID' || 
    ticketExist.TicketType.isRemote === true ||
    ticketExist.TicketType.includesHotel === false) throw PaymentRequired();

    const hotels = await hotelsRepository.getAllHotelsDB();
    if(!hotels || hotels.length === 0) throw notFoundError();

    return hotels;
}

async function getHotelById(userId: number, hotelId: number){
    const enrollmentExist = await enrollmentRepository.findWithAddressByUserId(userId);
    if(!enrollmentExist) throw notFoundError();

    const ticketExist = await ticketsRepository.findTicketByEnrollmentId(enrollmentExist.id);
    if(!ticketExist) throw notFoundError();

    if(ticketExist.status !== 'PAID' || 
    ticketExist.TicketType.isRemote === true ||
    ticketExist.TicketType.includesHotel === false) throw PaymentRequired();

    const resultHotel = await hotelsRepository.getHotelByIdDB(hotelId);

    return resultHotel;

}

export const hotelsService = {
    getAllHotels,
    getHotelById
}