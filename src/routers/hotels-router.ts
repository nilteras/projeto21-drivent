import { hotelsController } from "@/controllers/hotels-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const hotelsRouter = Router();

hotelsRouter
    .all("/*", authenticateToken)
    .get("/", hotelsController.getAllHotels)
    .get("/:hotelId", hotelsController.getHotelById);

export { hotelsRouter };