import { expect, test, describe, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

describe("Authenticate Use Case", () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: AuthenticateUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  test("should be able to authenticate", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  test("should not be able to authenticate with wrong email", async () => {
    await expect(() => {
      return sut.execute({
        email: "johndoe@example.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  test("should not be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() => {
      return sut.execute({
        email: "johndoe@example.com",
        password: "123123",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
