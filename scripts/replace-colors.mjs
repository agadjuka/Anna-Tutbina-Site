import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const files = [];
function walk(d) {
  for (const name of fs.readdirSync(d)) {
    if (name === "node_modules" || name === ".git") continue;
    const p = path.join(d, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (/\.(tsx|ts|css)$/.test(name)) files.push(p);
  }
}
walk(root);

const reps = [
  ["hover:border-[#bea692]/50", "hover:border-primary/50"],
  ["hover:border-[#bea692]/40", "hover:border-primary/40"],
  ["hover:border-[#bea692]/30", "hover:border-primary/30"],
  ["focus-visible:ring-[#bea692]/35", "focus-visible:ring-primary/35"],
  ["focus-visible:ring-[#bea692]/30", "focus-visible:ring-primary/30"],
  ["group-hover:ring-[#bea692]/40", "group-hover:ring-primary/40"],
  ["group-hover:ring-[#bea692]/30", "group-hover:ring-primary/30"],
  ["hover:bg-[#bea692]/50", "hover:bg-primary/50"],
  ["hover:bg-[#bea692]/45", "hover:bg-primary/45"],
  ["hover:bg-[#bea692]/10", "hover:bg-primary/10"],
  ["active:bg-[#bea692]/50", "active:bg-primary/50"],
  ["active:bg-[#bea692]/15", "active:bg-primary/15"],
  ["bg-[#bea692]/0", "bg-primary/0"],
  ["bg-[#bea692]/5", "bg-primary/5"],
  ["bg-[#bea692]/3", "bg-primary/3"],
  ["bg-[#bea692]/10", "bg-primary/10"],
  ["bg-[#bea692]/75", "bg-primary/75"],
  ["from-[#bea692]/10", "from-primary/10"],
  ["from-[#bea692]/5", "from-primary/5"],
  ["from-[#bea692]/30", "from-primary/30"],
  ["via-[#bea692]/60", "via-primary/60"],
  ["via-[#bea692]/50", "via-primary/50"],
  ["via-[#bea692]/30", "via-primary/30"],
  ["to-[#bea692]/30", "to-primary/30"],
  ["text-[#bea692]/75", "text-primary/75"],
  ["text-[#bea692]", "text-primary"],
  ["border-2 border-[#bea692]", "border-2 border-primary"],
  ["border-[#bea692]", "border-primary"],
  ["bg-[#bea692]", "bg-primary"],
  ["from-[#bea692]", "from-primary"],
  ["via-[#bea692]", "via-primary"],
  ["to-[#bea692]", "to-primary"],
  ["ring-[#bea692]", "ring-primary"],
  ["hover:text-[#bea692]", "hover:text-primary"],
  ["group-hover:bg-[#bea692]/5", "group-hover:bg-primary/5"],
  ["group-hover:border-[#bea692]/30", "group-hover:border-primary/30"],
  ["border-b border-[#e5e0db]/40", "border-b border-border/40"],
  ["border-[#e5e0db]", "border-border"],
  ["bg-[#e5e0db]/50", "bg-muted/50"],
  ["bg-[#e5e0db]/5", "bg-muted/5"],
  ["bg-[#e5e0db]", "bg-muted"],
  ["hover:bg-[#e5e0db]", "hover:bg-muted"],
  ["via-[#e5e0db]/20", "via-muted/20"],
  ["ring-2 ring-[#e5e0db]", "ring-2 ring-border"],
  ["hover:bg-[#faf8f6]", "hover:bg-background/80"],
];

for (const f of files) {
  let s = fs.readFileSync(f, "utf8");
  const orig = s;
  for (const [a, b] of reps) s = s.split(a).join(b);
  if (s !== orig) {
    fs.writeFileSync(f, s);
    console.log("updated", path.relative(root, f));
  }
}
