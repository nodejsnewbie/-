import { Body, Controller, Get, Param, Patch, Put, Query } from '@nestjs/common';

import { AdminTechnicianService, TechnicianSelfService } from './technician.service';

/** 企业后台的技师名册：`GET /api/technicians`、`PUT /api/technicians/:id/status`。 */
@Controller('technicians')
export class AdminTechnicianController {
  constructor(private readonly technicians: AdminTechnicianService) {}

  @Get()
  async list(@Query() query: Record<string, string | undefined>) {
    return this.technicians.list(query);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { dispatchStatus?: string; amoebaCoefficient?: number | string },
  ) {
    return this.technicians.updateStatus(id, body ?? {});
  }
}

/** 技师端本人的档案：`GET /api/tech/technician`、`PATCH /api/tech/technician/status`。 */
@Controller('tech/technician')
export class TechnicianSelfController {
  constructor(private readonly self: TechnicianSelfService) {}

  @Get()
  async get() {
    return this.self.get();
  }

  @Patch('status')
  async toggleStatus(@Body() body: { isOnline?: boolean }) {
    return this.self.toggleStatus(body ?? {});
  }
}
