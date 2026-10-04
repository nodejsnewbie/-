/**
 * 抓取 API 响应基线，用于 legacy → NestJS 模块迁移的**行为不变**回归比对。
 *
 * 用法：
 *   1. 先起一个服务（迁移前 / 迁移后各一次）
 *   2. node scripts/capture-api-baseline.mjs <输出文件> [profile]
 *      profile = core（默认，企业后台 + 技师端）| mall（C 端商城，zymall 并入）
 *   3. 比对两次输出：node scripts/compare-api-baseline.mjs <before> <after>
 *
 * 时间戳类字段每次都不同，统一归一化成 "<timestamp>"，否则比对永远失败。
 * mall profile 的 verify POST 会写台账——抓取前服务必须是**全新状态**
 * （legacy 重启进程 / NestJS 重跑 seed），且同一服务实例不要抓第二次。
 */
import { writeFileSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';

/** 每次都变的时间字段，比对前归一化 */
const VOLATILE_KEYS = new Set([
  'timestamp',
  'lastSyncTime',
  'bankClearedAt',
  'syncTimestamp',
  // mall：验真响应里的首次验真时间、台账查询时间、下单时间（含中文描述后缀，整体归一）
  'firstQueryTime',
  'queryTime',
  'createdAt',
]);

function normalize(value) {
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, v] of Object.entries(value)) {
      out[key] = VOLATILE_KEYS.has(key) ? '<timestamp>' : normalize(v);
    }
    return out;
  }
  return value;
}

async function requestJson(path, options) {
  const res = await fetch(BASE + path, options);
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  return { status: res.status, body: normalize(body) };
}

const getJson = (path) => requestJson(path);

function postJson(path, body) {
  return requestJson(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** 企业后台 + 技师端（默认 profile）。只抓 GET：迁移只做结构重排，GET 的响应必须逐字节一致。 */
const CORE_LIST_PATHS = [
  '/api/stats',
  '/api/orders',
  '/api/technicians',
  '/api/audits',
  '/api/supply-chain',
  '/api/amoeba',
  '/api/tech/health',
  '/api/tech/technician',
  '/api/tech/orders',
  '/api/tech/pesticides',
  '/api/tech/amoeba/stats',
  '/api/tech/amoeba/transactions',
  '/api/tech/amoeba/feeds',
];

/**
 * C 端商城（zymall 并入）。GET 逐字节比对；
 * 另抓两条**确定性**的 POST /api/trace/verify（正品码与异常码——它们的响应不含实时时钟，
 * firstQueryTime 已被归一化；chain 里的 `timestamp` 键同样归一，两侧对称即可比对）。
 * 响应随请求体变化的 POST（orders / bookings）放到了 smoke-mutations.mjs 做形状断言。
 */
const MALL_GET_PATHS = [
  '/api/health',
  '/api/products',
  '/api/products/prod-1',
  '/api/products/NOPE',
  '/api/trace/history',
  '/api/bookings',
  '/api/weather',
];

// 正品码：与种子数据 prod-1 的 traceCode 完全一致（≥16 位，原样透传，无后缀拼接）
const MALL_POSTS = [
  ['/api/trace/verify', { code: '1020210892090124883901' }],
  // 异常码分支：888 开头 → 疑似假劣响应（静态形状）
  ['/api/trace/verify', { code: '88899999' }],
];

async function main() {
  const out = process.argv[2] ?? 'server/test/api-baseline.json';
  const profile = process.argv[3] ?? 'core';
  const result = {};

  if (profile === 'mall') {
    for (const path of MALL_GET_PATHS) {
      result[path] = await getJson(path);
    }
    for (const [path, body] of MALL_POSTS) {
      result[`POST ${path}`] = await postJson(path, body);
    }
  } else {
    for (const path of CORE_LIST_PATHS) {
      result[path] = await getJson(path);
    }

    // 详情类端点需要真实 id / code，从列表响应里取
    const firstOrderId = result['/api/tech/orders']?.body?.data?.[0]?.id;
    if (firstOrderId) {
      result[`/api/tech/orders/${firstOrderId}`] = await getJson(
        `/api/tech/orders/${firstOrderId}`,
      );
    }
    const firstCode = result['/api/tech/pesticides']?.body?.data?.[0]?.code;
    if (firstCode) {
      const encoded = encodeURIComponent(firstCode);
      result[`/api/tech/pesticides/${encoded}`] = await getJson(`/api/tech/pesticides/${encoded}`);
    }
  }

  writeFileSync(out, JSON.stringify(result, null, 2), 'utf8');

  console.log(`captured ${Object.keys(result).length} endpoints (profile=${profile}) -> ${out}`);
  for (const [path, v] of Object.entries(result)) {
    console.log(`  ${v.status}  ${path}`);
  }
}

main().catch((error) => {
  console.error('抓取失败:', error);
  process.exit(1);
});
