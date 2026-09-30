interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  label,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div className={`mb-12 ${isCenter ? "text-center" : ""}`}>
      {label && (
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.13em] uppercase mb-4 px-3 py-1.5 rounded-full border"
          style={{
            color: "var(--label-color)",
            background: "linear-gradient(135deg, #FEF9EE 0%, #FEF3C7 100%)",
            borderColor: "rgba(180, 83, 9, 0.18)",
            boxShadow: "0 1px 3px rgba(180, 83, 9, 0.08)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: "var(--label-color)", opacity: 0.8 }}
          />
          {label}
        </span>
      )}
      <h2
        className="text-2xl md:text-3xl font-semibold tracking-tight leading-snug"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-3 text-base leading-relaxed max-w-xl ${isCenter ? "mx-auto" : ""}`}
          style={{ color: "var(--text-secondary)" }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
