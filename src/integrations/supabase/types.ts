export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          category: string
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          ban_reason: string | null
          banned_at: string | null
          banned_by: string | null
          created_at: string
          display_name: string | null
          email: string
          id: string
          is_banned: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          ban_reason?: string | null
          banned_at?: string | null
          banned_by?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          id: string
          is_banned?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          ban_reason?: string | null
          banned_at?: string | null
          banned_by?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          is_banned?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          contact_email: string | null
          created_at: string
          description: string
          id: string
          issue_type: string
          related_url: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          description: string
          id?: string
          issue_type: string
          related_url?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          description?: string
          id?: string
          issue_type?: string
          related_url?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      requests: {
        Row: {
          created_at: string
          description: string | null
          id: string
          platform: string | null
          software_name: string
          updated_at: string
          upvotes: number
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          platform?: string | null
          software_name: string
          updated_at?: string
          upvotes?: number
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          platform?: string | null
          software_name?: string
          updated_at?: string
          upvotes?: number
          user_id?: string
        }
        Relationships: []
      }
      site_stats: {
        Row: {
          id: string
          total_software: number
          total_users: number
          updated_at: string
        }
        Insert: {
          id?: string
          total_software?: number
          total_users?: number
          updated_at?: string
        }
        Update: {
          id?: string
          total_software?: number
          total_users?: number
          updated_at?: string
        }
        Relationships: []
      }
      software: {
        Row: {
          created_at: string
          description: string | null
          download_link: string | null
          id: string
          is_paid: boolean
          name: string
          platforms: string[]
          price: number | null
          updated_at: string
          user_id: string
          version: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          download_link?: string | null
          id?: string
          is_paid?: boolean
          name: string
          platforms?: string[]
          price?: number | null
          updated_at?: string
          user_id: string
          version?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          download_link?: string | null
          id?: string
          is_paid?: boolean
          name?: string
          platforms?: string[]
          price?: number | null
          updated_at?: string
          user_id?: string
          version?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_first_user: { Args: never; Returns: boolean }
      is_user_banned: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "owner" | "admin" | "helper" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["owner", "admin", "helper", "user"],
    },
  },
} as const
