import { Star, Quote } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { testimonials } from "@/data/experience";

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="section-padding border-t"
      style={{
        backgroundColor: "var(--bg-base)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="container-width">
        <SectionHeading
          label="Testimonials"
          title="Phản hồi từ khách hàng & đối tác"
          description="Sự hài lòng về tiến độ, chất lượng code và hiệu quả vận hành thực tế sau khi bàn giao."
        />

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between p-6 rounded-2xl border transition-all hover:border-[var(--accent-color)]/40 hover:shadow-sm"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-color)",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: item.rating }).map((_, idx) => (
                      <Star key={idx} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <Quote
                    size={20}
                    style={{ color: "var(--border-color)" }}
                  />
                </div>

                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>

              <div
                className="pt-4 border-t"
                style={{ borderColor: "var(--border-color)" }}
              >
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.name}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.role} · {item.company}
                </p>
                <span
                  className="inline-block mt-2 text-[11px] font-medium px-2.5 py-0.5 rounded-md border"
                  style={{
                    backgroundColor: "var(--bg-base)",
                    borderColor: "var(--border-color)",
                    color: "var(--accent-color)",
                  }}
                >
                  Dự án: {item.project}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

