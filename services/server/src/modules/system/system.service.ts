import { Injectable } from '@nestjs/common';

/** 系统域业务逻辑：监管数据同步 + 技师端健康检查。 */
@Injectable()
export class SystemService {
  /**
   * ⚠️ `apiStatus: 'ONLINE_ACTIVE'` 与 `matchedRate: 100` 是**硬编码文案**，
   * 监管接口权限目前仍在申请中，并未真实对接（见 AGENTS.md 待决策项）。
   * 迁移期照搬以保持行为不变，**但不得据此对外宣称已联网**。
   */
  syncMinistry() {
    return {
      success: true,
      message:
        '已成功与国家农业农村部农药质量安全追溯云系统进行接口双向数据校验，全部 32 款核心农资与 386 位在册人员三证验真数据保持同步。',
      syncTimestamp: new Date().toISOString(),
      apiStatus: 'ONLINE_ACTIVE',
      matchedRate: 100,
    };
  }

  /** 技师端自己的健康检查（legacy `routes/index.ts`），与 NestJS 的 `/api/_health` 并存。 */
  technicianHealth() {
    return {
      status: 'ok',
      service: '华农智服·农艺师合伙人服务API',
      timestamp: new Date().toISOString(),
    };
  }
}
