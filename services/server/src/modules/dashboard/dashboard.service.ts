import { Injectable } from '@nestjs/common';

import { AdminOrderRepository } from '../../database/repositories/admin-order.repository';
import { FulfillmentEventRepository } from '../../database/repositories/settlement.repository';

/** 运营数据总览业务逻辑（行为与原控制器一致，仅数据源为数据库）。 */
@Injectable()
export class DashboardService {
  constructor(
    private readonly orders: AdminOrderRepository,
    private readonly events: FulfillmentEventRepository,
  ) {}

  async stats() {
    // 只要两处用到数据：待派单/在服务的计数、以及时间线事件
    const [workOrders, fulfillmentEvents] = await Promise.all([
      this.orders.list(),
      this.events.list(),
    ]);

    return {
      kpis: {
        todayOrders: 148,
        todayOrdersChange: '+18.4%',
        pendingDispatch: workOrders.filter((o) => o.status === 'pending_dispatch').length,
        inService: workOrders.filter(
          (o) =>
            o.status === 'dispatched' ||
            o.status === 'prescription_issued' ||
            o.status === 'checked_in',
        ).length,
        completedToday: 98,
        onlineTechnicians: 386,
        totalTechnicians: 420,
        licensedRate: 98.2,
        dronePilots: 214,
        seniorAgronomists: 172,
        supplyTraceSales: 128450.0,
        prescriptionRate: 82.5,
        complianceRate: 100,
        prescriptionBatches: 216,
        amoebaBonusPool: 342800.0,
        qualifiedAmoebaTeams: 26,
        avgArrivalHours: 1.8,
        fulfillmentRatePct: 96.4,
        farmerGoodReviewPct: 99.1,
      },
      pestAlerts: [
        { name: '水稻纹枯病 (早期拔节封行期)', percentage: 45, level: 'critical' },
        { name: '柑橘木虱 / 黄龙病媒介', percentage: 28, level: 'warning' },
        { name: '二化螟 / 稻纵卷叶螟', percentage: 27, level: 'normal' },
      ],
      serviceModeBreakdown: [
        {
          title: '上门精准植保作业',
          percentage: 62,
          orders: 92,
          desc: '大疆T50无人机飞防及轮式弥雾机',
        },
        {
          title: '农资维保与配方配送',
          percentage: 23,
          orders: 34,
          desc: '三证齐全农药直配田间仓',
        },
        {
          title: '专家现场会诊开方',
          percentage: 15,
          orders: 22,
          desc: '病虫害疑难靶标即时鉴定',
        },
      ],
      fulfillmentEvents,
      lastSyncTime: new Date().toISOString(),
    };
  }
}
