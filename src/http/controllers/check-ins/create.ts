import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCheckInUseCase } from "../../../use-cases/factories/make-check-in-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const createCheckInBodySchema = z.object({
    userLatitude: z.number().refine((v) => Math.abs(v) <= 90),
    userLongitude: z.number().refine((v) => Math.abs(v) <= 180),
  });

  const { userLatitude, userLongitude } = createCheckInBodySchema.parse(
    request.body
  );

  const { gymId } = createCheckInParamsSchema.parse(request.params);

  const checkInUseCase = makeCheckInUseCase();

  await checkInUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude,
    userLongitude,
  });

  return reply.status(201).send();
}
