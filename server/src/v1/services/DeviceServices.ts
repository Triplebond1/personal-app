import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import "dotenv/config";

class DeviceService {
  private prisma: PrismaClient;
  constructor() {
        const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL!,} );
    this.prisma = new PrismaClient({ adapter });
  }

  public isNewLogin = async (userId: string, userAgent: string, ipAddress: string,token:string) => { 
    const data = await this.prisma.userDevice.findFirst({
      where: {
        user_id: userId,
        user_agent: userAgent,
        ip_address: ipAddress,
      }
    })
    if (!data) {
      await this.prisma.userDevice.create({
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
    await this.prisma.userDevice.deleteMany({
      where: {
        user_id: userId,
        user_agent: userAgent,
        ip_address: ipAddress,
        refresh_token:token
      }
    })
  }

  public logoutAll = async (userId: string) => {
    await this.prisma.userDevice.deleteMany({
      where: {
        user_id: userId
      }
    })
  }

  public updateDeviceToken = async (userId: string, userAgent: string, ipAddress: string, token: string, newToken:string) => {
    const device = await this.prisma.userDevice.findFirst({
      where: {
        user_id: userId,
        user_agent: userAgent,
        ip_address: ipAddress,
        refresh_token:token
      }
    })

    if (!device) return this.isNewLogin(userId, userAgent, ipAddress, newToken);

    await this.prisma.userDevice.update({
      where: { id: device.id },
      data: {
        refresh_token: newToken
      }
    })
  }
}



export default DeviceService;