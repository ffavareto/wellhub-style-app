import { expect, test, describe, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

describe("Fetch Nearby Gyms Use Case", () => {
  let gymsRepository: InMemoryGymsRepository;
  let sut: FetchNearbyGymsUseCase;

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  test("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      latitude: -23.0079797,
      longitude: -46.8389705,
    });

    await gymsRepository.create({
      title: "Far Gym",
      description: null,
      phone: null,
      latitude: -23.5674864,
      longitude: -46.6517988,
    });

    const { gyms } = await sut.execute({
      userLatitude: -23.0079797,
      userLongitude: -46.8389705,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
