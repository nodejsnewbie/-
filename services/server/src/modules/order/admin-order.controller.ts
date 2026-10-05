import { Body, Controller, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';

import { AdminOrderService } from './admin-order.service';

/** 企业后台的工单与派单接口。业务逻辑在 AdminOrderService（404 形状保持 `{ error }`）。 */
@Controller('orders')
export class AdminOrderController {
  constructor(private readonly orders: AdminOrderService) {}

  @Get()
  async list(@Query() query: Record<string, string | undefined>) {
    return this.orders.list(query);
  }

  @Post(':id/dispatch')
  @HttpCode(200)
  async dispatch(@Param('id') orderId: string, @Body() body: { technicianId?: string }) {
    return this.orders.dispatch(orderId, body?.technicianId);
  }

  @Put(':id/step')
  async updateStep(@Param('id') orderId: string, @Body() body: { step?: number }) {
    return this.orders.updateStep(orderId, body?.step);
  }
}
