import { AuthenticatedRequest } from "@/middlewares";
import { hotelsService } from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

async function getAllHotels(req: AuthenticatedRequest, res: Response){
    const { userId } = req;
    const resultHotels = await hotelsService.getAllHotels(userId);
    res.status(httpStatus.OK).send(resultHotels);
}

async function getHotelById(req: AuthenticatedRequest, res: Response){
    const { userId } = req;
    const hotelId = Number(req.params.hotelId);

    const resultHotel = await hotelsService.getHotelById(userId, hotelId);
    res.status(httpStatus.OK).send(resultHotel);
}

export const hotelsController = {
    getAllHotels,
    getHotelById
}