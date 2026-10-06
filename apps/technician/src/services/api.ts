import Taro from '@tarojs/taro';

import type {
  AmoebaStat,
  FieldEvidencePhoto,
  PrescriptionDrug,
  RevenueTransaction,
  ServiceOrder,
  TeamMemberFeed,
  TechnicianProfile,
} from '../types';

/**
 * 技师端唯一数据访问层（`/api/tech/*`，统一后端 NestJS）。
 *
 * ⚠️ 基址说明：小程序里没有「同源代理」，必须是**绝对地址**。
 * 开发期默认 `http://127.0.0.1:3000`（微信开发者工具需勾选「不校验合法域名」），
 * 可通过 `.env` 的 `TARO_APP_API_BASE_URL` 覆盖（Taro 4 约定 TARO_APP_ 前缀注入）。
 */

const API_BASE_URL = (process.env.TARO_APP_API_BASE_URL ?? 'http://127.0.0.1:3000').replace(/\/$/, '');

// 后端技师端路由全部挂在 /api/tech/* 前缀下（与企业后台的 /api/orders 等区分）
const BASE_URL = `${API_BASE_URL}/api/tech`;

async function request<T>(endpoint: string, options?: {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
}): Promise<T> {
  try {
    const res = await Taro.request({
      url: BASE_URL + endpoint,
      method: options?.method ?? 'GET',
      data: options?.body,
      header: { 'Content-Type': 'application/json' },
    });

    if (res.statusCode < 200 || res.statusCode >= 300) {
      const errData = (res.data ?? {}) as { message?: string };
      throw new Error(errData.message || `HTTP ${res.statusCode}: 请求失败`);
    }

    // 技师端接口统一响应包为 { success, message?, data }，这里只回传 data
    const payload = res.data as { data: T };
    return payload.data;
  } catch (err) {
    console.warn(`[API Error: ${endpoint}]`, err);
    throw err;
  }
}

export const api = {
  // 1. Technician APIs
  getTechnician: async (): Promise<TechnicianProfile> => {
    return request<TechnicianProfile>('/technician');
  },

  updateTechnicianStatus: async (isOnline?: boolean): Promise<TechnicianProfile> => {
    return request<TechnicianProfile>('/technician/status', {
      method: 'PATCH',
      body: { isOnline },
    });
  },

  // 2. Orders APIs
  getOrders: async (filters?: { status?: string; maxDistance?: number }): Promise<ServiceOrder[]> => {
    const params: string[] = [];
    if (filters?.status) params.push(`status=${encodeURIComponent(filters.status)}`);
    if (filters?.maxDistance) params.push(`maxDistance=${filters.maxDistance}`);
    const query = params.length ? `?${params.join('&')}` : '';
    return request<ServiceOrder[]>(`/orders${query}`);
  },

  getOrderById: async (id: string): Promise<ServiceOrder> => {
    return request<ServiceOrder>(`/orders/${encodeURIComponent(id)}`);
  },

  claimOrder: async (id: string): Promise<ServiceOrder> => {
    return request<ServiceOrder>(`/orders/${encodeURIComponent(id)}/claim`, {
      method: 'POST',
    });
  },

  declineOrder: async (id: string): Promise<ServiceOrder> => {
    return request<ServiceOrder>(`/orders/${encodeURIComponent(id)}/decline`, {
      method: 'POST',
    });
  },

  addEvidencePhoto: async (
    orderId: string,
    evidence: { url: string; label: string; location?: string }
  ): Promise<{ data: FieldEvidencePhoto; order: ServiceOrder }> => {
    return request<{ data: FieldEvidencePhoto; order: ServiceOrder }>(
      `/orders/${encodeURIComponent(orderId)}/evidence`,
      {
        method: 'POST',
        body: evidence,
      }
    );
  },

  prescribeOrder: async (
    orderId: string,
    payload: {
      diagnosedTargets: string[];
      agronomicAdvice: string;
      prescriptionDrugs: PrescriptionDrug[];
    }
  ): Promise<ServiceOrder> => {
    return request<ServiceOrder>(`/orders/${encodeURIComponent(orderId)}/prescribe`, {
      method: 'POST',
      body: payload,
    });
  },

  signDeliveryNote: async (
    orderId: string,
    signature: string
  ): Promise<{ order: ServiceOrder; awardedIncomeCents: number; newTotalIncomeCents: number }> => {
    return request<{ order: ServiceOrder; awardedIncomeCents: number; newTotalIncomeCents: number }>(
      `/orders/${encodeURIComponent(orderId)}/sign`,
      {
        method: 'POST',
        body: { signature },
      }
    );
  },

  // 3. Pesticides Catalog APIs
  getPesticides: async (query?: string): Promise<PrescriptionDrug[]> => {
    const q = query ? `?query=${encodeURIComponent(query)}` : '';
    return request<PrescriptionDrug[]>(`/pesticides${q}`);
  },

  scanBarcode: async (code: string): Promise<PrescriptionDrug> => {
    return request<PrescriptionDrug>(`/pesticides/${encodeURIComponent(code)}`);
  },

  // 4. Amoeba Bonus APIs
  getAmoebaStats: async (): Promise<AmoebaStat> => {
    return request<AmoebaStat>('/amoeba/stats');
  },

  getTransactions: async (type?: string): Promise<RevenueTransaction[]> => {
    const q = type ? `?type=${encodeURIComponent(type)}` : '';
    return request<RevenueTransaction[]>(`/amoeba/transactions${q}`);
  },

  getFeeds: async (): Promise<TeamMemberFeed[]> => {
    return request<TeamMemberFeed[]>('/amoeba/feeds');
  },

  withdraw: async (
    amount: number,
    channel: string
  ): Promise<{ withdrawnCents: number; channel: string; remainingBalanceCents: number }> => {
    // 入参 amount 为「元」（后端 ×100 转分做整数比较与落库）；响应金额字段为「分」整数（R7）
    return request<{ withdrawnCents: number; channel: string; remainingBalanceCents: number }>(
      '/amoeba/withdraw',
      {
        method: 'POST',
        body: { amount, channel },
      }
    );
  },
};
