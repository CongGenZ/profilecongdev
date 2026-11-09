import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock, ExternalLink, ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/shared/icons";
import { profile } from "@/data/profile";

export function Footer() {
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: "Giới thiệu", href: "#about" },
    { label: "Dịch vụ", href: "#services" },
    { label: "Dự án tiêu biểu", href: "#projects" },
    { label: "Quy trình làm việc", href: "#process" },
    { label: "Liên hệ tư vấn", href: "#contact" },
  ];

  return (
    <footer
      className="border-t pt-14 pb-8 transition-colors"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      <div className="container-width">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Cột 1: Brand, Tagline & Socials (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              {/* Logo nổi bật phóng to */}
              <Link
                href="/"
                aria-label={profile.displayName}
                className="inline-block group transition-transform hover:scale-105"
              >
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-[var(--border-color)] group-hover:border-[var(--accent-color)] shadow-md transition-all duration-300">
                  <Image
                    src={profile.logo || "/congdev.png"}
                    alt={profile.displayName}
                    fill
                    sizes="(max-width: 768px) 80px, 96px"
                    className="object-cover"
                    priority
                  />
                </div>
              </Link>

              {/* Tagline */}
              <p
                className="text-xs leading-relaxed mt-4 max-w-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Chuyên phát triển Website & Web Application theo yêu cầu với hiệu năng cao,
                giao diện hiện đại và tối ưu trải nghiệm người dùng.
              </p>

              {/* Status Badge */}
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border"
                style={{
                  backgroundColor: "rgba(34, 197, 94, 0.08)",
                  borderColor: "rgba(34, 197, 94, 0.25)",
                  color: "#15803d",
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Sẵn sàng nhận dự án mới</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 mt-6">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all hover:scale-105 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"
                  style={{
                    borderColor: "var(--border-color)",
                    color: "var(--text-secondary)",
                    backgroundColor: "var(--bg-base)",
                  }}
                >
                  <GithubIcon size={16} />
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all hover:scale-105 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"
                  style={{
                    borderColor: "var(--border-color)",
                    color: "var(--text-secondary)",
                    backgroundColor: "var(--bg-base)",
                  }}
                >
                  <LinkedinIcon size={16} />
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="Email"
                  className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all hover:scale-105 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"
                  style={{
                    borderColor: "var(--border-color)",
                    color: "var(--text-secondary)",
                    backgroundColor: "var(--bg-base)",
                  }}
                >
                  <Mail size={16} />
                </a>
              )}
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  aria-label="Điện thoại"
                  className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all hover:scale-105 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"
                  style={{
                    borderColor: "var(--border-color)",
                    color: "var(--text-secondary)",
                    backgroundColor: "var(--bg-base)",
                  }}
                >
                  <Phone size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Cột 2: Thông tin liên lạc & Giờ làm việc (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <h3
              className="font-semibold text-sm tracking-wide uppercase mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Liên hệ trực tiếp
            </h3>
            <ul className="flex flex-col gap-3 text-xs">
              {profile.phone && (
                <li className="flex items-start gap-2.5">
                  <Phone
                    size={15}
                    className="shrink-0 mt-0.5 text-[var(--accent-color)]"
                  />
                  <div>
                    <span className="block font-medium" style={{ color: "var(--text-primary)" }}>
                      Hotline / Zalo:
                    </span>
                    <a
                      href={`tel:${profile.phone}`}
                      className="transition-colors hover:text-[var(--accent-color)] font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {profile.phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")}
                    </a>
                  </div>
                </li>
              )}
              <li className="flex items-start gap-2.5">
                <Mail
                  size={15}
                  className="shrink-0 mt-0.5 text-[var(--accent-color)]"
                />
                <div>
                  <span className="block font-medium" style={{ color: "var(--text-primary)" }}>
                    Email:
                  </span>
                  <a
                    href={`mailto:${profile.email}`}
                    className="transition-colors hover:text-[var(--accent-color)] break-all"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {profile.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock
                  size={15}
                  className="shrink-0 mt-0.5 text-[var(--accent-color)]"
                />
                <div>
                  <span className="block font-medium" style={{ color: "var(--text-primary)" }}>
                    Giờ hỗ trợ:
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    Thứ 2 – Thứ 7 (08:00 – 21:00)
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin
                  size={15}
                  className="shrink-0 mt-0.5 text-[var(--accent-color)]"
                />
                <div>
                  <span className="block font-medium" style={{ color: "var(--text-primary)" }}>
                    Địa bàn:
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    Landmark 72, Hà Nội & Remote toàn quốc
                  </span>
                </div>
              </li>
            </ul>

            {/* Quick Links */}
            <div className="mt-5 pt-4 border-t" style={{ borderColor: "var(--border-color)" }}>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
                {quickLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="transition-colors hover:text-[var(--accent-color)]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Cột 3: Bản đồ ghim vị trí Landmark 72 (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[var(--accent-color)]" />
                <h3
                  className="font-semibold text-sm tracking-wide"
                  style={{ color: "var(--text-primary)" }}
                >
                  Vị trí trên bản đồ
                </h3>
              </div>
              <span
                className="text-[11px] px-2 py-0.5 rounded font-medium border"
                style={{
                  backgroundColor: "var(--bg-base)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-secondary)",
                }}
              >
                Landmark 72
              </span>
            </div>

            {/* Map Frame Card */}
            <div
              className="relative rounded-xl overflow-hidden border shadow-sm flex-1 min-h-[170px] flex flex-col"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-base)",
              }}
            >
              <iframe
                title="Bản đồ vị trí Landmark 72 - Cong Dev"
                src={
                  profile.mapEmbedUrl ||
                  "https://maps.google.com/maps?q=Keangnam+Landmark+72+Hanoi&t=&z=15&ie=UTF8&iwloc=&output=embed"
                }
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "155px" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full flex-1"
              />

              {/* Bottom bar of Map Box */}
              <div
                className="px-3 py-2 border-t flex items-center justify-between text-xs"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="truncate pr-2">
                  <p
                    className="font-medium truncate text-[11px]"
                    style={{ color: "var(--text-primary)" }}
                    title={profile.address}
                  >
                    {profile.address || "Tòa Keangnam Landmark 72, Phạm Hùng, Nam Từ Liêm, Hà Nội"}
                  </p>
                </div>
                <a
                  href={
                    profile.mapDirectionsUrl ||
                    "https://www.google.com/maps/search/?api=1&query=Keangnam+Landmark+72+Hanoi"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 shrink-0 text-[11px] font-semibold text-[var(--accent-color)] hover:underline"
                >
                  <span>Chỉ đường</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{
            borderColor: "var(--border-color)",
            color: "var(--text-secondary)",
          }}
        >
          <p>© {year} {profile.displayName}. Mọi quyền được bảo lưu.</p>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Phát triển với Next.js & Tailwind CSS</span>
            <a
              href="#home"
              aria-label="Về đầu trang"
              className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-[var(--accent-color)]"
            >
              <span>Đầu trang</span>
              <ArrowUp size={13} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
