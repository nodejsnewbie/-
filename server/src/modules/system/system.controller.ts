import { Controller, Get, HttpCode, Post } from '@nestjs/common';

import { SystemService } from './system.service';

/** 系统域：监管数据同步 + 技师端健康检查。业务逻辑在 SystemService。 */
@Controller()
export class SystemController {
  constructor(private readonly system: SystemService) {}

  @HttpCode(200)
  @Post('sync/ministry')
  syncMinistry() {
    return this.system.syncMinistry();
  }

  /** 技师端自己的健康检查（legacy `routes/index.ts`），与 NestJS 的 `/api/_health` 并存。 */
  @Get('tech/health')
  technicianHealth() {
    return this.system.technicianHealth();
  }
}
