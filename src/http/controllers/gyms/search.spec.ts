import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from "supertest";
import { app } from "../../../app";
import { createAndAuthenticateUser } from "../../../utils/test/create-and-authenticate-user";

describe("Search Gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("should be able to search gyms by title", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set({ authorization: `Bearer ${token}` })
      .send({
        title: "JavaScript Gym",
        description: "Some description",
        phone: "11999999999",
        latitude: -23.0079797,
        longitude: -46.8389705,
      });

    await request(app.server)
      .post("/gyms")
      .set({ authorization: `Bearer ${token}` })
      .send({
        title: "TypeScript Gym",
        description: "Some description",
        phone: "1188888888",
        latitude: -23.0079797,
        longitude: -46.8389705,
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .query({ query: "JavaScript" })
      .set({ authorization: `Bearer ${token}` })
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "JavaScript Gym",
      }),
    ]);
  });
});
