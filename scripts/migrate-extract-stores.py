# -*- coding: utf-8 -*-
"""
legacy → NestJS 迁移第 1 步：把两套内存数据抽成可注入的 provider。

原则：**逐字搬运，不改任何业务数据与逻辑**。
手抄 600 行种子数据出错概率太高，所以这里全部用脚本切分，只有少量结构性包装。
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LEGACY = ROOT / "server" / "src" / "legacy"
STORE = ROOT / "server" / "src" / "store"
SHARED_TYPES = ROOT / "packages" / "shared" / "src" / "types"

STORE.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------- 1. 技师端接口类型 → packages/shared
tech_store_src = (LEGACY / "technician" / "data" / "store.ts").read_text(encoding="utf-8")
tech_lines = tech_store_src.split("\n")

class_idx = next(i for i, l in enumerate(tech_lines) if l.startswith("class BackendStore"))
iface_block = tech_lines[:class_idx]

# 去掉尾部的空行
while iface_block and not iface_block[-1].strip():
    iface_block.pop()

iface_header = """/**
 * 技师端视图模型（从 `E:\\repo\\technicalend` 的 H5 端后端原样迁入）。
 *
 * ⚠️ 这些类型与 `./index.ts` 里的企业后台领域模型（`WorkOrder` / `Technician` /
 * `AmoebaSettlement`）描述的是**同一批业务实体的两个视角**，目前尚未统一。
 *
 * 统一方式已定（见 AGENTS.md）：**以后台领域模型为真源，技师端模型降级为映射层**。
 * 在那之前这里保持原样，不做任何字段增删——迁移只搬结构，不改口径。
 *
 * 已知待清理字段（等客户确认需求后处理，勿在迁移中顺手删掉）：
 * - `ServiceOrder.distanceKm` / `gpsCoords`：本期无定位能力，界面上的距离只能是示意值
 * - `AmoebaStat.prescriptionDividend` / `teamReferralDividend` / `equityPreDraw`：
 *   分红口径已定为「仅来自服务收入」，这三项待评审
 * - `TechnicianProfile.incentiveMultiplier`：档位系数尚未定稿
 */

"""
(SHARED_TYPES / "technician-view.ts").write_text(
    iface_header + "\n".join(iface_block) + "\n", encoding="utf-8"
)
print("written: packages/shared/src/types/technician-view.ts")

exported_names = [
    l.split()[2].rstrip("{").strip()
    for l in iface_block
    if l.startswith("export interface ")
]
print("  导出类型:", ", ".join(exported_names))

# ---------------------------------------------------------------- 2. 技师端 store → provider
class_block = tech_lines[class_idx + 1 :]  # 跳过 class 声明行
while class_block and not class_block[-1].strip():
    class_block.pop()
# 去掉结尾的 `export const store = new BackendStore();`
class_block = [l for l in class_block if not l.startswith("export const store =")]

tech_store_header = f"""import {{ Injectable }} from '@nestjs/common';

import type {{
  {(",\n  ".join(exported_names))},
}} from '@hnhall/shared';

/**
 * 技师端内存数据（迁移期）。
 *
 * 来源：`E:\\repo\\technicalend\\server\\data\\store.ts`，**逐字迁入、未改任何数据**。
 * 类型定义已上提到 `@hnhall/shared`（跨端类型真源）。
 *
 * ⚠️ 进程重启即清空；这不是持久化实现，不得作为任何功能「已完成」的依据。
 * 接库后整个 `store/` 目录会被 Prisma 仓储替换掉。
 */
@Injectable()
export class TechnicianStore {{
"""
(ROOT / "server" / "src" / "store" / "technician.store.ts").write_text(
    tech_store_header + "\n".join(class_block) + "\n", encoding="utf-8"
)
print("written: server/src/store/technician.store.ts")

# ---------------------------------------------------------------- 3. 后台种子数据 → provider
admin_src = (LEGACY / "admin" / "admin-mock.router.ts").read_text(encoding="utf-8")
admin_lines = admin_src.split("\n")
a_start = next(i for i, l in enumerate(admin_lines) if l.startswith("let technicians"))
a_end = next(i for i, l in enumerate(admin_lines) if "--- REST API ENDPOINTS ---" in l)
seed = admin_lines[a_start:a_end]
while seed and not seed[-1].strip():
    seed.pop()

indented = []
for line in seed:
    if line.startswith("let "):
        indented.append("  " + line[len("let ") :])
    elif line.strip() == "":
        indented.append("")
    else:
        indented.append("  " + line)

admin_store_header = """import { Injectable } from '@nestjs/common';
import type {
  AmoebaSettlement,
  AuditApplication,
  FulfillmentEvent,
  SupplyProduct,
  Technician,
  WorkOrder,
} from '@hnhall/shared';

/**
 * 企业后台内存数据（迁移期）。
 *
 * 来源：本仓库原根目录 `server.ts`，经 `legacy/admin/admin-mock.router.ts` 逐字迁入，
 * **未改任何一条数据**。类型取自 `@hnhall/shared`（跨端类型真源）。
 *
 * ⚠️ 含大量已被否定的虚构字段与数值（窜货、OCR 比对率、KPI 绝对值、定位距离等）。
 * 它们是**存量数据**，清理时点见 AGENTS.md 的「已知遗留」——清理需要客户确认需求，
 * 不在本次结构迁移的范围内。
 *
 * ⚠️ 进程重启即清空；不得作为任何功能「已完成」的依据。
 */
@Injectable()
export class AdminStore {
"""
(ROOT / "server" / "src" / "store" / "admin.store.ts").write_text(
    admin_store_header + "\n".join(indented) + "\n}\n", encoding="utf-8"
)
print("written: server/src/store/admin.store.ts")

# ---------------------------------------------------------------- 4. shared 的 index 补导出
shared_index = ROOT / "packages" / "shared" / "src" / "index.ts"
text = shared_index.read_text(encoding="utf-8")
if "technician-view" not in text:
    text += (
        "\nexport type {\n  "
        + ",\n  ".join(exported_names)
        + ",\n} from './types/technician-view.ts';\n"
    )
    shared_index.write_text(text, encoding="utf-8")
    print("updated: packages/shared/src/index.ts")
