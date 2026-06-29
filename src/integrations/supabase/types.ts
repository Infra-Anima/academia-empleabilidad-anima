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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      empresas: {
        Row: {
          contacto: string | null
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          rubro: string | null
          sitio_web: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          contacto?: string | null
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          rubro?: string | null
          sitio_web?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          contacto?: string | null
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          rubro?: string | null
          sitio_web?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      encuestas: {
        Row: {
          created_at: string
          email: string | null
          expectativas: string | null
          experiencia_previa: boolean | null
          fortalezas: string[] | null
          id: string
          inscripcion_id: string | null
          mejorar: string[] | null
          nivel_digital: number | null
          tiene_cv: string | null
          tiene_linkedin: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          expectativas?: string | null
          experiencia_previa?: boolean | null
          fortalezas?: string[] | null
          id?: string
          inscripcion_id?: string | null
          mejorar?: string[] | null
          nivel_digital?: number | null
          tiene_cv?: string | null
          tiene_linkedin?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          expectativas?: string | null
          experiencia_previa?: boolean | null
          fortalezas?: string[] | null
          id?: string
          inscripcion_id?: string | null
          mejorar?: string[] | null
          nivel_digital?: number | null
          tiene_cv?: string | null
          tiene_linkedin?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "encuestas_inscripcion_id_fkey"
            columns: ["inscripcion_id"]
            isOneToOne: false
            referencedRelation: "inscripciones"
            referencedColumns: ["id"]
          },
        ]
      }
      inscripciones: {
        Row: {
          area_interes: string | null
          birth_date: string
          consent: boolean
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          situacion: Database["public"]["Enums"]["situacion_laboral"]
          status: Database["public"]["Enums"]["inscripcion_status"]
          talleres_interes: string[] | null
          vinculo: Database["public"]["Enums"]["vinculo_anima"]
        }
        Insert: {
          area_interes?: string | null
          birth_date: string
          consent?: boolean
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          situacion: Database["public"]["Enums"]["situacion_laboral"]
          status?: Database["public"]["Enums"]["inscripcion_status"]
          talleres_interes?: string[] | null
          vinculo: Database["public"]["Enums"]["vinculo_anima"]
        }
        Update: {
          area_interes?: string | null
          birth_date?: string
          consent?: boolean
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          situacion?: Database["public"]["Enums"]["situacion_laboral"]
          status?: Database["public"]["Enums"]["inscripcion_status"]
          talleres_interes?: string[] | null
          vinculo?: Database["public"]["Enums"]["vinculo_anima"]
        }
        Relationships: []
      }
      oportunidades: {
        Row: {
          area: string | null
          created_at: string
          descripcion: string | null
          empresa_id: string
          fecha_limite: string | null
          id: string
          modalidad: Database["public"]["Enums"]["modalidad"] | null
          nivel_experiencia: string | null
          remuneracion: string | null
          requisitos: string | null
          status: Database["public"]["Enums"]["oportunidad_status"]
          titulo: string
        }
        Insert: {
          area?: string | null
          created_at?: string
          descripcion?: string | null
          empresa_id: string
          fecha_limite?: string | null
          id?: string
          modalidad?: Database["public"]["Enums"]["modalidad"] | null
          nivel_experiencia?: string | null
          remuneracion?: string | null
          requisitos?: string | null
          status?: Database["public"]["Enums"]["oportunidad_status"]
          titulo: string
        }
        Update: {
          area?: string | null
          created_at?: string
          descripcion?: string | null
          empresa_id?: string
          fecha_limite?: string | null
          id?: string
          modalidad?: Database["public"]["Enums"]["modalidad"] | null
          nivel_experiencia?: string | null
          remuneracion?: string | null
          requisitos?: string | null
          status?: Database["public"]["Enums"]["oportunidad_status"]
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "oportunidades_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      participant_profiles: {
        Row: {
          area_interes: string | null
          competencias_tecnicas: string | null
          competencias_transversales: string | null
          created_at: string
          cv_url: string | null
          etapa: Database["public"]["Enums"]["etapa_acompanamiento"]
          experiencia: string | null
          formacion: string | null
          linkedin_url: string | null
          notas_internas: string | null
          situacion: Database["public"]["Enums"]["situacion_laboral"] | null
          updated_at: string
          user_id: string
          vinculo: Database["public"]["Enums"]["vinculo_anima"] | null
        }
        Insert: {
          area_interes?: string | null
          competencias_tecnicas?: string | null
          competencias_transversales?: string | null
          created_at?: string
          cv_url?: string | null
          etapa?: Database["public"]["Enums"]["etapa_acompanamiento"]
          experiencia?: string | null
          formacion?: string | null
          linkedin_url?: string | null
          notas_internas?: string | null
          situacion?: Database["public"]["Enums"]["situacion_laboral"] | null
          updated_at?: string
          user_id: string
          vinculo?: Database["public"]["Enums"]["vinculo_anima"] | null
        }
        Update: {
          area_interes?: string | null
          competencias_tecnicas?: string | null
          competencias_transversales?: string | null
          created_at?: string
          cv_url?: string | null
          etapa?: Database["public"]["Enums"]["etapa_acompanamiento"]
          experiencia?: string | null
          formacion?: string | null
          linkedin_url?: string | null
          notas_internas?: string | null
          situacion?: Database["public"]["Enums"]["situacion_laboral"] | null
          updated_at?: string
          user_id?: string
          vinculo?: Database["public"]["Enums"]["vinculo_anima"] | null
        }
        Relationships: []
      }
      postulaciones: {
        Row: {
          created_at: string
          estado: Database["public"]["Enums"]["postulacion_estado"]
          id: string
          mensaje: string | null
          oportunidad_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          estado?: Database["public"]["Enums"]["postulacion_estado"]
          id?: string
          mensaje?: string | null
          oportunidad_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          estado?: Database["public"]["Enums"]["postulacion_estado"]
          id?: string
          mensaje?: string | null
          oportunidad_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "postulaciones_oportunidad_id_fkey"
            columns: ["oportunidad_id"]
            isOneToOne: false
            referencedRelation: "oportunidades"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          birth_date: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      taller_inscripciones: {
        Row: {
          created_at: string
          estado: Database["public"]["Enums"]["taller_estado"]
          horas_completadas: number
          id: string
          taller_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          estado?: Database["public"]["Enums"]["taller_estado"]
          horas_completadas?: number
          id?: string
          taller_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          estado?: Database["public"]["Enums"]["taller_estado"]
          horas_completadas?: number
          id?: string
          taller_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "taller_inscripciones_taller_id_fkey"
            columns: ["taller_id"]
            isOneToOne: false
            referencedRelation: "talleres"
            referencedColumns: ["id"]
          },
        ]
      }
      talleres: {
        Row: {
          activo: boolean
          carga_horaria: number
          created_at: string
          descripcion: string | null
          id: string
          materiales_url: string | null
          modalidad: Database["public"]["Enums"]["modalidad"]
          nombre: string
          profesional: string | null
          tematicas: string | null
        }
        Insert: {
          activo?: boolean
          carga_horaria?: number
          created_at?: string
          descripcion?: string | null
          id?: string
          materiales_url?: string | null
          modalidad?: Database["public"]["Enums"]["modalidad"]
          nombre: string
          profesional?: string | null
          tematicas?: string | null
        }
        Update: {
          activo?: boolean
          carga_horaria?: number
          created_at?: string
          descripcion?: string | null
          id?: string
          materiales_url?: string | null
          modalidad?: Database["public"]["Enums"]["modalidad"]
          nombre?: string
          profesional?: string | null
          tematicas?: string | null
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
          role: Database["public"]["Enums"]["app_role"]
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "participant" | "company" | "anima_team"
      etapa_acompanamiento:
        | "sin_contactar"
        | "en_seguimiento"
        | "con_plan"
        | "insertado"
        | "cerrado"
      inscripcion_status: "pendiente" | "aprobada" | "rechazada"
      modalidad: "presencial" | "virtual" | "hibrida"
      oportunidad_status: "activa" | "pausada" | "cerrada"
      postulacion_estado:
        | "enviada"
        | "en_revision"
        | "entrevista"
        | "seleccionado"
        | "no_avanza"
      situacion_laboral:
        | "sin_empleo"
        | "empleo_informal"
        | "empleo_formal_mejorar"
        | "empleo_formal_satisfactorio"
      taller_estado: "inscripto" | "en_curso" | "completado"
      vinculo_anima:
        | "egresado_academia"
        | "egresado_finest"
        | "egresado_bachillerato"
        | "sin_vinculo"
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
      app_role: ["participant", "company", "anima_team"],
      etapa_acompanamiento: [
        "sin_contactar",
        "en_seguimiento",
        "con_plan",
        "insertado",
        "cerrado",
      ],
      inscripcion_status: ["pendiente", "aprobada", "rechazada"],
      modalidad: ["presencial", "virtual", "hibrida"],
      oportunidad_status: ["activa", "pausada", "cerrada"],
      postulacion_estado: [
        "enviada",
        "en_revision",
        "entrevista",
        "seleccionado",
        "no_avanza",
      ],
      situacion_laboral: [
        "sin_empleo",
        "empleo_informal",
        "empleo_formal_mejorar",
        "empleo_formal_satisfactorio",
      ],
      taller_estado: ["inscripto", "en_curso", "completado"],
      vinculo_anima: [
        "egresado_academia",
        "egresado_finest",
        "egresado_bachillerato",
        "sin_vinculo",
      ],
    },
  },
} as const
