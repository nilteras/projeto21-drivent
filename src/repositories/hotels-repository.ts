import { prisma } from "@/config";

async function getAllHotelsDB() {
    return prisma.hotel.findMany();
}

async function getHotelByIdDB(id: number) {
    const result = await prisma.hotel.findUnique({
        where: { id },
        include: { Rooms: true },
    });

    return result;
}

export const hotelsRepository = {
    getAllHotelsDB,
    getHotelByIdDB
}