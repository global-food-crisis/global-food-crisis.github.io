#!/usr/bin/env python3
"""Quick structural inspection of the site's processed data files."""
import json
from pathlib import Path

DATA = Path("/home/z/my-project/public/data")

def summarize(path: Path):
    obj = json.loads(path.read_text())
    print(f"\n=== {path.name} ===")
    if isinstance(obj, dict):
        for k, v in obj.items():
            if isinstance(v, list):
                print(f"  {k}: list[{len(v)}] first={json.dumps(v[0], ensure_ascii=False)[:180] if v else None}")
            elif isinstance(v, dict):
                print(f"  {k}: dict keys={list(v.keys())[:8]}")
            else:
                print(f"  {k}: {json.dumps(v, ensure_ascii=False)[:180]}")

for name in sorted(p.name for p in DATA.glob("*.json")):
    summarize(DATA / name)
