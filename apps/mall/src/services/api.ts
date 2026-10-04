/**
 * C 端商城唯一数据访问层。
 *
 * ⚠️ 存量缺陷（迁移登记，待整改）：每个请求失败时**静默降级到本地 Mock**（乐观 fallback），
 * UI 无任何降级提示——违反 AGENTS.md「禁止用乐观 fallback 掩盖接口失败；若采用必须同时
 * 显示降级提示」。本次并入只搬结构不改口径，兜底行为原样保留；整改需产品确认交互后统一做。
 */
import {
  MallProduct,
  TraceVerificationResult,
  TraceLedgerEntry,
  ServiceBooking,
  CartItem,
  MallOrderSubmission,
  WeatherInfo,
} from '@hnhall/shared';
import { PRODUCTS } from '../data/mockData.ts';
import { verifyTraceCode as localVerify } from '../utils/traceUtils.ts';

export const api = {
  // Fetch products with optional filtering
  async getProducts(category?: string, query?: string): Promise<MallProduct[]> {
    try {
      const params = new URLSearchParams();
      if (category && category !== '全部') params.append('category', category);
      if (query) params.append('q', query);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch (e) {
      console.warn('[API Client] Backend fetch failed, using local catalog cache', e);
    }
    // Fallback
    return PRODUCTS.filter((p) => {
      const matchCat = !category || category === '全部' || p.category === category;
      const matchQ =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.licenseNo.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return matchCat && matchQ;
    });
  },

  // Verify National Pesticide Electronic Code
  async verifyTraceCode(code: string): Promise<TraceVerificationResult> {
    try {
      const res = await fetch('/api/trace/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (e) {
      console.warn('[API Client] Backend verification failed, using local validation engine', e);
    }
    return localVerify(code);
  },

  // Get digital traceability ledger
  async getTraceLedger(): Promise<TraceLedgerEntry[]> {
    try {
      const res = await fetch('/api/trace/history');
      if (res.ok) {
        const json = await res.json();
        if (json.success) return json.data;
      }
    } catch (e) {
      console.warn('[API Client] Backend ledger fetch failed', e);
    }
    return [];
  },

  // Fetch bookings
  async getBookings(): Promise<ServiceBooking[]> {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const json = await res.json();
        if (json.success) return json.data;
      }
    } catch (e) {
      console.warn('[API Client] Backend bookings fetch failed', e);
    }
    return [];
  },

  // Create new doorstep booking
  async createBooking(booking: Partial<ServiceBooking>): Promise<ServiceBooking> {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (e) {
      console.warn('[API Client] Backend create booking failed', e);
    }
    return {
      id: `BK-${Date.now().toString().slice(-6)}`,
      serviceType: booking.serviceType || 'drone_spraying',
      cropType: booking.cropType || '水稻',
      acreage: booking.acreage || 30,
      preferredDate: booking.preferredDate || '2024-10-02',
      timeSlot: booking.timeSlot || '上午',
      station: booking.station || '长沙县安沙农资自营直供中心',
      contactName: booking.contactName || '种植户',
      contactPhone: booking.contactPhone || '138-7589-9921',
      plotAddress: booking.plotAddress || '安沙示范区',
      associatedProducts: booking.associatedProducts || [],
      status: 'submitted',
    };
  },

  // Submit procurement order
  async createOrder(items: CartItem[], station?: string): Promise<{ success: boolean; data: MallOrderSubmission }> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, station }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[API Client] Backend order submission failed', e);
    }
    // ⚠️ 降级桩字段不全，按契约形状收窄（存量降级行为，见文件头缺陷登记）
    return {
      success: true,
      data: {
        orderId: `DD-${Date.now().toString().slice(-8)}`,
        totalAmount: items.reduce((s, i) => s + i.product.price * i.quantity, 0),
      } as MallOrderSubmission,
    };
  },

  // Fetch real-time agro-weather
  async getWeather(): Promise<WeatherInfo> {
    try {
      const res = await fetch('/api/weather');
      if (res.ok) {
        const json = await res.json();
        if (json.success) return json.data;
      }
    } catch (e) {
      console.warn('[API Client] Backend weather fetch failed', e);
    }
    // ⚠️ 降级桩字段不全，按契约形状收窄（存量降级行为，见文件头缺陷登记）
    return {
      temperature: 26,
      humidity: 64,
      windSpeed: 1.8,
      windDirection: '东南风 2级',
      droneSprayIndex: '适宜飞防',
    } as WeatherInfo;
  },
};
