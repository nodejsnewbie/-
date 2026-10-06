import { Controller, Get } from '@nestjs/common';

import { MallUserService } from './mall-user.service';

/**
 * C 端「我的 / 消息」路由：`GET /api/user/profile`、`GET /api/user/announcements`、`GET /api/user/coupons`。
 *
 * 本期三者的后端服务（微信登录、消息通知、优惠券）均未接入，返回 `ReservedCapability`
 * （`enabled:false`），前端显示「待接入」——避免用户端把本地占位当真实数据展示（R4）。
 */
@Controller('user')
export class MallUserController {
  constructor(private readonly user: MallUserService) {}

  @Get('profile')
  profile() {
    return this.user.userProfile();
  }

  @Get('announcements')
  announcements() {
    return this.user.announcements();
  }

  @Get('coupons')
  coupons() {
    return this.user.coupons();
  }
}
