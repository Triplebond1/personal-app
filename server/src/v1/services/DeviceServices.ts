import { prisma } from "../lib/prisma";
import "dotenv/config";

class DeviceService {

  constructor() { }

  public isNewLogin = async (userId: string, userAgent: string, ipAddress: string,token:string) => { 
    const data = await prisma.userDevice.findFirst({
      where: {
        user_id: userId,
        user_agent: userAgent,
        ip_address: ipAddress,
      }
    })
    if (!data) {
      await prisma.userDevice.create({
        data: {
          user_id: userId,
          user_agent: userAgent,
          ip_address: ipAddress,
          refresh_token:token
        }
      })
      return true;
    }
    return false;
  }

  public logout = async (userId: string, userAgent: string, ipAddress: string, token:string) => {
    await prisma.userDevice.deleteMany({
      where: {
        user_id: userId,
        user_agent: userAgent,
        ip_address: ipAddress,
        refresh_token:token
      }
    })
  }

  public logoutAll = async (userId: string) => {
    await prisma.userDevice.deleteMany({
      where: {
        user_id: userId
      }
    })
  }

  public updateDeviceToken = async (userId: string, userAgent: string, ipAddress: string, token: string, newToken:string) => {
    const device = await prisma.userDevice.findFirst({
      where: {
        user_id: userId,
        user_agent: userAgent,
        ip_address: ipAddress,
        refresh_token:token
      }
    })

    if (!device) return this.isNewLogin(userId, userAgent, ipAddress, newToken);

    await prisma.userDevice.update({
      where: { id: device.id },
      data: {
        refresh_token: newToken
      }
    })
  }
}



export default DeviceService;