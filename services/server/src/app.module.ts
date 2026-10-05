import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { HealthController } from './health.controller';
import { AmoebaModule } from './modules/amoeba/amoeba.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { MallModule } from './modules/mall/mall.module';
import { OrderModule } from './modules/order/order.module';
import { QualificationModule } from './modules/qualification/qualification.module';
import { SupplyChainModule } from './modules/supply-chain/supply-chain.module';
import { SystemModule } from './modules/system/system.module';
import { TechnicianModule } from './modules/technician/technician.module';
import { PrismaModule } from './prisma/prisma.module';

/**
 * 统一后端根模块（同时服务企业后台、技师端与 C 端商城）。
 *
 * 模块按**业务域**划分，企业后台与技师端是同一业务域的两个视图，
 * 因此各自用一个 controller 区分端的入口（见根目录 AGENTS.md 的迁移规则）。
 *
 *   modules/dashboard      运营总览       GET  /api/stats
 *   modules/order          工单与派单     /api/orders/*  +  /api/tech/orders/*
 *   modules/technician     技师与名册     /api/technicians/*  +  /api/tech/technician
 *   modules/qualification  资质审核       /api/audits/*
 *   modules/supply-chain   农资与溯源     /api/supply-chain/*  +  /api/tech/pesticides/*
 *   modules/amoeba         分红与结算     /api/amoeba/*  +  /api/tech/amoeba/*
 *   modules/system         监管同步与健康 /api/sync/ministry  +  /api/tech/health
 *   modules/mall           C 端商城       /api/{products,trace,bookings,orders,weather}
 *
 * 数据层现状：
 * - `DatabaseModule` 提供按业务域划分的**仓储**，数据落在 Prisma（开发期 SQLite）
 * - ⚠️ schema 是 **v0 临时版，源自原型数据形状，待客户确认需求后修订**
 *   （见 `prisma/schema.prisma` 顶部与 AGENTS.md 的「前提状态」）
 */
@Module({
  imports: [
    PrismaModule,
    DatabaseModule,
    DashboardModule,
    OrderModule,
    TechnicianModule,
    QualificationModule,
    SupplyChainModule,
    AmoebaModule,
    SystemModule,
    MallModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
