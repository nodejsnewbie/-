import { Module } from '@nestjs/common';

import { AdminAmoebaController, TechnicianAmoebaController } from './amoeba.controller';
import { AdminAmoebaService, TechnicianAmoebaService } from './amoeba.service';

/** 阿米巴分红与结算域：后台结算 + 技师端收益。 */
@Module({
  controllers: [AdminAmoebaController, TechnicianAmoebaController],
  providers: [AdminAmoebaService, TechnicianAmoebaService],
})
export class AmoebaModule {}
