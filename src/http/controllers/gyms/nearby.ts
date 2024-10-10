import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeFetchNearbyGymsUseCase } from "../../../use-cases/factories/make-fetch-nearby-gyms-use-case";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const fetchNearbyGymsQuerySchema = z.object({
    userLatitude: z.coerce.number().refine((v) => Math.abs(v) <= 90),
    userLongitude: z.coerce.number().refine((v) => Math.abs(v) <= 180),
  });

  const { userLatitude, userLongitude } = fetchNearbyGymsQuerySchema.parse(
    request.query
  );

  const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase();

  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userLatitude,
    userLongitude,
  });

  return reply.status(200).send({ gyms });
}
