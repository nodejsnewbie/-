/**
 * 仓储层的公共小工具。
 *
 * 只放与具体实体无关的东西，避免每个仓储重复一遍同样的坑。
 */

/**
 * 丢掉值为 `undefined` 的键。
 *
 * 用途：Prisma 的 `update` 收到 `undefined` 会报错（它要求「要么给值，要么别给键」），
 * 而我们的 patch 对象天然是一堆可选字段。所以统一在写库前清一遍。
 *
 * 为什么不用 `JSON.parse(JSON.stringify())`：那会把 `null` 和 `Date` 也一起改掉，
 * 而 `null` 在这里是有意义的（表示「显式清空该字段」）。
 */
export function defined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}

/**
 * 计算「前插」用的 orderKey。
 *
 * 原型的列表有 `unshift` 语义（新记录排在最前），落库后靠显式的 `orderKey` 复现：
 * 前插 = 当前最小值 − 1。这样既保证新记录永远排最前，又不会与既有顺序冲突。
 *
 * @param min 当前最小 orderKey；空表传 null
 */
export function keyForFront(min: number | null | undefined): number {
  return min === null || min === undefined ? 0 : min - 1;
}
