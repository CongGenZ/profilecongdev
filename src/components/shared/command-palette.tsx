"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  FolderGit2,
  Calculator,
  MessageCircle,
  Mail,
  Sun,
  ExternalLink,
  Copy,
  Check,
  Compass,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";

interface CommandItem {
  id: string;
  group: string;
  label: string;
  hint?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpenPalette = () => setOpen(true);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("open-command-palette", onOpenPalette);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("open-command-palette", onOpenPalette);
    };
  }, []);

  const navigateToSection = (hash: string) => {
    setOpen(false);
    const id = hash.replace("#", "");
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/${hash}`);
    }
  };

  const items: CommandItem[] = useMemo(
    () => [
      {
        id: "act-chat",
        group: "Thao tác nhanh",
        label: "Mở Live Chat với Cong Dev (Kết nối Telegram)",
        hint: "Chat 24/7",
        icon: MessageCircle,
        action: () => {
          setOpen(false);
          window.dispatchEvent(new CustomEvent("open-chat-widget"));
        },
      },
      {
        id: "act-estimator",
        group: "Thao tác nhanh",
        label: "Ước tính chi phí & thời gian làm dự án",
        hint: "Estimator",
        icon: Calculator,
        action: () => navigateToSection("#estimator"),
      },
      {
        id: "act-theme",
        group: "Thao tác nhanh",
        label: "Chuyển đổi giao diện Sáng / Tối (Dark Mode)",
        hint: "Theme",
        icon: Sun,
        action: () => {
          setOpen(false);
          window.dispatchEvent(new CustomEvent("toggle-theme"));
        },
      },
      {
        id: "act-copy-email",
        group: "Thao tác nhanh",
        label: copied ? "Đã sao chép Email vào Clipboard!" : `Sao chép Email (${profile.email})`,
        hint: "Copy",
        icon: copied ? Check : Copy,
        action: () => {
          navigator.clipboard?.writeText(profile.email);
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
            setOpen(false);
          }, 900);
        },
      },
      {
        id: "nav-about",
        group: "Điều hướng",
        label: "Giới thiệu & Lộ trình kinh nghiệm (CV)",
        icon: Compass,
        action: () => navigateToSection("#about"),
      },
      {
        id: "nav-services",
        group: "Điều hướng",
        label: "Các gói dịch vụ phát triển Web & App",
        icon: Compass,
        action: () => navigateToSection("#services"),
      },
      {
        id: "nav-testimonials",
        group: "Điều hướng",
        label: "Đánh giá từ khách hàng & đối tác",
        icon: Compass,
        action: () => navigateToSection("#testimonials"),
      },
      {
        id: "nav-contact",
        group: "Điều hướng",
        label: "Gửi yêu cầu liên hệ & tư vấn dự án",
        icon: Mail,
        action: () => navigateToSection("#contact"),
      },
      ...projects.map((p) => ({
        id: `proj-${p.slug}`,
        group: "Dự án & Case Studies",
        label: `${p.title} (${p.category})`,
        hint: p.year,
        icon: FolderGit2,
        action: () => {
          setOpen(false);
          router.push(`/projects/${p.slug}`);
        },
      })),
      {
        id: "ext-github",
        group: "Liên kết",
        label: "Mở GitHub (@CongGenZ)",
        hint: "External",
        icon: ExternalLink,
        action: () => {
          setOpen(false);
          window.open(profile.github, "_blank", "noopener,noreferrer");
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [copied, pathname]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        i.group.toLowerCase().includes(q) ||
        (i.hint && i.hint.toLowerCase().includes(q))
    );
  }, [items, query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border overflow-hidden shadow-2xl"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-color)",
            }}
          >
            {/* Search input */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 border-b"
              style={{ borderColor: "var(--border-color)" }}
            >
              <Search size={17} style={{ color: "var(--text-secondary)" }} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm dự án, báo giá, mở chat hoặc chuyển trang..."
                className="flex-1 text-sm bg-transparent outline-none"
                style={{ color: "var(--text-primary)" }}
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs px-2 py-1 rounded border cursor-pointer"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--text-secondary)",
                }}
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[360px] overflow-y-auto p-2 space-y-1">
              {filtered.length === 0 ? (
                <p
                  className="text-xs text-center py-8"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Không tìm thấy kết quả phù hợp.
                </p>
              ) : (
                filtered.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={item.action}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left text-xs md:text-sm transition-colors hover:bg-[var(--bg-base)] cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0"
                          style={{
                            borderColor: "var(--border-color)",
                            backgroundColor: "var(--bg-base)",
                            color: "var(--accent-color)",
                          }}
                        >
                          <Icon size={14} />
                        </span>
                        <div className="truncate">
                          <p
                            className="font-medium truncate"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {item.label}
                          </p>
                          <p
                            className="text-[11px]"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {item.group}
                          </p>
                        </div>
                      </div>
                      {item.hint && (
                        <span
                          className="text-[11px] px-2 py-0.5 rounded border shrink-0"
                          style={{
                            borderColor: "var(--border-color)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {item.hint}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

