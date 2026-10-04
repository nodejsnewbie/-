/**
 * C 端（农资自营商城）视图类型。自 `E:\repo\zymall` 于 2026-10 并入。
 *
 * 与 technician-view.ts 同理：这是**原型数据形状的逐字搬运**（v0 临时视图模型），
 * 待客户确认需求后与领域模型收敛。类型真源原则见 `index.ts`。
 *
 * 口径说明：
 * - `MallProduct` 与企业后台的 `SupplyProduct` 是**同一业务实体的两套视图**
 *   （后台管溯源码量与批次，商城管售卖展示），尚未统一——同 `WorkOrder` / `ServiceOrder`。
 * - `badgeColor` 存的是 **Tailwind 类名**（如 `bg-[#006d40]`），展示与数据耦合，
 *   属存量缺陷，待清理（原样保留以保证响应字节兼容）。
 * - 金额字段（`price` / `totalAmount`）在接口契约里是「元」浮点（原型口径）；
 *   存储层一律为「分」整数（R7），换算只在 server 的 mappers 层。
 */

/// 商城在售商品（C 端视图）。原型类型名 `Product`，因过于泛化在共享包内改名 `MallProduct`。
export interface MallProduct {
  id: string;
  name: string;
  spec: string;
  category: string;
  badge?: string;
  /** ⚠️ Tailwind 类名混入数据（存量缺陷，待清理） */
  badgeColor?: string;
  tags: string[];
  /** 农药登记证号 / 登记号 */
  licenseNo: string;
  /** 生产批次 */
  batchNo: string;
  price: number;
  originalPrice?: number;
  soldCount: string;
  image: string;
  traceCode: string;
  /** 有效成分 */
  activeIngredient: string;
  /** 毒性（微毒、低毒） */
  toxicity: string;
  /** 剂型（悬浮剂、可溶液剂等） */
  formulation: string;
  /** 防治对象 */
  targetDisease: string;
  /** 亩推荐用量 */
  dosagePerMu: string;
  /** 亩用水量（常规/飞防） */
  waterPerMu: string;
  /** 安全间隔期 */
  safeInterval: string;
  /** 生产厂家 */
  manufacturer: string;
  highlightText?: string;
  isOfficialDirect: boolean;
  canBookService: boolean;
}

/** 购物车行（前端本地态，随下单请求体原样上送）。 */
export interface CartItem {
  product: MallProduct;
  quantity: number;
}

/** 溯源链条上的单个节点（验真结果里的 chain 项）。 */
export interface SupplyChainStep {
  step: string;
  title: string;
  timestamp: string;
  location: string;
  operator: string;
  detail: string;
  /** passed | active | pending（原型只产生 passed） */
  status: 'passed' | 'active' | 'pending';
}

/** 国家农药电子溯源码验真结果（`POST /api/trace/verify` 的 data）。 */
export interface TraceVerificationResult {
  code: string;
  isValid: boolean;
  productName: string;
  licenseNo: string;
  productionApprovalNo: string;
  standardNo: string;
  batchNo: string;
  productionDate: string;
  expiryDate: string;
  manufacturer: string;
  factoryAddress: string;
  activeIngredient: string;
  packageSpec: string;
  queryCount: number;
  /** ⚠️ 原型为展示字符串（含中文描述后缀），非 ISO 8601 */
  firstQueryTime: string;
  distributionStation: string;
  storeInDate: string;
  chain: SupplyChainStep[];
  /** 仅异常码（warning 分支）返回 */
  warnings?: string[];
}

/** 农户扫码查验台账条目（`GET /api/trace/history` 的 data 项）。 */
export interface TraceLedgerEntry {
  id: string;
  code: string;
  productName: string;
  batchNo: string;
  licenseNo: string;
  /** ⚠️ 原型为展示字符串（'2024-10-01 09:41' / toLocaleString），非 ISO 8601 */
  queryTime: string;
  status: 'passed' | 'warning';
  station: string;
}

/** C 端上门服务预约（飞防 / 施用 / 检测等）。 */
export interface ServiceBooking {
  id: string;
  /** field_diagnosis | drone_spraying | soil_formulation | followup_inspection */
  serviceType: 'field_diagnosis' | 'drone_spraying' | 'soil_formulation' | 'followup_inspection';
  cropType: string;
  /** 亩 */
  acreage: number;
  preferredDate: string;
  timeSlot: string;
  station: string;
  contactName: string;
  /** ⚠️ 存量缺陷：原型手机号未脱敏（如 '138-7589-9921'） */
  contactPhone: string;
  plotAddress: string;
  associatedProducts: string[];
  notes?: string;
  /** submitted | assigned | in_progress | completed */
  status: 'submitted' | 'assigned' | 'in_progress' | 'completed';
  assignedAgronomist?: {
    name: string;
    certId: string;
    phone: string;
    title: string;
  };
}

/** 持证农艺师（C 端展示用）。 */
export interface Agronomist {
  id: string;
  name: string;
  title: string;
  certNumber: string;
  experienceYears: number;
  specialties: string[];
  avatar: string;
  station: string;
  servedPlots: number;
  rating: number;
}

/** 商城订单提交结果（`POST /api/orders` 的 data）。 */
export interface MallOrderSubmission {
  orderId: string;
  /** ISO 8601 */
  createdAt: string;
  items: CartItem[];
  /** 元（原型契约；存储为分） */
  totalAmount: number;
  /** 满 200 元赠免费配方服务（原型口径） */
  eligibleForFreeRecipe: boolean;
  deliveryStation: string;
  deliveryEstimate: string;
  /** 原型写死 'dispatched' */
  status: 'dispatched';
}

/** 农业气象与飞防指数（`GET /api/weather` 的 data）。静态 Mock，无真实数据来源。 */
export interface WeatherInfo {
  station: string;
  temperature: number;
  humidity: number;
  /** m/s */
  windSpeed: number;
  windDirection: string;
  /** % */
  precipitationChance: number;
  droneSprayIndex: string;
  reason: string;
}
