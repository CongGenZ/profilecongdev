// Auto-generate file này bằng: npx supabase gen types typescript --project-id <id> > src/types/db.ts
// Hoặc dùng Supabase Dashboard → API → Generate Types

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      chat_sessions: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          visitor_name: string | null;
          visitor_email: string | null;
          status: "open" | "closed";
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          visitor_name?: string | null;
          visitor_email?: string | null;
          status?: "open" | "closed";
        };
        Update: {
          updated_at?: string;
          visitor_name?: string | null;
          visitor_email?: string | null;
          status?: "open" | "closed";
        };
        Relationships: [];
      };
      chat_messages: {
        Row: {
          id: string;
          created_at: string;
          session_id: string;
          role: "user" | "bot" | "admin";
          text: string;
          telegram_message_id: number | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          session_id: string;
          role: "user" | "bot" | "admin";
          text: string;
          telegram_message_id?: number | null;
        };
        Update: {
          text?: string;
          telegram_message_id?: number | null;
        };
        Relationships: [];
      };
      contact_submissions: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          project_type: string;
          message: string;
          status: "new" | "read" | "replied";
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          email: string;
          project_type: string;
          message: string;
          status?: "new" | "read" | "replied";
        };
        Update: {
          status?: "new" | "read" | "replied";
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
