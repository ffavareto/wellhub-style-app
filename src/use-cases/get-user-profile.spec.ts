import { expect, test, describe, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { hashSync } from "bcryptjs";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

describe("Get User Profile Use Case", () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: GetUserProfileUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  test("should be able to get user profile", async () => {
    const createdUser = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: hashSync("123456", 6),
    });

    const { user } = await sut.execute({ userId: createdUser.id });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual("John Doe");
    expect(user.email).toEqual("johndoe@example.com");
  });

  test("should not be able to get user profile with wrong id", async () => {
    await expect(() => {
      return sut.execute({
        userId: "not-existing-id",
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
