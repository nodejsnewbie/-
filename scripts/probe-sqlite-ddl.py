# -*- coding: utf-8 -*-
"""查看 Prisma 在 SQLite 上把 enum / Json / Int 落成什么 DDL。"""
import sqlite3
import sys
from pathlib import Path

db = Path(sys.argv[1])
if not db.exists():
    print(f"库不存在: {db}")
    raise SystemExit(1)

conn = sqlite3.connect(str(db))
print(f"=== {db.name} 的 DDL ===")
for name, sql in conn.execute(
    "select name, sql from sqlite_master where type in ('table','index') order by name"
):
    if name.startswith("_prisma"):
        continue
    print(f"--- {name} ---")
    print((sql or "").strip())
    print()

print("=== 插入非法枚举值会怎样 ===")
try:
    conn.execute("insert into Probe (id, status) values ('x', 'NOT_A_VALID_STATUS')")
    conn.commit()
    print("  插入成功 → enum 在 SQLite 上没有 DB 级约束（等价于纯 TEXT）")
except sqlite3.Error as exc:
    print(f"  被拒绝 → {exc}")
