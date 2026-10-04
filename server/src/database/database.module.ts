import { Global, Module } from '@nestjs/common';

import { AdminOrderRepository } from './repositories/admin-order.repository';
import { AdminTechnicianRepository } from './repositories/admin-technician.repository';
import { AuditRepository } from './repositories/audit.repository';
import {
  MallOrderRepository,
  MallProductRepository,
  ServiceBookingRepository,
  TraceLedgerRepository,
} from './repositories/mall.repository';
import {
  FulfillmentEventRepository,
  SettlementRepository,
} from './repositories/settlement.repository';
import { PesticideCatalogRepository, SupplyRepository } from './repositories/supply.repository';
import { TechnicianOrderRepository } from './repositories/technician-order.repository';
import {
  TechnicianEarningRepository,
  TechnicianProfileRepository,
} from './repositories/technician-self.repository';

/**
 * 数据访问层（全局可注入）。
 *
 * 分层约定：
 *   控制器 → 仓储 → PrismaService → 数据库
 * 控制器里**不应出现 Prisma 类型或「分」这样的存储细节**；单位换算只在 `mappers.ts`。
 *
 * ⚠️ 过渡期已知性质（真实查询需求确认后要改）：
 *   · `list()` 取全表，查询过滤仍在控制器里用 JS 做——为的是与原型**语义完全一致**。
 *     直接下推 SQL 会有静默行为差异（SQLite 的 `LIKE` 对 ASCII 大小写不敏感，
 *     而原型用大小写敏感的 `String.includes`）。下推时**必须补带查询参数的回归用例**。
 *   · 单县试点 30–50 技师、工单量小，全表加载在这个阶段不构成问题。
 */
const REPOSITORIES = [
  AdminOrderRepository,
  AdminTechnicianRepository,
  AuditRepository,
  SupplyRepository,
  PesticideCatalogRepository,
  SettlementRepository,
  FulfillmentEventRepository,
  TechnicianOrderRepository,
  TechnicianProfileRepository,
  TechnicianEarningRepository,
  MallProductRepository,
  TraceLedgerRepository,
  ServiceBookingRepository,
  MallOrderRepository,
];

@Global()
@Module({
  providers: REPOSITORIES,
  exports: REPOSITORIES,
})
export class DatabaseModule {}
