import { SectionHeading } from "@/components/shared/section-heading";
import { techStack } from "@/data/tech-stack";

// Brand colors cho từng tech
const TECH_META: Record<string, { color: string; bg: string; abbr?: string }> = {
  "React":        { color: "#0EA5E9", bg: "#E0F7FE" },
  "Next.js":      { color: "#1a1a1a", bg: "#EBEBEB" },
  "TypeScript":   { color: "#3178C6", bg: "#DBEAFE", abbr: "TS" },
  "Tailwind CSS": { color: "#06B6D4", bg: "#CFFAFE", abbr: "TW" },
  "JavaScript":   { color: "#CA8A04", bg: "#FEF9C3", abbr: "JS" },
  "Node.js":      { color: "#16A34A", bg: "#DCFCE7" },
  "NestJS":       { color: "#E0234E", bg: "#FFE4E6" },
  "Express":      { color: "#374151", bg: "#F3F4F6" },
  "REST API":     { color: "#6366F1", bg: "#EEF2FF", abbr: "API" },
  "PostgreSQL":   { color: "#2563EB", bg: "#DBEAFE", abbr: "PG" },
  "MySQL":        { color: "#1D6FA4", bg: "#DBEAFE", abbr: "MY" },
  "Prisma ORM":   { color: "#5C6BC0", bg: "#E8EAF6", abbr: "PR" },
  "Redis":        { color: "#DC2626", bg: "#FEE2E2" },
  "Git":          { color: "#EA580C", bg: "#FFEDD5" },
  "Docker":       { color: "#2496ED", bg: "#DBEAFE" },
  "Figma":        { color: "#E14716", bg: "#FFF0EB" },
  "Vercel":       { color: "#1a1a1a", bg: "#EBEBEB" },
  "Linux":        { color: "#B45309", bg: "#FEF3C7" },
};

// Màu accent cho từng category
const CATEGORY_META: Record<string, { color: string; bg: string }> = {
  "Frontend":       { color: "#3B82F6", bg: "#EFF6FF" },
  "Backend":        { color: "#10B981", bg: "#F0FDF4" },
  "Database":       { color: "#8B5CF6", bg: "#F5F3FF" },
  "Tools & Platform": { color: "#F59E0B", bg: "#FFFBEB" },
};

function getAbbr(name: string): string {
  return TECH_META[name]?.abbr ?? name.slice(0, 2).toUpperCase();
}

function TechChip({ name }: { name: string }) {
  const meta = TECH_META[name] ?? { color: "#6B7280", bg: "#F3F4F6" };
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all hover:shadow-sm hover:-translate-y-px cursor-default"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      <span
        className="w-6 h-6 rounded-md text-[10px] font-extrabold flex items-center justify-center shrink-0 leading-none"
        style={{ color: meta.color, backgroundColor: meta.bg }}
      >
        {getAbbr(name)}
      </span>
      <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
        {name}
      </span>
    </div>
  );
}

function CategoryCard({ category, items }: { category: string; items: string[] }) {
  const cat = CATEGORY_META[category] ?? { color: "#6B7280", bg: "#F9FAFB" };
  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--bg-surface)",
        boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
        borderTop: `3px solid ${cat.color}`,
      }}
    >
      {/* Category header */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: cat.color }}
        />
        <span
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: cat.color }}
        >
          {category}
        </span>
      </div>

      {/* Tech chips */}
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <TechChip key={item} name={item} />
        ))}
      </div>
    </div>
  );
}

export function TechStack() {
  return (
    <section
      id="tech"
      className="section-padding border-t"
      style={{ backgroundColor: "var(--bg-base)", borderColor: "var(--border-color)" }}
    >
      <div className="container-width">
        <SectionHeading label="Stack" title="Công nghệ mình sử dụng" />

        <div className="grid md:grid-cols-2 gap-5">
          {techStack.map((group) => (
            <CategoryCard key={group.category} category={group.category} items={group.items} />
          ))}
        </div>
      </div>
    </section>
  );
}
