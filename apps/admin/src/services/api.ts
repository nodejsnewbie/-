import type {
  Technician,
  WorkOrder,
  AuditApplication,
  SupplyProduct,
  AmoebaSettlement,
  FulfillmentEvent,
} from '@hnhall/shared';

export async function fetchStats() {
  const res = await fetch('/api/stats');
  if (!res.ok) throw new Error('获取统计数据失败');
  return res.json() as Promise<{
    kpis: {
      todayOrders: number;
      todayOrdersChange: string;
      pendingDispatch: number;
      inService: number;
      completedToday: number;
      onlineTechnicians: number;
      totalTechnicians: number;
      licensedRate: number;
      dronePilots: number;
      seniorAgronomists: number;
      supplyTraceSalesCents: number;
      prescriptionRate: number;
      complianceRate: number;
      prescriptionBatches: number;
      amoebaBonusPoolCents: number;
      qualifiedAmoebaTeams: number;
      avgArrivalHours: number;
      fulfillmentRatePct: number;
      farmerGoodReviewPct: number;
    };
    pestAlerts: Array<{ name: string; percentage: number; level: string }>;
    serviceModeBreakdown: Array<{
      title: string;
      percentage: number;
      orders: number;
      desc: string;
    }>;
    fulfillmentEvents: FulfillmentEvent[];
    lastSyncTime: string;
  }>;
}

export async function fetchOrders(params?: {
  status?: string;
  grid?: string;
  category?: string;
  search?: string;
}) {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.grid) query.set('grid', params.grid);
  if (params?.category) query.set('category', params.category);
  if (params?.search) query.set('search', params.search);

  const res = await fetch(`/api/orders?${query.toString()}`);
  if (!res.ok) throw new Error('获取工单数据失败');
  return res.json() as Promise<{ orders: WorkOrder[]; total: number }>;
}

export async function dispatchOrder(orderId: string, technicianId?: string) {
  const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/dispatch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ technicianId }),
  });
  if (!res.ok) throw new Error('派单失败');
  return res.json() as Promise<{ success: boolean; message: string; order: WorkOrder }>;
}

export async function updateOrderStep(orderId: string, step: number) {
  const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/step`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ step }),
  });
  if (!res.ok) throw new Error('更新工单节点失败');
  return res.json() as Promise<{ success: boolean; order: WorkOrder }>;
}

export async function fetchTechnicians(params?: {
  tier?: string;
  filter?: string;
  search?: string;
}) {
  const query = new URLSearchParams();
  if (params?.tier) query.set('tier', params.tier);
  if (params?.filter) query.set('filter', params.filter);
  if (params?.search) query.set('search', params.search);

  const res = await fetch(`/api/technicians?${query.toString()}`);
  if (!res.ok) throw new Error('获取技师花名册失败');
  return res.json() as Promise<{
    technicians: Technician[];
    total: number;
    activeCount: number;
    pendingAuditCount: number;
    expiringCount: number;
  }>;
}

export async function updateTechnicianStatus(
  id: string,
  data: { dispatchStatus?: string; amoebaCoefficient?: number },
) {
  const res = await fetch(`/api/technicians/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('更新技师状态失败');
  return res.json();
}

export async function fetchAudits() {
  const res = await fetch('/api/audits');
  if (!res.ok) throw new Error('获取待审资质失败');
  return res.json() as Promise<{ audits: AuditApplication[] }>;
}

export async function approveAudit(id: string) {
  const res = await fetch(`/api/audits/${id}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('审核操作失败');
  return res.json() as Promise<{ success: boolean; message: string; audit: AuditApplication }>;
}

export async function rejectAudit(id: string, action: 'reject' | 'revision') {
  const res = await fetch(`/api/audits/${id}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  if (!res.ok) throw new Error('驳回操作失败');
  return res.json() as Promise<{ success: boolean; message: string; audit: AuditApplication }>;
}

export async function fetchSupplyChain(params?: { search?: string }) {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);

  const res = await fetch(`/api/supply-chain?${query.toString()}`);
  if (!res.ok) throw new Error('获取供应链数据失败');
  return res.json() as Promise<{
    products: SupplyProduct[];
    totalCount: number;
    totalCodedSum: string;
    monthScanCount: number;
    fleeAlertsCount: number;
  }>;
}

export async function generateBatchCodes(count: number = 50000) {
  const res = await fetch('/api/supply-chain/generate-codes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ count }),
  });
  if (!res.ok) throw new Error('生成溯源码失败');
  return res.json() as Promise<{ success: boolean; message: string; batchCode: string }>;
}

export async function fetchAmoebaSettlements() {
  const res = await fetch('/api/amoeba');
  if (!res.ok) throw new Error('获取阿米巴结算账单失败');
  return res.json() as Promise<{
    settlements: AmoebaSettlement[];
    summary: {
      grossTotal: number;
      taxTotal: number;
      netTotal: number;
      partnersCount: number;
      batchAuditCode: string;
      bankStatus: string;
    };
  }>;
}

export async function batchBankSettle() {
  const res = await fetch('/api/amoeba/batch-settle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('银行代发请求失败');
  return res.json() as Promise<{
    success: boolean;
    message: string;
    settledCount: number;
    netPaid: number;
  }>;
}

export async function singleBankSettle(id: string) {
  const res = await fetch(`/api/amoeba/single-settle/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('单笔清算失败');
  return res.json() as Promise<{ success: boolean; message: string; item: AmoebaSettlement }>;
}

export async function syncMinistryData() {
  const res = await fetch('/api/sync/ministry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('部级数据同步失败');
  return res.json() as Promise<{
    success: boolean;
    message: string;
    syncTimestamp: string;
    apiStatus: string;
    matchedRate: number;
  }>;
}
