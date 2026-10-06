import { Module } from '@nestjs/common';

import { MallBookingController, MallHealthController, MallOrderController, MallProductController, MallWeatherController } from './mall.controller';
import { MallTraceController } from './mall-trace.controller';
import { MallUserController } from './mall-user.controller';
import { MallCatalogService } from './mall-catalog.service';
import { MallTraceService } from './mall-trace.service';
import { MallTradeService } from './mall-trade.service';
import { MallUserService } from './mall-user.service';

/**
 * C 端 · 农资自营商城域（自 E:\repo\zymall 于 2026-10 并入）。
 *
 *   products  商品目录      GET  /api/products · /api/products/:id
 *   trace     溯源码验真    POST /api/trace/verify · GET /api/trace/history
 *   bookings  上门服务预约  GET/POST /api/bookings
 *   orders    商城下单      POST /api/orders
 *   health    商城健康检查  GET  /api/health
 *   weather   飞防气象指数  GET  /api/weather
 *   user      我的 / 消息   GET  /api/user/{profile,announcements,coupons}（本期均未接入，返回预留标识）
 *
 * 分层：controller（HTTP 形状）→ service（业务逻辑）→ 仓储（全局 DatabaseModule）。
 */
@Module({
  controllers: [
    MallProductController,
    MallTraceController,
    MallBookingController,
    MallOrderController,
    MallHealthController,
    MallWeatherController,
    MallUserController,
  ],
  providers: [MallCatalogService, MallTraceService, MallTradeService, MallUserService],
})
export class MallModule {}
