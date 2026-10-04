import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';

import { AdminAmoebaService, TechnicianAmoebaService } from './amoeba.service';

/** 阿米巴分红与结算域（后台结算）。业务逻辑在 amoeba.service.ts。 */
@Controller('amoeba')
export class AdminAmoebaController {
  constructor(private readonly amoeba: AdminAmoebaService) {}

  @Get()
  async list() {
    return this.amoeba.list();
  }

  @Post('batch-settle')
  @HttpCode(200)
  async batchSettle() {
    return this.amoeba.batchSettle();
  }

  @Post('single-settle/:id')
  @HttpCode(200)
  async singleSettle(@Param('id') id: string) {
    return this.amoeba.singleSettle(id);
  }
}

/** 技师端的收益与提现：`/api/tech/amoeba/*`。 */
@Controller('tech/amoeba')
export class TechnicianAmoebaController {
  constructor(private readonly earning: TechnicianAmoebaService) {}

  @Get('stats')
  async stats() {
    return this.earning.stats();
  }

  @Get('transactions')
  async transactions(@Query() query: Record<string, string | undefined>) {
    return this.earning.transactions(query);
  }

  @Get('feeds')
  async feeds() {
    return this.earning.feeds();
  }

  @Post('withdraw')
  @HttpCode(200)
  async withdraw(@Body() body: { amount?: number | string; channel?: string }) {
    return this.earning.withdraw(body ?? {});
  }
}
