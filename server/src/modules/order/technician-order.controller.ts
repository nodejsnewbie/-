import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import type { ServiceOrder } from '@hnhall/shared';

import { TechnicianOrderService } from './technician-order.service';

/** 技师端的工单接口。业务逻辑在 TechnicianOrderService。 */
@Controller('tech/orders')
export class TechnicianOrderController {
  constructor(private readonly orders: TechnicianOrderService) {}

  @Get()
  async list(@Query() query: Record<string, string | undefined>) {
    return this.orders.list(query);
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    return this.orders.detail(id);
  }

  @Post(':id/claim')
  @HttpCode(200)
  async claim(@Param('id') id: string) {
    return this.orders.claim(id);
  }

  @Post(':id/decline')
  @HttpCode(200)
  async decline(@Param('id') id: string) {
    return this.orders.decline(id);
  }

  @Post(':id/evidence')
  @HttpCode(200)
  async addEvidence(
    @Param('id') id: string,
    @Body() body: { url?: string; label?: string; location?: string },
  ) {
    return this.orders.addEvidence(id, body ?? {});
  }

  @Post(':id/prescribe')
  @HttpCode(200)
  async prescribe(
    @Param('id') id: string,
    @Body()
    body: {
      diagnosedTargets?: string[];
      agronomicAdvice?: string;
      prescriptionDrugs?: ServiceOrder['prescriptionDrugs'];
    },
  ) {
    return this.orders.prescribe(id, body ?? {});
  }

  @Post(':id/sign')
  @HttpCode(200)
  async sign(@Param('id') id: string, @Body() body: { signature?: string }) {
    return this.orders.sign(id, body ?? {});
  }
}
