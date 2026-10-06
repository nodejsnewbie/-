import { Injectable, NotFoundException } from '@nestjs/common';

import {
  PesticideCatalogRepository,
  SupplyRepository,
} from '../../database/repositories/supply.repository';

/** 农资与溯源域：企业后台的批次/赋码业务逻辑。 */
@Injectable()
export class AdminSupplyChainService {
  constructor(private readonly supply: SupplyRepository) {}

  async list(query: Record<string, string | undefined>) {
    const { search } = query;
    let items = await this.supply.list();

    if (search) {
      const q = search.toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.registrationNumber.toLowerCase().includes(q) ||
          p.batchNumber.toLowerCase().includes(q),
      );
    }

    return {
      products: items,
      totalCount: items.length,
      totalCodedSum: '1,480,000 袋/瓶',
      monthScanCount: 28490,
    };
  }

  generateCodes(count?: number) {
    const n = count || 50000;
    return {
      success: true,
      message: `已批量生成 ${n.toLocaleString()} 个带防伪防窜数字水印的国家农药电子监管码，正在发往指定赋码喷印流水线。`,
      batchCode: `BAT-${Date.now()}`,
    };
  }

  async freezeBatch(batchNumber?: string) {
    const prod = batchNumber ? await this.supply.findByBatchNumber(batchNumber) : null;

    // R6：窜货预警 / 批次熔断本期不做、二期评估——此处**不伪造冻结成功 / 稽查派单**。
    // 以预留接口如实回执：能力未启用、无真实监管链路指令下发（红线 R4）。
    return {
      success: false,
      batchNumber: prod?.batchNumber ?? batchNumber ?? null,
      capability: {
        enabled: false,
        value: null,
        label: '批次熔断',
        reason: '本期不做·二期评估',
        note: '批次冻结能力待接入',
      },
      message:
        '窜货预警 / 批次熔断本期未接入（二期评估）。此操作仅为界面预留，未对真实监管链路下发任何冻结指令。',
    };
  }
}

/** 技师端的农药目录与扫码验真业务逻辑。 */
@Injectable()
export class TechnicianPesticideService {
  constructor(private readonly catalog: PesticideCatalogRepository) {}

  async list(query: Record<string, string | undefined>) {
    const { query: keyword } = query;
    let items = await this.catalog.list();

    if (keyword && typeof keyword === 'string') {
      const q = keyword.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.spec.toLowerCase().includes(q) ||
          (item.activeIngredient && item.activeIngredient.toLowerCase().includes(q)),
      );
    }

    return { success: true, total: items.length, data: items };
  }

  async lookup(code: string) {
    const found = await this.catalog.findByCodeOrId(code);

    if (!found) {
      throw new NotFoundException({
        success: false,
        message: '未查询到对应国家农业农村部登记药剂溯源条码',
      });
    }

    return { success: true, data: found };
  }
}
