import {
  TechnicianProfile,
  ServiceOrder,
  AmoebaStat,
  TeamMemberFeed,
  RevenueTransaction,
  PrescriptionDrug,
  FieldEvidencePhoto,
} from '../types';

const BASE_URL = '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP ${res.status}: 请求失败`);
    }

    const data = await res.json();
    return data.data;
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
      body: JSON.stringify({ isOnline }),
    });
  },

  // 2. Orders APIs
  getOrders: async (filters?: { status?: string; maxDistance?: number }): Promise<ServiceOrder[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.maxDistance) params.append('maxDistance', filters.maxDistance.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return request<ServiceOrder[]>(`/orders${query}`);
  },

  getOrderById: async (id: string): Promise<ServiceOrder> => {
    return request<ServiceOrder>(`/orders/${id}`);
  },

  claimOrder: async (id: string): Promise<ServiceOrder> => {
    return request<ServiceOrder>(`/orders/${id}/claim`, {
      method: 'POST',
    });
  },

  declineOrder: async (id: string): Promise<ServiceOrder> => {
    return request<ServiceOrder>(`/orders/${id}/decline`, {
      method: 'POST',
    });
  },

  addEvidencePhoto: async (
    orderId: string,
    evidence: { url: string; label: string; location?: string }
  ): Promise<{ data: FieldEvidencePhoto; order: ServiceOrder }> => {
    return request<{ data: FieldEvidencePhoto; order: ServiceOrder }>(`/orders/${orderId}/evidence`, {
      method: 'POST',
      body: JSON.stringify(evidence),
    });
  },

  prescribeOrder: async (
    orderId: string,
    payload: {
      diagnosedTargets: string[];
      agronomicAdvice: string;
      prescriptionDrugs: PrescriptionDrug[];
    }
  ): Promise<ServiceOrder> => {
    return request<ServiceOrder>(`/orders/${orderId}/prescribe`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  signDeliveryNote: async (
    orderId: string,
    signature: string
  ): Promise<{ order: ServiceOrder; awardedIncome: number; newTotalIncome: number }> => {
    return request<{ order: ServiceOrder; awardedIncome: number; newTotalIncome: number }>(
      `/orders/${orderId}/sign`,
      {
        method: 'POST',
        body: JSON.stringify({ signature }),
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
  ): Promise<{ withdrawn: number; channel: string; remainingBalance: number }> => {
    return request<{ withdrawn: number; channel: string; remainingBalance: number }>(
      '/amoeba/withdraw',
      {
        method: 'POST',
        body: JSON.stringify({ amount, channel }),
      }
    );
  },
};
