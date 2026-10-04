/**
 * 从 NestJS 控制器源码解析出完整路由表，并与迁移前的 legacy 清单逐条对账。
 *
 * 为什么不用 grep 数装饰器：`@HttpCode(200)` 与多行 import 会干扰，
 * 而且数「数量相等」证明不了「路径没搬错」——必须逐条比对方法与路径。
 *
 * 用法：node scripts/audit-routes.mjs
 */
import { readFileSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/** 迁移前从 legacy 源码扫出来的 31 条路由（方法 + 最终路径） */
const LEGACY_ROUTES = [
  'GET /api/stats',
  'GET /api/orders',
  'POST /api/orders/:id/dispatch',
  'PUT /api/orders/:id/step',
  'GET /api/technicians',
  'PUT /api/technicians/:id/status',
  'GET /api/audits',
  'POST /api/audits/:id/approve',
  'POST /api/audits/:id/reject',
  'GET /api/supply-chain',
  'POST /api/supply-chain/generate-codes',
  'POST /api/supply-chain/freeze-batch',
  'GET /api/amoeba',
  'POST /api/amoeba/batch-settle',
  'POST /api/amoeba/single-settle/:id',
  'POST /api/sync/ministry',
  'GET /api/tech/health',
  'GET /api/tech/technician',
  'PATCH /api/tech/technician/status',
  'GET /api/tech/orders',
  'GET /api/tech/orders/:id',
  'POST /api/tech/orders/:id/claim',
  'POST /api/tech/orders/:id/decline',
  'POST /api/tech/orders/:id/evidence',
  'POST /api/tech/orders/:id/prescribe',
  'POST /api/tech/orders/:id/sign',
  'GET /api/tech/pesticides',
  'GET /api/tech/pesticides/:code',
  'GET /api/tech/amoeba/stats',
  'GET /api/tech/amoeba/transactions',
  'GET /api/tech/amoeba/feeds',
  'POST /api/tech/amoeba/withdraw',
];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith('.controller.ts')) out.push(p);
  }
  return out;
}

const HTTP_METHODS = ['Get', 'Post', 'Put', 'Patch', 'Delete'];
const found = [];

for (const file of walk('server/src')) {
  const text = readFileSync(file, 'utf8');

  // ⚠️ 一个文件里可能有**多个** `@Controller`（后台与技师端同域，各一个 controller）。
  // 必须按 `@Controller(` 切段，段内的方法装饰器才归属该段的前缀——
  // 只取第一个前缀会把后面那个 controller 的路由算错（本脚本踩过这个坑）。
  const starts = [...text.matchAll(/@Controller\(/g)].map((m) => m.index);
  if (starts.length === 0) continue;

  for (let i = 0; i < starts.length; i += 1) {
    const segment = text.slice(starts[i], starts[i + 1] ?? text.length);
    const ctrl = segment.match(/@Controller\(([^)]*)\)/);
    const prefixRaw = ctrl ? ctrl[1].trim().replace(/^['"]|['"]$/g, '') : '';

    const re = new RegExp(`@(${HTTP_METHODS.join('|')})\\(([^)]*)\\)`, 'g');
    let m;
    while ((m = re.exec(segment)) !== null) {
      const method = m[1].toUpperCase();
      const sub = m[2].trim().replace(/^['"]|['"]$/g, '');
      const parts = ['api', prefixRaw, sub].filter((s) => s !== '');
      found.push(`${method} /${parts.join('/')}`);
    }
  }
}

// 归一化：去掉可能的重复斜杠、末尾斜杠
const norm = (r) => r.replace(/\/+/g, '/').replace(/\/$/, '');
const actual = [...new Set(found.map(norm))].sort();
const expect = [...new Set(LEGACY_ROUTES.map(norm))].sort();

const missing = expect.filter((r) => !actual.includes(r));
const extra = actual.filter((r) => !expect.includes(r) && !r.includes('/api/_health'));

console.log(`legacy 路由: ${expect.length}`);
console.log(`解析到的路由: ${actual.length}（含 /api/_health）`);
console.log('');

if (missing.length) {
  console.log('❌ 迁移后缺失的路由:');
  for (const r of missing) console.log(`   ${r}`);
} else {
  console.log(`✅ legacy 的 ${expect.length} 条路由全部存在，无缺失`);
}

if (extra.length) {
  console.log('⚠️  多出来的路由（非 legacy、非 health）:');
  for (const r of extra) console.log(`   ${r}`);
} else {
  console.log('✅ 没有多注册的路由');
}

process.exitCode = missing.length || extra.length ? 1 : 0;
