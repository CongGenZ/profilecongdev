"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { profile } from "@/data/profile";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNavClick = (href: string) => {
    setOpen(false);
    const id = href.replace("#", "");

    // Nếu đang ở trang chủ → cuộn mượt đến section
    if (pathname === "/") {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Nếu đang ở trang khác (vd: /projects/xxx) → điều hướng về trang chủ kèm anchor
      router.push(`/${href}`);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-[var(--bg-base)]/95 backdrop-blur-sm border-b"
          : "bg-transparent"
      }`}
      style={{ borderColor: scrolled ? "var(--border-color)" : "transparent" }}
    >
      <div className="container-width">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            aria-label={profile.displayName}
            className="flex items-center transition-transform hover:scale-105 group"
          >
            <div className="relative w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-[var(--border-color)] group-hover:border-[var(--accent-color)] transition-all duration-300 shadow-sm">
              <Image
                src={profile.logo || "/congdev.png"}
                alt={profile.displayName}
                fill
                sizes="(max-width: 768px) 44px, 48px"
                className="object-cover"
                priority
              />
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-sm transition-colors hover:text-[var(--accent-color)] cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA + Mobile menu */}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="hidden md:inline-flex text-sm font-medium h-8 px-4"
              style={{
                backgroundColor: "var(--accent-color)",
                color: "#fff",
              }}
              onClick={() => handleNavClick("#contact")}
            >
              Hire Me
            </Button>

            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                className="flex md:hidden items-center justify-center w-9 h-9 rounded-md border transition-colors hover:border-[var(--accent-color)]"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                  backgroundColor: "transparent",
                }}
                aria-label="Open menu"
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[260px]"
                style={{ backgroundColor: "var(--bg-base)" }}
              >
                <SheetHeader>
                  <SheetTitle className="text-left font-semibold">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--border-color)] shadow-sm">
                      <Image
                        src={profile.logo || "/congdev.png"}
                        alt={profile.displayName}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 mt-6">
                  {navLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => handleNavClick(link.href)}
                      className="text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-[var(--muted)] hover:text-[var(--accent-color)]"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {link.label}
                    </button>
                  ))}
                  <div className="pt-3 mt-2 border-t" style={{ borderColor: "var(--border-color)" }}>
                    <Button
                      className="w-full text-sm font-medium"
                      style={{
                        backgroundColor: "var(--accent-color)",
                        color: "#fff",
                      }}
                      onClick={() => handleNavClick("#contact")}
                    >
                      Hire Me
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
