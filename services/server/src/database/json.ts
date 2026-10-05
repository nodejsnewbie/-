import type { Prisma } from '@prisma/client';

/**
 * Json 列的进出转换。
 *
 * 起因：Prisma 的 Json 列要求入参是 `InputJsonValue`——**对象必须带字符串索引签名**，
 * 而我们的领域类型是具名 `interface`（如 `FieldEvidencePhoto`）。两者结构兼容，
 * 但 TS 的签名检查不通过。
 *
 * 这是 Prisma 类型定义的限制，不是数据有问题。所以在这里做一次**有说明的**集中转换，
 * 而不是在十几个调用点上撒 `as any`（那既违反红线 R1，也让真正的类型错误失去保护）。
 */
export function jsonIn(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

/**
 * 出参方向：Json 列读回来是 `JsonValue`，还原成领域类型需要显式转换。
 *
 * 注意 `jsonIn` / `jsonOut` **只做类型转换，不做任何值处理**——
 * 所以「字段不存在」必须靠调用方的 `?? undefined` 表达，不能指望这里。
 */
export function jsonOut<T>(value: unknown): T {
  return value as T;
}
