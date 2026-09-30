import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/icons";
import { profile } from "@/data/profile";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t py-10"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      <div className="container-width">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand */}
          <div>
            <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
              {profile.displayName}
              <span style={{ color: "var(--accent-color)" }}>.</span>
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
              Freelance Web Developer · {profile.location}
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-1">
            <a
              href={`mailto:${profile.email}`}
              className="text-xs transition-colors hover:text-[var(--accent-color)]"
              style={{ color: "var(--text-secondary)" }}
            >
              {profile.email}
            </a>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="transition-colors hover:text-[var(--accent-color)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <GithubIcon size={17} />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="transition-colors hover:text-[var(--accent-color)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <LinkedinIcon size={17} />
            </a>
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="transition-colors hover:text-[var(--accent-color)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <Mail size={17} />
            </a>
          </div>
        </div>

        <div
          className="mt-6 pt-5 border-t text-xs"
          style={{
            borderColor: "var(--border-color)",
            color: "var(--text-secondary)",
          }}
        >
          © {year} {profile.displayName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
