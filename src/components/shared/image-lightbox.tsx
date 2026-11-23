"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/i18n/provider";

interface ImageLightboxProps {
  images: string[];
  title: string;
}

export function ImageLightbox({ images, title }: ImageLightboxProps) {
  const { t } = useI18n();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(() => {
    setActiveIndex((idx) => (idx === null ? null : (idx - 1 + images.length) % images.length));
  }, [images.length]);
  const next = useCallback(() => {
    setActiveIndex((idx) => (idx === null ? null : (idx + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, close, prev, next]);

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* Main Cover Image */}
      <div
        onClick={() => setActiveIndex(0)}
        className="group relative aspect-[16/9] w-full rounded-xl overflow-hidden border mb-6 cursor-zoom-in"
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "var(--muted)",
        }}
      >
        <Image
          src={images[0]}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.015]"
          sizes="(max-width: 1120px) 100vw, 1120px"
          priority
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium bg-black/75 text-white backdrop-blur-xs">
            <ZoomIn size={14} />
            {t("Nhấn để phóng to ảnh ({count} ảnh)", { count: images.length })}
          </span>
        </div>
      </div>

      {/* Extra Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className="group relative aspect-[16/10] rounded-lg overflow-hidden border text-left cursor-zoom-in focus:outline-none"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--muted)",
              }}
            >
              <Image
                src={src}
                alt={`${title} screenshot ${i + 1}`}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-black/70 text-white">
                  <ZoomIn size={14} />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
            onClick={close}
          >
            {/* Top controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white/90 z-10">
              <span className="text-xs md:text-sm font-medium px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xs">
                {title} — {t("Ảnh {current} / {total}", { current: activeIndex + 1, total: images.length })}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label={t("Đóng")}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Prev / Next buttons */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  aria-label={t("Ảnh trước")}
                  className="absolute left-3 md:left-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  aria-label={t("Ảnh tiếp theo")}
                  className="absolute right-3 md:right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Active Image */}
            <motion.div
              key={activeIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl aspect-[16/10] rounded-xl overflow-hidden border border-white/15 bg-black/40 shadow-2xl"
            >
              <Image
                src={images[activeIndex]}
                alt={`${title} preview ${activeIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

