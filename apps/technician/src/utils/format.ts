/**
 * 展示层金额格式化。
 *
 * 后端接口与库里金额一律为**「分」整数**（红线 R7）。前端**唯一**的「分 → 元」展示还原
 * 就放在这里：把分转成带两位小数的「元」字符串（不含货币符号，调用处自行加 `¥`）。
 *
 * ⚠️ 只做展示格式化，不参与任何计算/结算；结算永远在服务端以「分」整数进行。
 */

/** 分（整数）→ 元展示字符串，两位小数。例：420000 → `420,000.00`（千分位）。 */
export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 });
}

/** 分 → 元数值（仅在需要参与前端展示层加临时计算时使用；结算仍以分为准）。 */
export function centsToYuan(cents: number): number {
  return cents / 100;
}

/**
 * 展示层时间格式化。
 *
 * 时间红线：后端一律返回 **ISO 8601**（种子含 +08:00，运行时写入为 UTC `Z`），
 * **禁止存「N分钟前」这类伪相对串**，相对文案在此依据当前时间实时计算。
 */

const MINUTE_MS = 60000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** ISO 8601 → 本地展示串 `YYYY-MM-DD HH:mm`；无法解析时原样返回。 */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return (
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ` +
    `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
  );
}

/** ISO 8601 → 相对时间文案；超过 7 天或时间异常回退绝对日期。 */
export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const diff = Date.now() - then;
  if (diff < MINUTE_MS) return diff < 0 ? formatDateTime(iso) : '刚刚';
  if (diff < HOUR_MS) return `${Math.floor(diff / MINUTE_MS)}分钟前`;
  if (diff < DAY_MS) return `${Math.floor(diff / HOUR_MS)}小时前`;
  if (diff < 7 * DAY_MS) return `${Math.floor(diff / DAY_MS)}天前`;
  return formatDateTime(iso);
}
