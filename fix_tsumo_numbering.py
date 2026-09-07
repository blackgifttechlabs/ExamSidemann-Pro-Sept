#!/usr/bin/env python3

import re
import sys
import shutil
import unicodedata
from pathlib import Path

if len(sys.argv) != 2:
    print("Usage: python3 fix_tsumo_numbering.py <file>")
    sys.exit(1)

file_path = Path(sys.argv[1])

if not file_path.exists():
    print(f"File not found: {file_path}")
    sys.exit(1)

# Backup original
backup_path = file_path.with_suffix(file_path.suffix + ".backup")
shutil.copy2(file_path, backup_path)
print(f"✓ Backup created: {backup_path}")

content = file_path.read_text(encoding="utf-8")

# Find TSUMO_LIST
pattern = re.compile(
    r'(const\s+TSUMO_LIST\s*:\s*TsumoItem\[\]\s*=\s*\[\n)'
    r'(.*?)'
    r'(\n\];)',
    re.DOTALL,
)

match = pattern.search(content)

if not match:
    print("ERROR: Could not find TSUMO_LIST")
    sys.exit(1)

prefix = match.group(1)
list_content = match.group(2)
suffix = match.group(3)

# Each tsumo object is on one line
entries = [
    line
    for line in list_content.splitlines()
    if line.strip()
]

def get_shona(entry):
    match = re.search(
        r'shona:\s*"((?:\\.|[^"\\])*)"',
        entry,
    )

    if not match:
        raise ValueError(
            f"Could not extract shona from:\n{entry[:200]}"
        )

    return match.group(1)

def sort_key(entry):
    shona = get_shona(entry)
    shona = unicodedata.normalize("NFKD", shona)
    return shona.casefold()

# Sort alphabetically
entries.sort(key=sort_key)

# Renumber 1, 2, 3...
renumbered = []

for number, entry in enumerate(entries, start=1):
    entry = re.sub(
        r'(\{\s*num:\s*)\d+',
        rf'\g<1>{number}',
        entry,
        count=1,
    )
    renumbered.append(entry)

new_list = "\n".join(renumbered)

new_content = (
    content[:match.start()]
    + prefix
    + new_list
    + suffix
    + content[match.end():]
)

file_path.write_text(new_content, encoding="utf-8")

print(f"✓ Sorted alphabetically")
print(f"✓ Renumbered {len(entries)} tsumo")
print(f"✓ Updated: {file_path}")
print(f"✓ Backup:  {backup_path}")
