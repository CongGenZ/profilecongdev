"use client";

import Image from "next/image";
import { ArrowRight, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialLinks } from "@/components/shared/social-links";
import { profile } from "@/data/profile";
import { motion } from "motion/react";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="section-padding pt-28 md:pt-36 hero-gradient"
    >
      <div className="container-width">
        <div className="grid md:grid-cols-[1fr_auto] gap-12 md:gap-16 items-center">
          {/* Left */}
          <div>
            <motion.div
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.4 }}
            >
              {/* Available badge */}
              {profile.available && (
                <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border mb-6"
                  style={{
                    borderColor: "var(--border-color)",
                    color: "var(--text-secondary)",
                    backgroundColor: "var(--bg-surface)",
                  }}
                >
                  <Circle
                    size={7}
                    fill="#22c55e"
                    className="text-green-500"
                  />
                  Available for freelance projects
                </div>
              )}

              <p
                className="text-sm mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Xin chào, mình là {profile.name}
              </p>

              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                {profile.tagline}
              </h1>

              <p
                className="text-base md:text-lg leading-relaxed max-w-lg mb-8"
                style={{ color: "var(--text-secondary)" }}
              >
                Mình là một Web Developer, chuyên phát triển website, ứng dụng và các giải pháp phần mềm. Mình nhận triển khai dự án từ ý tưởng đến sản phẩm hoàn thiện.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <Button
                  className="h-10 px-5 text-sm font-medium"
                  style={{
                    backgroundColor: "var(--accent-color)",
                    color: "#fff",
                  }}
                  onClick={() => scrollTo("contact")}
                >
                  Trao đổi dự án
                  <ArrowRight size={15} className="ml-1" />
                </Button>
                <Button
                  variant="outline"
                  className="h-10 px-5 text-sm font-medium border"
                  style={{
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                    backgroundColor: "transparent",
                  }}
                  onClick={() => scrollTo("projects")}
                >
                  Xem dự án
                </Button>
              </div>

              <SocialLinks />
            </motion.div>
          </div>

          {/* Right — Avatar */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex justify-center md:justify-end"
          >
            <div
              className="relative w-52 h-52 md:w-64 md:h-64 rounded-xl overflow-hidden border"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--muted)",
              }}
            >
              <Image
                src={profile.avatar}
                alt={profile.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 208px, 256px"
              />
              {/* Fallback placeholder text visible if image 404s via CSS */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
