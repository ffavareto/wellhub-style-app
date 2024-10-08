import { expect, test, describe } from "vitest";
import { beforeEach } from "vitest";
import { CheckInUseCase } from "./check-in";
import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository";

describe("Check In Use Case", () => {
  let checkInsRepository: InMemoryCheckInsRepository;
  let sut: CheckInUseCase;

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInsRepository);
  });

  test("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
