import { notFoundError } from "@/errors";
import { enrollmentRepository, ticketsRepository } from "@/repositories";
import { hotelsRepository } from "@/repositories/hotels-repository";
import { PAYMENT_REQUIRED } from "http-status";

async function getAllHotels(userId: number){
  
    const enrollmentExist = await enrollmentRepository.findWithAddressByUserId(userId);
    if(!enrollmentExist) throw notFoundError();
    
    const ticketExist = await ticketsRepository.findTicketByEnrollmentId(enrollmentExist.id);
    if(!ticketExist) throw notFoundError();
    
    if(ticketExist.status !== 'PAID' || 
    ticketExist.TicketType.isRemote === true ||
    ticketExist.TicketType.includesHotel === false) throw PAYMENT_REQUIRED;

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
    ticketExist.TicketType.includesHotel === false) throw PAYMENT_REQUIRED;

    const resultHotel = await hotelsRepository.getHotelByIdDB(hotelId);

    return resultHotel;

}

export const hotelsService = {
    getAllHotels,
    getHotelById
}