import { Module } from '@nestjs/common';

import { AdminOrderController } from './admin-order.controller';
import { AdminOrderService } from './admin-order.service';
import { TechnicianOrderController } from './technician-order.controller';
import { TechnicianOrderService } from './technician-order.service';

/**
 * 工单域：企业后台与技师端是**同一业务域的两个视图**，所以放同一个模块，
 * 各用一个 controller 区分端的入口（见 AGENTS.md 的迁移规则）。
 */
@Module({
  controllers: [AdminOrderController, TechnicianOrderController],
  providers: [AdminOrderService, TechnicianOrderService],
})
export class OrderModule {}
