import { Controller, Get } from '@nestjs/common';

import { PrismaService } from './prisma/prisma.service';

/**
 * 健康检查：`GET /api/_health`
 *
 * 用 `_` 前缀是为了避开旧 Mock 的 `/health`（技师端 legacy 路由里有一个）。
 *
 * 这个端点同时充当两项基础设施的活体证明：
 * 1. **NestJS 依赖注入**——`PrismaService` 是通过构造函数注入的，能注入成功即说明
 *    `emitDecoratorMetadata` 产出的 `design:paramtypes` 元数据是正确的（TS 7 与 TS 6 都验过）。
 * 2. **数据库连通性**——`ping()` 走 `SELECT 1`，不依赖任何业务表。
 */
@Controller('_health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    const databaseReachable = await this.prisma.ping();

    return {
      status: databaseReachable ? 'ok' : 'degraded',
      service: '华农智服 · 统一后端（企业后台 + 技师端）',
      stage: '迁移期：NestJS 骨架 + 旧 Mock 路由临时挂载',
      database: {
        engine: 'sqlite（开发）/ postgresql（生产目标）',
        reachable: databaseReachable,
        note: '尚无业务表——数据模型待客户确认需求后落地',
      },
      timestamp: new Date().toISOString(),
    };
  }
}
