import { User, Prisma } from "@prisma/client";
import { UsersRepository } from "../users-repository";
import { randomUUID } from "node:crypto";

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = [];

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;

    return user;
  }

  async findByEmail(email: string) {
    const user = this.users.find((u) => u.email === email);
    if (!user) return null;

    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.users.push(user);

    return user;
  }
}
