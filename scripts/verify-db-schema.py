# -*- coding: utf-8 -*-
"""独立核对 SQLite 实际表结构（不依赖 Prisma CLI 的自述）。

用法: python scripts/verify-db-schema.py server/prisma/dev.db
"""
import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from pathlib import Path

db = Path(sys.argv[1] if len(sys.argv) > 1 else "server/prisma/dev.db")
if not db.exists():
    print(f"库不存在: {db}")
    raise SystemExit(1)

conn = sqlite3.connect(str(db))
tables = [
    r[0]
    for r in conn.execute(
        "select name from sqlite_master where type='table' and name not like '_prisma%' and name not like 'sqlite_%' order by name"
    )
]

print(f"=== {db} 共 {len(tables)} 张表 ===")
for t in tables:
    cols = list(conn.execute(f'pragma table_info("{t}")'))
    money = [c[1] for c in cols if c[1].endswith("Cents")]
    json_cols = [c[1] for c in cols if (c[2] or "").upper() == "JSONB"]
    print(f"  {t:<34} {len(cols):>2} 列   金额分列 {len(money):>2}   Json {len(json_cols):>2}")

# 关键校验：金额列必须是 INTEGER
print("\n=== 金额列类型核对（必须全是 INTEGER）===")
bad = []
for t in tables:
    for c in conn.execute(f'pragma table_info("{t}")'):
        if c[1].endswith("Cents") and (c[2] or "").upper() != "INTEGER":
            bad.append(f"{t}.{c[1]} = {c[2]}")
print("  全部为 INTEGER ✓" if not bad else "  ❌ 非整数: " + "; ".join(bad))

# 关键校验：不允许出现 PG 专有的数组类型
print("\n=== 是否混入 PG 专有类型（数组等）===")
suspicious = []
for t in tables:
    for c in conn.execute(f'pragma table_info("{t}")'):
        ctype = (c[2] or "").upper()
        if "[" in ctype or ctype.endswith("[]"):
            suspicious.append(f"{t}.{c[1]} = {c[2]}")
print("  无 ✓" if not suspicious else "  ❌ " + "; ".join(suspicious))

# 关系表与索引
print("\n=== 外键与索引 ===")
for t in tables:
    fks = list(conn.execute(f'pragma foreign_key_list("{t}")'))
    idx = [r[1] for r in conn.execute(f'pragma index_list("{t}")') if r[1] and not r[1].startswith("sqlite_")]
    if fks or idx:
        fk_desc = ", ".join(f"{f[3]}→{f[2]}.{f[4]}" for f in fks)
        print(f"  {t:<34} FK[{fk_desc}] IDX{idx}")

raise SystemExit(1 if bad or suspicious else 0)
