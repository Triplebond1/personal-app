import { PrismaClient } from "@prisma/client";
import { NewUser, User } from "../types";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";


class UserService {
  private prisma: PrismaClient
  constructor() {
        const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL!,} );
    this.prisma = new PrismaClient({ adapter });
  }

  public createUser = async (data:NewUser) => {
    return this.prisma.user.create({
      data
    });
  }

  public getUserByMail = async (email: string) => {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        email
      }
    })
  }

  public findById = async (id: string) => {
    return await this.prisma.user.findUniqueOrThrow({
      where: {
        id
      }
    })
  }

  public findByPasswordToken = async (password_token: string) => {
    return await this.prisma.user.findFirstOrThrow({
      where: {
        reset_password_token: password_token
      }
    })
  }

  public findByVerificationCode = async (verification_code: string) => {
    return await this.prisma.user.findFirstOrThrow({
      where: {
        verification_code
      }
    })
  }

  public delete = async (id: string) => {
    return await this.prisma.user.delete({
      where: {
        id
      }
    })
  }

  public update = async (id: string, data:User) => {
    return await this.prisma.user.update({
      where: {
        id
      },
      data
    })
  }
}


export default UserService;