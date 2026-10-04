# -*- coding: utf-8 -*-
"""
给所有 POST 处理器补 `@HttpCode(200)`。

背景：NestJS 的 `@Post()` 默认返回 **201 Created**，而原 Express 的 `res.json()` 返回 **200**。
迁移原则是「行为不变」，所以必须显式改回 200——否则客户端观察到状态码变化。

（PUT / PATCH 的 NestJS 默认本来就是 200，实测已一致，无需处理。）
"""
import re
from pathlib import Path

CONTROLLERS = sorted(Path("server/src/modules").rglob("*.controller.ts"))

total = 0
for path in CONTROLLERS:
    text = path.read_text(encoding="utf-8")
    lines = text.split("\n")
    out = []
    added_here = 0

    for line in lines:
        m = re.match(r"^(\s*)@Post\(", line)
        if m:
            indent = m.group(1)
            out.append(f"{indent}@HttpCode(200)")
            added_here += 1
        out.append(line)

    text = "\n".join(out)

    if added_here:
        # 确保 HttpCode 已导入。
        # 注意：捕获组末尾可能已经带逗号（多行 import 的尾随逗号），必须先 rstrip 掉逗号，
        # 否则会生成 `Query,, HttpCode` —— 这个坑已经踩过一次。
        if "HttpCode" not in text.split("} from '@nestjs/common';")[0]:
            text = re.sub(
                r"import \{([^}]*)\} from '@nestjs/common';",
                lambda mm: "import {"
                + mm.group(1).rstrip().rstrip(",")
                + ", HttpCode } from '@nestjs/common';",
                text,
                count=1,
            )

    if added_here:
        path.write_text(text, encoding="utf-8")
        total += added_here
        print(f"  {path}: +{added_here}")

print(f"\n共补 @HttpCode(200) {total} 处（应等于 POST 路由数 14）")
