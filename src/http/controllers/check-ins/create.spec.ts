import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from "supertest";
import { app } from "../../../app";
import { createAndAuthenticateUser } from "../../../utils/test/create-and-authenticate-user";
import { prisma } from "../../../lib/prisma";

describe("Create Check-In (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("should be able to create a check-in", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: "JavaScript Gym",
        latitude: -23.0079797,
        longitude: -46.8389705,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set({ authorization: `Bearer ${token}` })
      .send({
        userLatitude: -23.0079797,
        userLongitude: -46.8389705,
      });

    expect(response.statusCode).toEqual(201);
  });
});
