import { SectionHeading } from "@/components/shared/section-heading";
import { workSteps } from "@/data/tech-stack";

export function WorkProcess() {
  return (
    <section
      id="process"
      className="section-padding border-t"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="container-width">
        <SectionHeading
          label="Process"
          title="Quy trình làm việc"
          description="Mình làm việc theo quy trình rõ ràng để đảm bảo dự án đúng tiến độ và đúng yêu cầu."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {workSteps.map((step, index) => (
            <div
              key={step.number}
              className={`relative p-6 ${
                index < workSteps.length - 1
                  ? "sm:border-r"
                  : ""
              } ${index > 0 ? "border-t sm:border-t-0" : ""}`}
              style={{ borderColor: "var(--border-color)" }}
            >
              {/* Step number */}
              <p
                className="text-3xl font-bold mb-3 leading-none"
                style={{ color: "var(--border-color)" }}
              >
                {step.number}
              </p>

              <h3
                className="font-semibold text-sm mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {step.title}
              </h3>

              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {step.description}
              </p>

              {/* Connector dot */}
              {index < workSteps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-6 -right-1 w-2 h-2 rounded-full border z-10"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-surface)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
