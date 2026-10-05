import Taro from '@tarojs/taro';

import type {
  MallProduct,
  ServiceBooking,
  TraceLedgerEntry,
  TraceVerificationResult,
  WeatherInfo,
} from '../types';

/**
 * 用户端（农户/客户）唯一数据访问层 —— 统一后端 `/api/*` 商城域路由。
 *
 * ⚠️ 小程序必须绝对地址：默认 `http://127.0.0.1:3000`，
 *    `.env` 的 `TARO_APP_API_BASE_URL` 可覆盖（真机联调填电脑局域网 IP）。
 * ⚠️ 失败直接抛错、由页面展示——不做静默本地兜底（H5 时代的「乐观 fallback」存量缺陷随本次重构移除）。
 */

const API_BASE_URL = (process.env.TARO_APP_API_BASE_URL ?? 'http://127.0.0.1:3000').replace(/\/$/, '');
const BASE_URL = `${API_BASE_URL}/api`;

async function request<T>(
  endpoint: string,
  options?: { method?: 'GET' | 'POST'; body?: unknown },
): Promise<T> {
  try {
    const res = await Taro.request({
      url: `${BASE_URL}${endpoint}`,
      method: options?.method ?? 'GET',
      data: options?.body,
      header: { 'Content-Type': 'application/json' },
    });

    if (res.statusCode < 200 || res.statusCode >= 300) {
      const errData = (res.data ?? {}) as { error?: string };
      throw new Error(errData.error || `HTTP ${res.statusCode}: 请求失败`);
    }

    // 商城域响应包：{ success, data?, error? }；无 data 字段的接口回传整个包
    const payload = res.data as { data?: T };
    return (payload.data !== undefined ? payload.data : (res.data as T));
  } catch (err) {
    console.warn(`[API Error: ${endpoint}]`, err);
    throw err;
  }
}

export const api = {
  // 1. 商品目录（在线商城为原型「预留」位，首页仅作推荐展示）
  getProducts: async (category?: string, keyword?: string): Promise<MallProduct[]> => {
    const params: string[] = [];
    if (category && category !== '全部') params.push(`category=${encodeURIComponent(category)}`);
    if (keyword) params.push(`q=${encodeURIComponent(keyword)}`);
    const query = params.length ? `?${params.join('&')}` : '';
    return request<MallProduct[]>(`/products${query}`);
  },

  // 2. 溯源验真（C 端核心能力：国家农药电子溯源码一物一码）
  verifyTrace: async (code: string): Promise<TraceVerificationResult> => {
    return request<TraceVerificationResult>('/trace/verify', {
      method: 'POST',
      body: { code: code.trim() },
    });
  },

  getTraceHistory: async (): Promise<TraceLedgerEntry[]> => {
    return request<TraceLedgerEntry[]>('/trace/history');
  },

  // 3. 上门服务预约
  getBookings: async (): Promise<ServiceBooking[]> => {
    return request<ServiceBooking[]>('/bookings');
  },

  createBooking: async (
    booking: Partial<ServiceBooking>
  ): Promise<ServiceBooking> => {
    return request<ServiceBooking>('/bookings', {
      method: 'POST',
      body: booking,
    });
  },

  // 4. 商城下单（在线商城预留位的后备能力，接口已就绪）
  createOrder: async (
    items: { product: MallProduct; quantity: number }[],
    station?: string
  ): Promise<{ orderId: string; totalAmount: number }> => {
    return request<{ orderId: string; totalAmount: number }>('/orders', {
      method: 'POST',
      body: { items, station },
    });
  },

  // 5. 农业气象与飞防指数
  getWeather: async (): Promise<WeatherInfo> => {
    return request<WeatherInfo>('/weather');
  },
};
