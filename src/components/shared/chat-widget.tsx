"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { getSupabaseClient } from "@/lib/supabase";

// ─── Types ─────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "bot" | "admin";
  text: string;
  time: string;
}

function getTime() {
  return new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

const WELCOME: Message = {
  id: "welcome",
  role: "bot",
  text: "Xin chào! 👋 Mình là Cong Dev. Cho mình biết tên bạn và bạn đang cần hỗ trợ gì nhé?",
  time: getTime(),
};

// ─── Component ─────────────────────────────────────────────────────────────

const SESSION_KEY = "chat_session_id";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Khôi phục sessionId từ localStorage khi load lại trang
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) setSessionId(stored);
    } catch { /* private mode hoặc storage bị block */ }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  // ── Supabase Broadcast subscription ─────────────────────────────────────
  // Dùng Broadcast thay vì Postgres Changes:
  // - Client không đọc bảng → không cần anon key có quyền SELECT
  // - Server push vào kênh chat:<uuid> → client chỉ nghe kênh của chính mình
  // - UUID 128-bit ngẫu nhiên → không thể đoán để nghe lén session khác
  useEffect(() => {
    if (!sessionId) return;

    const client = getSupabaseClient();
    const channel = client
      .channel(`chat:${sessionId}`)
      .on(
        "broadcast",
        { event: "new_message" },
        ({ payload }: { payload: { id: string; text: string; created_at: string } }) => {
          setMessages(prev => [
            ...prev,
            {
              id: payload.id,
              role: "admin" as const,
              text: payload.text,
              time: new Date(payload.created_at).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
          setHasUnread(prev => (open ? prev : true));
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [sessionId, open]);

  // ── Send message ─────────────────────────────────────────────────────────

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    // Thêm tin nhắn của user vào UI ngay lập tức
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), role: "user", text, time: getTime() },
    ]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId }),
      });
      const data = await res.json() as { sessionId?: string; error?: string };

      if (!res.ok) throw new Error(data.error ?? "Server error");

      // Lưu sessionId để dùng cho lần gửi tiếp và subscribe realtime
      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
        try { localStorage.setItem(SESSION_KEY, data.sessionId); } catch { /* ignore */ }
      }

      // Xác nhận đã nhận tin — admin sẽ reply qua Telegram → realtime
      setMessages(prev => [
        ...prev,
        {
          id: `ack-${Date.now()}`,
          role: "bot",
          text: "Mình đã nhận được tin nhắn của bạn! Sẽ phản hồi trong thời gian sớm nhất ⏳",
          time: getTime(),
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "bot",
          text: "Xin lỗi, có lỗi kết nối. Bạn thử lại sau hoặc email trực tiếp nhé!",
          time: getTime(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed z-50 flex flex-col rounded-2xl overflow-hidden border"
            style={{
              bottom: "90px",
              right: "32px",
              width: "340px",
              maxHeight: "500px",
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-color)",
              boxShadow: "0 12px 48px rgba(0,0,0,0.16)",
              transformOrigin: "bottom right",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 shrink-0"
              style={{ backgroundColor: "var(--accent-color)" }}
            >
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle size={17} className="text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white/30" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-none mb-0.5">Cong Dev</p>
                <p className="text-xs text-white/70">Thường trả lời trong vài giờ</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X size={14} className="text-white" />
              </button>
            </div>

            {/* Messages area */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              style={{ backgroundColor: "#F2F5F8" }}
            >
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className="max-w-[82%] px-3.5 py-2.5 text-sm leading-relaxed"
                    style={
                      msg.role === "user"
                        ? {
                            backgroundColor: "var(--accent-color)",
                            color: "#fff",
                            borderRadius: "18px 18px 4px 18px",
                          }
                        : {
                            backgroundColor: "#fff",
                            color: "var(--text-primary)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "18px 18px 18px 4px",
                          }
                    }
                  >
                    {msg.text}
                  </div>
                  <span className="text-[11px] px-1" style={{ color: "var(--text-secondary)" }}>
                    {msg.role === "admin" ? "Cong Dev · " : ""}{msg.time}
                  </span>
                </div>
              ))}

              {/* Sending indicator */}
              {sending && (
                <div className="flex items-start">
                  <div
                    className="px-4 py-3"
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid var(--border-color)",
                      borderRadius: "18px 18px 18px 4px",
                    }}
                  >
                    <div className="flex gap-1.5 items-center h-3.5">
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full animate-bounce"
                          style={{
                            backgroundColor: "var(--text-secondary)",
                            animationDelay: `${delay}s`,
                            animationDuration: "0.9s",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div
              className="flex items-center gap-2.5 px-3.5 py-3 border-t shrink-0"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-surface)",
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Nhập tin nhắn..."
                className="flex-1 text-sm outline-none bg-transparent placeholder:text-[var(--text-secondary)]"
                style={{ color: "var(--text-primary)" }}
              />
              <button
                onClick={send}
                disabled={!input.trim() || sending}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer disabled:opacity-35 active:scale-95"
                style={{ backgroundColor: "var(--accent-color)", color: "#fff" }}
              >
                {sending
                  ? <Loader2 size={14} className="animate-spin" />
                  : <Send size={14} />
                }
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toggle button ── */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileTap={{ scale: 0.9 }}
        className="fixed z-50 flex items-center justify-center rounded-full cursor-pointer"
        style={{
          bottom: "32px",
          right: "32px",
          width: "52px",
          height: "52px",
          backgroundColor: "var(--accent-color)",
          boxShadow: "0 4px 20px rgba(49,92,133,0.45)",
        }}
        aria-label="Mở chat"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={20} className="text-white" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={20} className="text-white" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread dot */}
        {hasUnread && !open && (
          <span
            className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2"
            style={{ borderColor: "var(--bg-surface)" }}
          />
        )}
      </motion.button>
    </>
  );
}
