import { Module } from '@nestjs/common';

import { AdminTechnicianController, TechnicianSelfController } from './technician.controller';
import { AdminTechnicianService, TechnicianSelfService } from './technician.service';

/** 技师域：后台名册 + 技师端本人档案。 */
@Module({
  controllers: [AdminTechnicianController, TechnicianSelfController],
  providers: [AdminTechnicianService, TechnicianSelfService],
})
export class TechnicianModule {}
