import { SectionHeading } from "@/components/shared/section-heading";
import { profile } from "@/data/profile";

export function About() {
  const paragraphs = profile.bio
    .trim()
    .split("\n\n")
    .filter(Boolean);

  return (
    <section
      id="about"
      className="section-padding border-t"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="container-width">
        <div className="grid md:grid-cols-[1fr_2fr] gap-10 md:gap-16 items-start">
          {/* Left label */}
          <div>
            <SectionHeading
              label="About"
              title="Một chút về mình"
            />
          </div>

          {/* Right content */}
          <div>
            <div className="space-y-4">
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-base leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {p.trim()}
                </p>
              ))}
            </div>

            {/* Highlights */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Kinh nghiệm", value: "2+ năm" },
                { label: "Dự án thực hiện", value: "10+" },
                { label: "Khách hàng", value: "Freelance" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="border rounded-lg p-4"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-base)",
                  }}
                >
                  <p
                    className="text-xl font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.value}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
