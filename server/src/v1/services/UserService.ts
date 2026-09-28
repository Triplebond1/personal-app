import { NewUser, User } from "../types";
import { prisma} from "../lib/prisma";
import "dotenv/config";


class UserService {
  constructor() { }

  public createUser = async (data:NewUser) => {
    return prisma.user.create({
      data
    });
  }

  public getUserByMail = async (email: string) => {
    return prisma.user.findUniqueOrThrow({
      where: {
        email
      }
    })
  }

  public findById = async (id: string) => {
    return await prisma.user.findUniqueOrThrow({
      where: {
        id
      }
    })
  }

  public findByPasswordToken = async (password_token: string) => {
    return await prisma.user.findFirstOrThrow({
      where: {
        reset_password_token: password_token
      }
    })
  }

  public findByVerificationCode = async (verification_code: string) => {
    return await prisma.user.findFirstOrThrow({
      where: {
        verification_code
      }
    })
  }

  public delete = async (id: string) => {
    return await prisma.user.delete({
      where: {
        id
      }
    })
  }

  public update = async (id: string, data:User) => {
    return await prisma.user.update({
      where: {
        id
      },
      data
    })
  }
}


export default UserService;