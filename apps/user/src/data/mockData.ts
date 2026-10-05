import type { ServiceBooking } from '../types';

/**
 * 用户端本地 Mock（显式标注，仅用于后端尚未覆盖的「预留」区块）：
 * - 当前登录用户（真实用户体系 = 微信登录，后端待接）
 * - 平台公告（消息通知接口待接）
 * 均为**占位展示数据**，不得作为任何功能完成的依据（R4）。
 */

export const MOCK_USER = {
  name: '张先生',
  phone: '138****8888',
  avatar: '',
};

export const PLATFORM_ANNOUNCEMENTS = [
  { id: 'a1', date: '06-15', text: '近期稻田温多雨，请注意稻瘟病、纹枯病的预防。' },
  { id: 'a2', date: '06-10', text: '华农智服 6 月飞防作业档期开放预约，早约早排期。' },
  { id: 'a3', date: '06-05', text: '农资自营仓新增 3 款水稻后期促灌浆叶面肥。' },
];

/** 首页溯源验真示例码来自自营在售商品（真实后端可验） */
export const SAMPLE_TRACE_CODES = ['1020210892090124883901', '1020180431081524771234'];

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
