"""Copy parts of the team site (github.com/abhishekps-web/vajiram-ravi, the git remote `team`, read-only for us) into
src/team/, so our pages are built from its own components (its nav, homepage intro, "Why Vajiram & Ravi" block, faculty
carousel, "Contact us" card and footer, and what they import), only their words and pictures changed. Nothing is ever written to the team repository.

  python scripts/copy-team-parts.py [ref]        (ref defaults to team/main; run `git fetch team` first)

Each file is copied as it is, with its imports pointed at the copies ('@/components/…' -> '@/team/components/…',
'@/lib/…' -> '@/team/lib/…', '@/app/tailwind-sections.css' -> '@/team/tailwind-sections.css'), .jsx/.js renamed to
.tsx/.ts with `// @ts-nocheck` (their project allows JS; ours type-checks strictly), and a line saying where it came from.
Their Tailwind entry is copied with its @source lines kept only for the files copied here. Do not edit the copies:
copy again instead.
"""
import os, re, subprocess, sys

REF = sys.argv[1] if len(sys.argv) > 1 else "team/main"
ROOTS = [
    "components/layout/NavigationBar.jsx",
    "components/sections/Hero/HeroIntro.jsx",
    "components/sections/WhyChoose.jsx",
    "components/layout/Footer.jsx",
    "components/sections/ContactUs.jsx",
    "components/sections/Faculties.tsx",
]
# The About page's words and pictures go into these copies (their data, and HeroIntro's heading and paragraph, which it
# writes inline); a new copy would put the homepage's back, so they are left alone once they exist. Delete one to take it
# again.
KEEP_IF_PRESENT = {"lib/data/hero.ts", "lib/data/why-choose.ts", "components/sections/Hero/HeroIntro.tsx", "components/sections/WhyChoose.tsx", "lib/data/faculty.ts", "components/sections/ContactUs.tsx"}
OUT = "src/team"


def show(path):
    r = subprocess.run(["git", "show", f"{REF}:{path}"], capture_output=True, text=True, encoding="utf-8")
    return r.stdout if r.returncode == 0 else None


def resolve(spec, frm=""):
    """'@/components/ui/Button' (or './batches' from lib/data/hero.js) -> the file in the team tree."""
    base = spec[2:] if spec.startswith("@/") else os.path.normpath(os.path.join(os.path.dirname(frm), spec)).replace("\\", "/")
    for ext in ("", ".tsx", ".ts", ".jsx", ".js", ".css", ".json"):
        if show(base + ext) is not None:
            return base + ext
    raise SystemExit(f"cannot find {spec}")


sha = subprocess.run(["git", "rev-parse", "--short", REF], capture_output=True, text=True).stdout.strip()
IMPORT = re.compile(r"""(from\s+|import\s+)(['"])(@/[^'"]+)\2""")
RELATIVE = re.compile(r"""(?:from\s+|import\s+)(['"])(\.\.?/[^'"]+)\1""")
done, queue, copied = set(), list(ROOTS), []
while queue:
    path = queue.pop()
    if path in done:
        continue
    done.add(path)
    src = show(path)
    if path.endswith(".css") or path.endswith(".json"):
        continue  # the Tailwind entry is handled below; JSON is copied as it is
    for m in IMPORT.finditer(src):
        spec = m.group(3)
        if spec == "@/app/tailwind-sections.css":
            continue
        queue.append(resolve(spec))
    for m in RELATIVE.finditer(src):
        queue.append(resolve(m.group(2), path))

    def point(m):
        spec = m.group(3)
        if spec == "@/app/tailwind-sections.css":
            new = "@/team/tailwind-sections.css"
        elif spec.startswith("@/components/") or spec.startswith("@/lib/"):
            new = "@/team/" + spec[2:]
        else:
            new = spec
        return m.group(1) + m.group(2) + new + m.group(2)

    body = IMPORT.sub(point, src)
    out = path
    if out.endswith(".jsx"):
        out = out[:-4] + ".tsx"
    elif out.endswith(".js"):
        out = out[:-3] + ".ts"
    head = f"// Copied from abhishekps-web/vajiram-ravi ({REF} {sha}): {path}. Read-only copy, do not edit; re-copy with scripts/copy-team-parts.py.\n// @ts-nocheck\n"
    dest = os.path.join(OUT, out)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    if out in KEEP_IF_PRESENT and os.path.exists(dest):
        copied.append(out)
        continue
    open(dest, "w", encoding="utf-8", newline="").write(head + body)
    copied.append(out)

# JSON data the copies import
for path in sorted(done):
    if path.endswith(".json"):
        dest = os.path.join(OUT, path)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        open(dest, "w", encoding="utf-8", newline="").write(show(path))
        copied.append(path)

# their Tailwind entry: @source only for the copies
tw = show("app/tailwind-sections.css")
keep = {c.rsplit(".", 1)[0] for c in copied}


def src_line(m):
    target = os.path.normpath(os.path.join("app", m.group(1))).replace("\\", "/")
    stem = target.rsplit(".", 1)[0]
    if stem in keep:
        new = next(c for c in copied if c.rsplit(".", 1)[0] == stem)
        return f'@source "./{new}";'
    return f"/* (not copied) {m.group(0)} */"


tw = re.sub(r'@source "([^"]+)";', src_line, tw)
open(os.path.join(OUT, "tailwind-sections.css"), "w", encoding="utf-8", newline="").write(
    f"/* Copied from abhishekps-web/vajiram-ravi ({REF} {sha}): app/tailwind-sections.css, @source kept for the copies here. */\n" + tw)
print("copied:", *sorted(copied), sep="\n  ")
