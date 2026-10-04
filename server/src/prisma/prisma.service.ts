import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma 客户端封装。
 *
 * ⚠️ 目前只用于**基础设施验证**：数据库里还没有任何业务表（见 prisma/schema.prisma 顶部说明）。
 * 业务仓储会在需求确认、数据模型稳定后，按 `server/src/modules/<域>/` 逐个落地。
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('数据库已连接');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  /**
   * 连通性探测：不依赖任何业务表，供健康检查使用。
   * @returns 数据库是否可用；失败只记录日志，不抛出，避免健康检查本身把服务打挂。
   */
  async ping(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.warn(`数据库连通性探测失败：${(error as Error).message}`);
      return false;
    }
  }
}
