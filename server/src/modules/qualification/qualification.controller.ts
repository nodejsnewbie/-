import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';

import { QualificationService } from './qualification.service';

/**
 * 资质与合规审核（企业后台）：`GET /api/audits`、`POST /api/audits/:id/{approve,reject}`。
 * 业务逻辑在 QualificationService（R5：审核为纯人工结论）。
 */
@Controller('audits')
export class QualificationController {
  constructor(private readonly qualification: QualificationService) {}

  @Get()
  async list() {
    return this.qualification.list();
  }

  @Post(':id/approve')
  @HttpCode(200)
  async approve(@Param('id') id: string) {
    return this.qualification.approve(id);
  }

  @Post(':id/reject')
  @HttpCode(200)
  async reject(@Param('id') id: string, @Body() body: { action?: string }) {
    return this.qualification.reject(id, body?.action);
  }
}
