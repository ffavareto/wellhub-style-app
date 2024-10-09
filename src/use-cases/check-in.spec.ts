import { expect, test, describe, beforeEach, vi, afterEach } from "vitest";
import { CheckInUseCase } from "./check-in";
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";

describe("Check In Use Case", () => {
  let checkInsRepository: InMemoryCheckInsRepository;
  let gymsRepository: InMemoryGymsRepository;
  let sut: CheckInUseCase;

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gymsRepository.gyms.push({
      id: "gym-01",
      title: "JavaScript Gym",
      description: "",
      latitude: new Decimal(-23.0925916),
      longitude: new Decimal(-46.893154),
      phone: "",
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.0925916,
      userLongitude: -46.893154,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  test("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.0925916,
      userLongitude: -46.893154,
    });

    await expect(() => {
      return sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -23.0925916,
        userLongitude: -46.893154,
      });
    }).rejects.toBeInstanceOf(Error);
  });

  test("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.0925916,
      userLongitude: -46.893154,
    });

    vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.0925916,
      userLongitude: -46.893154,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  test("should not be able to check in on distant gym", async () => {
    gymsRepository.gyms.push({
      id: "gym-02",
      title: "JavaScript Gym",
      description: "",
      latitude: new Decimal(-23.0079797),
      longitude: new Decimal(-46.8389705),
      phone: "",
    });

    await expect(() => {
      return sut.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: -23.0925916,
        userLongitude: -46.893154,
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
