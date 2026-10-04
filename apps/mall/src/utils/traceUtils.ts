import { TRACE_DATABASE, PRODUCTS } from '../data/mockData.ts';
import { TraceVerificationResult } from '@hnhall/shared';

export function verifyTraceCode(rawCode: string): TraceVerificationResult {
  const code = rawCode.trim();

  // If in database, return pre-configured result
  if (TRACE_DATABASE[code]) {
    return TRACE_DATABASE[code];
  }

  // Check if starts with 8888 or contains "fake" -> simulate fake
  if (
    code.startsWith('888') ||
    code.toLowerCase().includes('fake') ||
    code === '0000000000000000'
  ) {
    return {
      code,
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
  }

  // For any 16-24 digit code or matching product prefix, generate authentic response
  const matchedProd =
    PRODUCTS.find((p) => code.includes(p.licenseNo.replace(/[^0-9]/g, ''))) || PRODUCTS[0];
  const now = new Date();
  const dateStr = `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日`;

  return {
    code: code.length >= 16 ? code : `${code}2024090100889211`,
    isValid: true,
    productName: matchedProd.name + ' (' + matchedProd.spec + ')',
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
    firstQueryTime: `${dateStr} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} (首次官方验真)`,
    distributionStation: '长沙县安沙农资自营直供中心 (站号 HN-CS-004)',
    storeInDate: '2024年09月05日 10:15',
    chain: [
      {
        step: '1',
        title: '原厂赋码与合格检定',
        timestamp: '2024-08-20 09:12',
        location: '生产企业洁净灌装车间',
        operator: '质检合规员 QC-12',
        detail: '原装电子溯源码赋码成功，留样及出厂检验全项合格。',
        status: 'passed',
      },
      {
        step: '2',
        title: '国家农药追溯总库互联入库',
        timestamp: '2024-08-22 14:00',
        location: '农业农村部国家农药追溯中心服务器',
        operator: '系统自动核对',
        detail: '一瓶一码已通过国标农药数据校验，数据不可篡改。',
        status: 'passed',
      },
      {
        step: '3',
        title: '实体自营站核收入库',
        timestamp: '2024-09-05 10:15',
        location: '长沙县安沙农资自营直供中心',
        operator: '直营站长 陈伟农',
        detail: '冷藏恒温库位入库上架，三证齐全，专车直供。',
        status: 'passed',
      },
      {
        step: '4',
        title: '终端种植户扫码验真',
        timestamp: `${dateStr} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
        location: '用户当前田间终端',
        operator: '种植户扫码',
        detail: '官方认证原厂正品！享48小时内持证农艺师田间复诊保障。',
        status: 'passed',
      },
    ],
  };
}
