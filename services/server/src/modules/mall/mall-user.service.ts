import { Injectable } from '@nestjs/common';

import { RESERVED } from '../../database/reserved';

/**
 * C 端「我的 / 消息」域业务逻辑。
 *
 * ⚠️ 本期这些能力均**未接入后端服务**（微信登录体系、消息通知、优惠券都在待建清单里），
 * 因此一律返回 `ReservedCapability`（`enabled:false, value:null`）——**不伪造用户名、手机号、公告、券数**
 * （红线 R4）。前端据 `enabled` 渲染「待接入」占位。
 * 待对应服务接入后，把 `RESERVED.xxx()` 换成 `ready(label, value)` 或真实仓储查询即可，
 * 调用点与前端契约不变（非破坏性）。
 */
@Injectable()
export class MallUserService {
  /** 当前登录用户（微信登录待接入）。 */
  userProfile() {
    return { success: true, data: RESERVED.userProfile() };
  }

  /** 平台公告 / 消息通知（接口待接入）。 */
  announcements() {
    return { success: true, data: RESERVED.announcements() };
  }

  /** 优惠券数量（体系待接入）。 */
  coupons() {
    return { success: true, data: RESERVED.coupon() };
  }
}
