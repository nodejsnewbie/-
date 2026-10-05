import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';

import { MallTraceService } from './mall-trace.service';

/** C 端 · 溯源码验真与查验台账：`POST /api/trace/verify`、`GET /api/trace/history`。 */
@Controller('trace')
export class MallTraceController {
  constructor(private readonly trace: MallTraceService) {}

  @Post('verify')
  @HttpCode(200)
  async verify(@Body() body: { code?: string }) {
    return this.trace.verify(body);
  }

  @Get('history')
  async history() {
    return this.trace.history();
  }
}
