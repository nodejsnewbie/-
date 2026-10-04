# -*- coding: utf-8 -*-
"""
把 `src/store/*.store.ts`（Nest provider）转成纯种子数据类，移到 `src/database/seed-data/`。

为什么要移：`src/store/` 随后会被 Prisma 仓储替换并**整个删除**，
而种子数据要留下来给 `prisma` 播种用，所以必须先从 provider 里剥离出来。

原则：**只做结构性改写（去装饰器、改类名），不动任何一条数据。**
"""
from pathlib import Path

SRC = Path("server/src/store")
DST = Path("server/src/database/seed-data")
DST.mkdir(parents=True, exist_ok=True)


def transform(text: str, old_class: str, new_class: str, doc: str, extra_import: str = "") -> str:
    # 去掉 Nest 装饰器与 @nestjs/common 的 import
    text = text.replace("import { Injectable } from '@nestjs/common';\n", "")
    text = text.replace("@Injectable()\n", "")
    text = text.replace(f"export class {old_class} {{", f"export class {new_class} {{")

    # 把类上方的注释块换成种子数据的说明
    lines = text.split("\n")
    start = 0
    while start < len(lines) and not lines[start].startswith("import "):
        start += 1
    body = "\n".join(lines[start:])

    return doc + extra_import + body


ADMIN_DOC = '''/**
 * 企业后台的**种子数据**（原型 Mock，逐字迁入，未改任何一条数据）。
 *
 * ⚠️ 这不是业务逻辑，只用于把数据库初始化成原型的样子，好让接口响应可验证。
 * ⚠️ 含大量已被否定的虚构字段与数值（窜货、OCR 比对率、KPI 绝对值、示意距离等）。
 *    清理时点见 AGENTS.md 的「已知遗留」——清理需要客户确认需求。
 *
 * 金额在本文件里仍是**元（浮点）**，由 `seed.ts` 统一转成「分」入库（红线 R7）。
 */

'''

TECH_DOC = '''/**
 * 技师端的**种子数据**（原型 Mock，逐字迁入，未改任何一条数据）。
 *
 * ⚠️ 这不是业务逻辑，只用于初始化数据库。类型取自 `@hnhall/shared`。
 * ⚠️ 含已知待清理字段（distanceKm / gpsCoords / 三项分红 / incentiveMultiplier）。
 *
 * 金额在本文件里仍是**元（浮点）**，由 `seed.ts` 统一转成「分」入库（红线 R7）。
 */

'''

admin_src = (SRC / "admin.store.ts").read_text(encoding="utf-8")
( DST / "admin.seed.ts").write_text(
    transform(admin_src, "AdminStore", "AdminSeed", ADMIN_DOC), encoding="utf-8"
)
print("written: server/src/database/seed-data/admin.seed.ts")

tech_src = (SRC / "technician.store.ts").read_text(encoding="utf-8")
(DST / "technician.seed.ts").write_text(
    transform(tech_src, "TechnicianStore", "TechnicianSeed", TECH_DOC), encoding="utf-8"
)
print("written: server/src/database/seed-data/technician.seed.ts")

# 自检：确认没有残留装饰器、类名已改
for name in ("admin.seed.ts", "technician.seed.ts"):
    t = (DST / name).read_text(encoding="utf-8")
    problems = []
    if "@Injectable" in t:
        problems.append("残留 @Injectable")
    if "@nestjs/common" in t:
        problems.append("残留 @nestjs/common import")
    if "Store {" in t:
        problems.append("残留 Store 类名")
    print(f"  {name}: " + ("[OK] 干净" if not problems else "[FAIL] " + "; ".join(problems)))
