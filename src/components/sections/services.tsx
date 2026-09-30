import { Globe, Layout, Smartphone, Wrench } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { services } from "@/data/services";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Globe,
  Layout,
  Smartphone,
  Wrench,
};

export function Services() {
  return (
    <section
      id="services"
      className="section-padding border-t"
      style={{
        backgroundColor: "var(--bg-base)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="container-width">
        <SectionHeading
          label="Services"
          title="Mình có thể giúp bạn những gì?"
        />

        <div className="grid sm:grid-cols-2 gap-5">
          {services.map((service) => {
            const Icon = iconMap[service.icon] ?? Globe;

            return (
              <div
                key={service.id}
                className="border rounded-lg p-6 transition-colors duration-150 hover:border-[var(--accent-color)]/40"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-surface)",
                }}
              >
                {/* Icon */}
                <div
                  className="w-9 h-9 flex items-center justify-center rounded-md border mb-4"
                  style={{
                    borderColor: "var(--border-color)",
                    color: "var(--accent-color)",
                  }}
                >
                  <Icon size={18} />
                </div>

                <h3
                  className="font-semibold text-base mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {service.title}
                </h3>

                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {service.description}
                </p>

                <ul className="space-y-1.5">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span
                        className="w-1 h-1 rounded-full shrink-0"
                        style={{ backgroundColor: "var(--accent-color)" }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
