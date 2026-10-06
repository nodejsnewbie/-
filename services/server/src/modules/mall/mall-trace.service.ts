import { BadRequestException, Injectable } from '@nestjs/common';
import type { TraceLedgerEntry } from '@hnhall/shared';

import {
  MallProductRepository,
  TraceLedgerRepository,
} from '../../database/repositories/mall.repository';

/**
 * C 端 · 国家农药电子溯源码验真业务逻辑（自 E:\repo\zymall 的 Express Mock 原样迁入）。
 *
 * ⚠️ 只搬结构、不改口径，原型行为原样保留（含已知性质）：
 * - 「正常码但不在目录里」会**兜底匹配到第一个商品**（原型 `|| PRODUCTS[0]`）——
 *   真实溯源应由监管链路判定，这里只是原型的演示行为。
 * - 验真成功会把记录写进农户「数字台账」（unshift 前插）——台账不是权威溯源记录，
 *   权威节点在监管链路（R6）。
 * - 异常码（888 开头 / 含 fake / 全 0）的响应是**静态形状**，非真实监管数据。
 */
@Injectable()
export class MallTraceService {
  constructor(
    private readonly products: MallProductRepository,
    private readonly ledger: TraceLedgerRepository,
  ) {}

  async verify(body: { code?: string } | undefined): Promise<{ success: true; data: unknown }> {
    const rawCode = (body?.code || '').trim();
    if (!rawCode) {
      throw new BadRequestException({ success: false, error: '请输入有效的农药电子溯源码' });
    }

    // 异常 / 假码分支（响应为静态形状；原型如此）
    if (
      rawCode.startsWith('888') ||
      rawCode.toLowerCase().includes('fake') ||
      rawCode === '0000000000000000'
    ) {
      const warningResult = {
        code: rawCode,
        isValid: false,
        productName: '【疑似假劣/异常串货】未备案农资产品',
        licenseNo: '无效编码 / 查无准产证',
        productionApprovalNo: '无',
        standardNo: '无',
        batchNo: '未知异常批号',
        productionDate: '无生产记录',
        expiryDate: '无',
        manufacturer: '未知作坊 (未取得农业农村部生产许可)',
        factoryAddress: '未知',
        activeIngredient: '成分未知 (存在重度药害风险)',
        packageSpec: '粗糙仿冒包装',
        queryCount: 142,
        firstQueryTime: '2024-03-12 (异地频繁重复核验，已被系统锁定)',
        distributionStation: '非官方自营实体站，来源不明',
        storeInDate: '无国家系统入库留痕',
        chain: [],
        warnings: [
          '【国家电子溯源预警】该追溯码未在农业农村部农药数字监管系统中登记！',
          '此条码已被多省市重复扫描查验达142次，存在假冒套码串货嫌疑！',
          '严防假劣农药造成烧苗毁田减产！请勿在田间施用，支持假一赔十！',
          '已记录您的查验日志，可一键直连安沙执法服务站申请上门鉴定取样。',
        ],
      };

      await this.ledger.insertFront({
        code: rawCode,
        productName: '【疑似假劣】未备案产品',
        batchNo: '异常批次',
        licenseNo: '无效代码',
        queryTime: new Date().toISOString(),
        status: 'warning',
        station: '非官方自营渠道',
      });

      return { success: true, data: warningResult };
    }

    // 正品匹配：溯源码精确命中 → 登记证号数字串包含 → 兜底第一个商品（原型如此）
    const products = await this.products.list();
    const matchedProd =
      (await this.products.findByTraceCode(rawCode)) ??
      products.find((p) => rawCode.includes(p.licenseNo.replace(/[^0-9]/g, ''))) ??
      products[0];

    const now = new Date();
    const dateStr = `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日`;
    const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const authenticResult = {
      code: rawCode.length >= 16 ? rawCode : `${rawCode}2024090100889211`,
      isValid: true,
      productName: `${matchedProd.name} (${matchedProd.spec})`,
      licenseNo: `${matchedProd.licenseNo} (正式登记)`,
      productionApprovalNo: '农药生许(湘)0023',
      standardNo: 'GB/T 28143-2022',
      batchNo: matchedProd.batchNo,
      productionDate: '2024年08月20日',
      expiryDate: '2026年08月19日 (保质期24个月)',
      manufacturer: matchedProd.manufacturer,
      factoryAddress: '国家级农业高新技术产业示范园生物科技区',
      activeIngredient: matchedProd.activeIngredient,
      packageSpec: matchedProd.spec,
      queryCount: 1,
      firstQueryTime: `${dateStr} ${hhmm} (首次官方验真)`,
      distributionStation: '长沙县安沙农资自营直供中心 (站号 HN-CS-004)',
      storeInDate: '2024年09月05日 10:15',
      chain: [
        {
          step: '1',
          title: '原厂赋码与合格检定',
          timestamp: '2024-08-20T09:12:00+08:00',
          location: '生产企业洁净灌装车间',
          operator: '质检合规员 QC-12',
          detail: '原装电子溯源码赋码成功，留样及出厂检验全项合格。',
          status: 'passed',
        },
        {
          step: '2',
          title: '国家农药追溯总库互联入库',
          timestamp: '2024-08-22T14:00:00+08:00',
          location: '农业农村部国家农药追溯中心服务器',
          operator: '系统自动核对',
          detail: '一瓶一码已通过国标农药数据校验，数据不可篡改。',
          status: 'passed',
        },
        {
          step: '3',
          title: '实体自营站核收入库',
          timestamp: '2024-09-05T10:15:00+08:00',
          location: '长沙县安沙农资自营直供中心',
          operator: '直营站长 陈伟农',
          detail: '冷藏恒温库位入库上架，三证齐全，专车直供。',
          status: 'passed',
        },
        {
          step: '4',
          title: '终端种植户扫码验真',
          timestamp: now.toISOString(),
          location: '用户当前田间终端',
          operator: '种植户扫码',
          detail: '官方认证原厂正品！享48小时内持证农艺师田间复诊保障。',
          status: 'passed',
        },
      ],
    };

    // 写入农户数字台账（原型在验真接口里顺手 unshift）
    await this.ledger.insertFront({
      code: authenticResult.code,
      productName: matchedProd.name,
      batchNo: matchedProd.batchNo,
      licenseNo: matchedProd.licenseNo,
      queryTime: now.toISOString(),
      status: 'passed',
      station: '长沙县安沙农资自营直供中心',
    });

    return { success: true, data: authenticResult };
  }

  async history(): Promise<{ success: true; data: TraceLedgerEntry[]; total: number }> {
    const data = await this.ledger.list();
    return { success: true, data, total: data.length };
  }
}
