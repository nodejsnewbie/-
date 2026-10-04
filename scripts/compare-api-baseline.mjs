/**
 * 逐字节比对迁移前后的 API 响应基线。
 *
 * 用 Node 而不是 PowerShell：`ConvertFrom-Json` 会按 ANSI 读取 UTF-8 文件，
 * 中文变乱码后解析直接失败——那会得到一个「0 处不一致」的假结果。
 *
 * 用法：node scripts/compare-api-baseline.mjs <before.json> <after.json>
 */
import { readFileSync } from 'node:fs';

const [, , beforePath, afterPath] = process.argv;
if (!beforePath || !afterPath) {
  console.error('用法: node scripts/compare-api-baseline.mjs <before.json> <after.json>');
  process.exit(2);
}

const before = JSON.parse(readFileSync(beforePath, 'utf8'));
const after = JSON.parse(readFileSync(afterPath, 'utf8'));

const paths = [...new Set([...Object.keys(before), ...Object.keys(after)])];

let mismatch = 0;
for (const path of paths) {
  const b = before[path];
  const a = after[path];

  if (!b || !a) {
    console.log(`  [缺失] ${path}  before=${!!b} after=${!!a}`);
    mismatch += 1;
    continue;
  }

  const bs = JSON.stringify(b);
  const as = JSON.stringify(a);

  if (bs === as) {
    const size = bs.length;
    console.log(`  [一致] ${path}  (${size} 字节)`);
    continue;
  }

  mismatch += 1;
  console.log(`  [不一致] ${path}`);
  console.log(`      before: ${bs.slice(0, 300)}`);
  console.log(`      after : ${as.slice(0, 300)}`);
}

console.log(`\n端点总数 ${paths.length}，不一致 ${mismatch}`);
// 见 smoke-mutations.mjs 的说明：Windows 上 process.exit() 会触发 libuv 断言
process.exitCode = mismatch === 0 ? 0 : 1;
