/**
 * 展示层金额格式化。
 *
 * 后端接口与库里金额一律为**「分」整数**（红线 R7）。前端**唯一**的「分 → 元」展示还原
 * 就放在这里：把分转成带两位小数的「元」字符串（不含货币符号，调用处自行加 `¥`）。
 *
 * ⚠️ 只做展示格式化，不参与任何计算/结算；结算永远在服务端以「分」整数进行。
 */

/** 分（整数）→ 元展示字符串，两位小数，中文千分位。例：420000 → `4,200.00`。 */
export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString('zh-CN', { minimumFractionDigits: 2 });
}

/** 分 → 元数值（供需要参与前端加总的场景，仍尽量以分为准；仅在必要时使用）。 */
export function centsToYuan(cents: number): number {
  return cents / 100;
}

/**
 * 展示层时间格式化。
 *
 * 时间红线：后端接口与库里时间一律为 **ISO 8601**（含 +08:00 偏移或 UTC `Z`），
 * **禁止存「2分钟前」这类伪相对串**。因此「N分钟前」等相对文案在此**依据当前时间实时计算**。
 * 种子数据多为历史时刻（早于系统当前时间 7 天以上），会自动回退为绝对日期，属正确行为。
 */

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/** ISO 8601 → 本地展示串 `YYYY-MM-DD HH:mm`；无法解析时原样返回。 */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** ISO 8601 → 相对时间文案（刚刚 / N分钟前 / N小时前 / N天前）；超过 7 天或时间异常回退绝对日期。 */
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
