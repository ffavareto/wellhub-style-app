import { expect, test, describe } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { beforeEach } from "vitest";

describe("Register Use Case", () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: RegisterUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  test("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  test("should hash user password opon registration", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  test("should not be able to register with same email twice", async () => {
    const email = "johndoe@example.com";

    await sut.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    await expect(() => {
      return sut.execute({
        name: "John Doe",
        email,
        password: "123456",
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
