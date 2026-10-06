import type { ReservedCapability, ReservedReason } from '@hnhall/shared';

/**
 * 服务端「预留能力」构造器。
 *
 * 与 `@hnhall/shared` 的 `ReservedCapability` 配套：共享包只放**类型**（运行期擦除），
 * 构造占位对象的运行期代码放在这里，供各 mapper 合成响应时使用。
 *
 * 语义：需求确认 / 服务接入前，这些能力一律返回 `enabled:false, value:null`，
 * 前端据此显示「待接入」——**绝不在后端伪造真实数值**（红线 R4）。
 * 待客户确认或对应服务接入后，把 `pending()` 换成 `ready(label, value, ...)` 即可，
 * 调用点与前端无需改动。
 */
export function pending<T = null>(
  label: string,
  reason: ReservedReason,
  note?: string
): ReservedCapability<T> {
  return { enabled: false, value: null, label, reason, note };
}

/** 能力已接入时的构造（预留未来切换用；当前项目尚无调用点）。 */
export function ready<T>(label: string, value: T): ReservedCapability<T> {
  return { enabled: true, value, label };
}

/**
 * 集中定义本项目当前的「待接入」占位，避免各 mapper 散落硬编码文案与取值漂移。
 */
export const RESERVED = {
  /** R5：本业务为纯人工审核，OCR 证件比对未实现。 */
  ocr: () => pending('OCR 证件比对', '能力未接入', '本期为纯人工审核，OCR 比对待接入'),
  /** R5：人脸核身未实现。 */
  face: () => pending('人脸核身', '能力未接入', '本期为纯人工审核，人脸核身待接入'),
  /** R6：窜货预警本期不做、二期评估。 */
  flee: () =>
    pending<{ statusText: string }>('窜货预警', '本期不做·二期评估', '窜货监测能力待接入'),
  /** R6：批次熔断 / 冻结本期不做。 */
  batchFreeze: () =>
    pending<{ statusText: string }>('批次熔断', '本期不做·二期评估', '批次冻结能力待接入'),
  /** R7：档位系数待客户与财务确认。 */
  incentiveMultiplier: () =>
    pending<number>('分档系数', '需求待客户确认', '阿米巴档位系数待制度定稿'),
  /** R7：开方分红（当前口径仅服务收入分成）。 */
  prescriptionDividend: () =>
    pending<number>('开方分红', '需求待客户确认', '分红口径确认后接入'),
  /** R7：团队推荐分红。 */
  teamReferralDividend: () =>
    pending<number>('推荐分红', '需求待客户确认', '分红口径确认后接入'),
  /** R7：股权 / 期权预支。 */
  equityPreDraw: () => pending<number>('期权预支', '需求待客户确认', '股权激励方案确认后接入'),
  /** 注意事项 2：本期无定位能力，距离为示意值。 */
  location: () =>
    pending<{ distanceKm: number }>('实时定位', '能力未接入', '本期无 GPS/地图服务，距离为示意值'),
  /** GPS 坐标：无定位能力。 */
  gpsCoords: () => pending<string>('GPS 坐标', '能力未接入', '本期无定位能力'),
  /** C 端用户体系 = 微信登录，后端待接；未登录不得展示虚构用户名/手机号（R4）。 */
  userProfile: () =>
    pending<{ name: string; phone: string; avatar: string }>(
      '微信登录',
      '能力未接入',
      'C 端微信登录体系待接入，未登录不展示用户信息'
    ),
  /** C 端平台公告 / 消息通知接口待接，不得展示虚构公告（R4）。 */
  announcements: () =>
    pending<Array<{ id: string; date: string; text: string }>>(
      '平台公告',
      '能力未接入',
      '消息通知接口待接入'
    ),
  /** C 端优惠券体系待接，不得展示虚构券数（R4）。 */
  coupon: () => pending<number>('优惠券', '能力未接入', '优惠券体系待接入'),
} as const;
