import { Module } from '@nestjs/common';

import {
  AdminSupplyChainController,
  TechnicianPesticideController,
} from './supply-chain.controller';
import { AdminSupplyChainService, TechnicianPesticideService } from './supply-chain.service';

/** 农资与溯源域：后台的批次/赋码 + 技师端的农药目录与扫码。 */
@Module({
  controllers: [AdminSupplyChainController, TechnicianPesticideController],
  providers: [AdminSupplyChainService, TechnicianPesticideService],
})
export class SupplyChainModule {}
