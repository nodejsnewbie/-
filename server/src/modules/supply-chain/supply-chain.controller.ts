import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';

import { AdminSupplyChainService, TechnicianPesticideService } from './supply-chain.service';

/**
 * 农资与溯源域。业务逻辑在 supply-chain.service.ts。
 *
 * ⚠️ 已知遗留（等客户确认需求后清理）：
 * - `GET /api/supply-chain` 的 `fleeStatus` 与 `freeze-batch` 属「窜货熔断」，
 *   第 3 步答复为**本期不做**，但原行为照搬保留。
 * - `totalCodedSum` / `monthScanCount` 等为硬编码示意值。
 */
@Controller('supply-chain')
export class AdminSupplyChainController {
  constructor(private readonly supply: AdminSupplyChainService) {}

  @Get()
  async list(@Query() query: Record<string, string | undefined>) {
    return this.supply.list(query);
  }

  @Post('generate-codes')
  @HttpCode(200)
  generateCodes(@Body() body: { count?: number }) {
    return this.supply.generateCodes(body?.count);
  }

  @Post('freeze-batch')
  @HttpCode(200)
  async freezeBatch(@Body() body: { batchNumber?: string }) {
    return this.supply.freezeBatch(body?.batchNumber);
  }
}

/** 技师端的农药目录与扫码验真：`GET /api/tech/pesticides`、`GET /api/tech/pesticides/:code`。 */
@Controller('tech/pesticides')
export class TechnicianPesticideController {
  constructor(private readonly catalog: TechnicianPesticideService) {}

  @Get()
  async list(@Query() query: Record<string, string | undefined>) {
    return this.catalog.list(query);
  }

  @Get(':code')
  async lookup(@Param('code') code: string) {
    return this.catalog.lookup(code);
  }
}
