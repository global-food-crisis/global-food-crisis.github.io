#!/usr/bin/env python3
"""check_tsc_baseline.py — TypeScript known-issue baseline gate.

Compares the current `tsc --noEmit` diagnostics against the documented
baseline in tests/typescript-baseline.txt.

Policy:
  - exit 0 (PASS): every current diagnostic is already listed in the
    baseline (i.e. no NEW type errors were introduced).
  - exit 1 (FAIL): at least one current diagnostic is NOT in the baseline.
    A failure means a new type regression and should block the PR.
  - Diagnostics that are in the baseline but no longer produced are
    reported as "resolved" so the baseline can be shrunk — never silently
    hidden.

Normalization: the repository root's absolute path is replaced with
<ROOT> on both sides, so the baseline is stable across machines, CI
runners and operating systems (tsc embeds absolute paths inside some
diagnostic messages, e.g. TS2694 namespace strings).

Usage:
  python3 scripts/check_tsc_baseline.py <tsc-output-file>    # gate mode
  python3 scripts/check_tsc_baseline.py --write <file>      # re-baseline mode
"""
import os
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASELINE_FILE = os.path.join(BASE, "tests", "typescript-baseline.txt")
DIAGNOSTIC_MARKER = ": error TS"


def normalize(line: str) -> str:
    """Make one diagnostic line environment-independent."""
    line = line.rstrip("\r\n")
    root_posix = BASE + "/"
    root_windows = BASE.replace("/", os.sep) + os.sep if os.name == "nt" else None
    line = line.replace(root_posix, "<ROOT>/")
    if root_windows:
        line = line.replace(root_windows, "<ROOT>/")
    # Windows tsc may also print the repo root with forward slashes but a
    # drive letter; normalize the separator variant too.
    line = line.replace(BASE + "\\", "<ROOT>/")
    return line


def parse_baseline() -> set:
    entries = set()
    with open(BASELINE_FILE, encoding="utf-8") as fh:
        for raw in fh:
            line = raw.strip()
            if not line or line.startswith("#"):
                continue
            if DIAGNOSTIC_MARKER in line:
                entries.add(line)
    return entries


def parse_current(path: str) -> set:
    entries = set()
    with open(path, encoding="utf-8", errors="replace") as fh:
        for raw in fh:
            line = normalize(raw).strip()
            if DIAGNOSTIC_MARKER in line:
                entries.add(line)
    return entries


def write_baseline(current: set) -> None:
    header = (
        "# tests/typescript-baseline.txt — documented known type issues\n"
        "# -------------------------------------------------------------\n"
        "# These tsc diagnostics are PRE-EXISTING from the original baseline\n"
        "# commit 99bdf68 (verified byte-identical there; see the verification\n"
        "# reports dated 2026-10-26 and 2026-10-27). They do not gate the\n"
        "# production build (next.config.ts documents ignoreBuildErrors for\n"
        "# this reason) and are tracked here so PR CI can tell \"known issue\"\n"
        "# from \"new regression\".\n"
        "#\n"
        "# Gate policy (scripts/check_tsc_baseline.py, wired into\n"
        "# .github/workflows/pr-validation.yml):\n"
        "#   PASS  — current diagnostics are a subset of this file\n"
        "#   FAIL  — any diagnostic not listed here (new regression)\n"
        "#   INFO  — disappeared diagnostics are reported as resolved\n"
        "#\n"
        "# Regenerate after fixing or intentionally re-baselining:\n"
        "#   bunx tsc --noEmit > tsc-current.txt\n"
        "#   python3 scripts/check_tsc_baseline.py --write tsc-current.txt\n"
    )
    with open(BASELINE_FILE, "w", encoding="utf-8") as fh:
        fh.write(header)
        for entry in sorted(current):
            fh.write(entry + "\n")
    print(f"Baseline rewritten with {len(current)} diagnostics: {BASELINE_FILE}")


def main() -> int:
    args = sys.argv[1:]
    write_mode = False
    if args and args[0] == "--write":
        write_mode = True
        args = args[1:]
    if len(args) != 1:
        print(__doc__)
        return 2
    current = parse_current(args[0])
    if write_mode:
        write_baseline(current)
        return 0

    baseline = parse_baseline()
    new = current - baseline
    resolved = baseline - current

    print(f"tsc diagnostics: {len(current)} current, {len(baseline)} in baseline")
    for line in sorted(resolved):
        print(f"  RESOLVED (baseline entry no longer produced, shrink baseline): {line}")
    if not current:
        print("  Current tree is type-clean (no diagnostics at all).")
    if new:
        print("NEW TYPE ERRORS (not in the documented baseline):")
        for line in sorted(new):
            print(f"  {line}")
        print("FAIL — fix the new diagnostics or explicitly re-baseline them.")
        return 1
    print("PASS — no new type regressions; all current diagnostics are documented in the baseline.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
