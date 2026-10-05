import { Controller, Get } from '@nestjs/common';

import { DashboardService } from './dashboard.service';

/** 运营数据总览：`GET /api/stats`。业务逻辑在 DashboardService。 */
@Controller()
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get('stats')
  async stats() {
    return this.dashboard.stats();
  }
}
