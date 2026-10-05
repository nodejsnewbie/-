import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

/**
 * 统一后端入口：同时服务企业后台、技师端与 C 端商城。
 *
 * 全部路由由 NestJS 模块提供（global prefix = `api`）：
 *   /api/_health                     健康检查（含数据库连通性）
 *   /api/stats …                     企业后台
 *   /api/tech/*                      技师端
 *   /api/{products,trace,bookings,orders,weather}   C 端商城
 *
 * 历史上这里有一步「把两套旧 Express Mock 路由以中间件临时挂载」的过渡期做法，
 * 现已全部迁入 `src/modules/*`，`src/legacy/` 目录已删除。
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0');

  console.log(`[华农智服] 统一后端已启动: http://127.0.0.1:${port}`);
  console.log('[路由] 企业后台: /api/{stats,orders,technicians,audits,supply-chain,amoeba,sync}');
  console.log('[路由] 技师端  : /api/tech/{orders,technician,pesticides,amoeba,health}');
  console.log('[路由] C 端商城: /api/{products,trace,bookings,orders,weather}');
}

void bootstrap();
