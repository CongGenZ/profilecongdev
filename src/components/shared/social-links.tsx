import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/icons";
import { profile } from "@/data/profile";

interface SocialLinksProps {
  className?: string;
  iconSize?: number;
}

export function SocialLinks({ className = "", iconSize = 18 }: SocialLinksProps) {
  const links = [
    {
      href: profile.github,
      label: "GitHub",
      icon: <GithubIcon size={iconSize} />,
    },
    {
      href: profile.linkedin,
      label: "LinkedIn",
      icon: <LinkedinIcon size={iconSize} />,
    },
    {
      href: `mailto:${profile.email}`,
      label: "Email",
      icon: <Mail size={iconSize} />,
    },
  ];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("mailto") ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={link.label}
          className="flex items-center justify-center w-9 h-9 rounded-md border transition-colors duration-150 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"
          style={{
            borderColor: "var(--border-color)",
            color: "var(--text-secondary)",
          }}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
