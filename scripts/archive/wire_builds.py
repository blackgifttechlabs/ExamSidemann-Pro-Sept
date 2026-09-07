import sys

path = sys.argv[1]
with open(path, encoding='utf-8') as f:
    content = f.read()

replacements = [
    ("answer: 'BÔA = 180° − 180° + 2x° = 2x°' },",
     "answer: 'BÔA = 180° − 180° + 2x° = 2x°', build: build_Example1Diagram },"),

    ("'By the same symmetry, angle TBX must equal angle TAX.'], answer: 'TBX = 51°' },",
     "'By the same symmetry, angle TBX must equal angle TAX.'], answer: 'TBX = 51°', build: build_Example2Diagram },"),

    ("'The angle at the centre is twice the angle at the circumference standing on the same arc, so angle XZY = half of 122°.'], answer: 'XZY = 61° (or 119° if Z is taken on the minor arc instead)' },",
     "'The angle at the centre is twice the angle at the circumference standing on the same arc, so angle XZY = half of 122°.'], answer: 'XZY = 61° (or 119° if Z is taken on the minor arc instead)', build: build_Example3Diagram },"),

    ("answer: 'The radii are 5 cm (A), 8 cm (B) and 6 cm (C).' },",
     "answer: 'The radii are 5 cm (A), 8 cm (B) and 6 cm (C).', build: build_Example4Diagram },"),

    ("answer: 'By the alternate segment theorem, SQX = SQR = 77°' },",
     "answer: 'By the alternate segment theorem, SQX = SQR = 77°', build: build_Example5Diagram },"),

    ("answer: 'BCT = 180° − 49° = 131°' },",
     "answer: 'BCT = 180° − 49° = 131°', build: build_Example6Diagram },"),

    ("answer: 'BÔA = 2x°' },",
     "answer: 'BÔA = 2x°', build: build_Example1Diagram },"),

    ("'By symmetry, angle TBX = angle TAX.'], answer: 'TBX = 51°' },",
     "'By symmetry, angle TBX = angle TAX.'], answer: 'TBX = 51°', build: build_Example2Diagram },"),

    ("answer: 'XZY = 61° (or 119° on the minor arc)' },",
     "answer: 'XZY = 61° (or 119° on the minor arc)', build: build_Example3Diagram },"),

    ("answer: 'Radii: 5 cm, 8 cm, 6 cm' },",
     "answer: 'Radii: 5 cm, 8 cm, 6 cm', build: build_Example4Diagram },"),

    ("answer: 'By the alternate segment theorem, SQX = 77°' },",
     "answer: 'By the alternate segment theorem, SQX = 77°', build: build_Example5Diagram },"),

    ("answer: 'BCT = 131°' },",
     "answer: 'BCT = 131°', build: build_Example6Diagram },"),
]

missing = []
for old, new in replacements:
    count = content.count(old)
    if count != 1:
        missing.append((count, old[:60]))
    else:
        content = content.replace(old, new)

if missing:
    print("WARNING - these did not match exactly once (count, snippet):")
    for count, snippet in missing:
        print(f"  [{count}] {snippet}...")
    print("File was still updated for the ones that matched.")
else:
    print("All 12 replacements applied successfully.")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
