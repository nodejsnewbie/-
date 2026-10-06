import type { ServiceBooking } from '../types';

/**
 * 用户端**展示层常量**（非数据源）：
 * 枚举 → 中文文案的映射、状态进度步序、示例溯源码提示。
 *
 * 这些是界面渲染用的静态文案表，不承载业务数据；业务数据一律来自统一后端
 * （商品 / 预约 / 溯源 / 天气等见 `services/api.ts`）。
 * 从原 `data/mockData.ts` 拆分而来——该文件中「伪造用户 / 公告」等**数据型**内容
 * 已改为后端预留接口返回（`GET /api/user/*`），此处仅保留纯展示映射。
 */

export const BOOKING_STATUS_TEXT: Record<ServiceBooking['status'], string> = {
  submitted: '待受理',
  assigned: '已受理',
  in_progress: '服务中',
  completed: '已完成',
};

/** 服务进度步骤（原型：待接单 → 已接单 → 服务中 → 已完成） */
export function statusStepIndex(status: ServiceBooking['status']): number {
  return { submitted: 0, assigned: 1, in_progress: 2, completed: 3 }[status];
}

export const SERVICE_TYPE_TEXT: Record<ServiceBooking['serviceType'], string> = {
  field_diagnosis: '上门植保服务',
  delivery_maintenance: '农资上门服务',
  drone_spraying: '飞防作业',
  soil_formulation: '测土配方',
  followup_inspection: '回访检查',
  expert_consult: '专家咨询',
};

/**
 * 首页溯源验真的示例码提示（点击即可试验）——对应统一后端**在售自营商品的真实种子溯源码**，
 * 可被 `POST /api/trace/verify` 正常验真，仅作输入便捷提示、非展示数据。
 */
export const EXAMPLE_TRACE_CODES = ['1020210892090124883901', '1020180431081524771234'];
