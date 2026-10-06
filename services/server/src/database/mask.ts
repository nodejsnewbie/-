/**
 * 手机号脱敏（红线 R4「脱敏无例外」）。
 *
 * 为什么放在后端出参层，而不是把 `138****7819` 这类打码串直接写进种子数据：
 * 脱敏是**服务端职责**，不能让「是否打码」依赖数据录入者是否手工打了码。
 * 库里（本项目为原型 Mock）可存原样号码，接口返回前一律经过这里。
 *
 * 幂等：输入既可以是原始号（`13875899921` / `138-7589-9921` / `138****9921`），
 * 输出恒为 `前3位****后4位`。已合规的串不会被二次破坏，因此对既有响应字节形状无影响。
 *
 * 非 11 位手机号形态（含空串、异常长度、纯文本）原样返回，避免把非电话字段打错；
 * 调用方须自行确保只对电话字段使用本函数。
 */
export function maskPhone(value: string | null | undefined): string | undefined {
  if (value == null) return undefined;
  // 去掉分隔符后判断是否为 11 位号码
  const digits = value.replace(/[^\d]/g, '');
  if (digits.length !== 11) {
    // 已打码（如 138****7819，去掉 * 后前3后4共7位数字）或异常格式：原样返回
    return value;
  }
  return `${digits.slice(0, 3)}****${digits.slice(7, 11)}`;
}

/**
 * 身份证号脱敏（同 R4）。保留前 14 位 + `****`，与原种子 `...15****` 形态一致。
 * 已是 `...****` 形态的串不会被二次破坏。
 */
export function maskIdCard(value: string | null | undefined): string | undefined {
  if (value == null) return undefined;
  const s = value.trim();
  if (/^[0-9Xx]{18}$/.test(s)) {
    return `${s.slice(0, 14)}****`;
  }
  return s;
}
