import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from "supertest";
import { app } from "../../../app";
import { createAndAuthenticateUser } from "../../../utils/test/create-and-authenticate-user";

describe("Create Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("should be able to create a gym", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .post("/gyms")
      .set({ authorization: `Bearer ${token}` })
      .send({
        title: "JavaScript Gym",
        description: "Some description",
        phone: "11999999999",
        latitude: -23.0079797,
        longitude: -46.8389705,
      });

    expect(response.statusCode).toEqual(201);
  });
});
