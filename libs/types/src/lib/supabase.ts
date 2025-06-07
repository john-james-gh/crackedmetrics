export type Json = string | number | boolean | null | {[key: string]: Json | undefined} | Json[];

export type Database = {
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string | null;
          description: string | null;
          expires_at: string | null;
          id: string;
          key: string;
          last_used_at: string | null;
          project_id: string;
          status: Database['public']['Enums']['api_key_status'];
          tenant_id: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          expires_at?: string | null;
          id?: string;
          key: string;
          last_used_at?: string | null;
          project_id: string;
          status?: Database['public']['Enums']['api_key_status'];
          tenant_id: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          expires_at?: string | null;
          id?: string;
          key?: string;
          last_used_at?: string | null;
          project_id?: string;
          status?: Database['public']['Enums']['api_key_status'];
          tenant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'api_keys_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'api_keys_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
        ];
      };
      memberships: {
        Row: {
          id: string;
          joined_at: string | null;
          role: Database['public']['Enums']['member_role_enum'];
          tenant_id: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          joined_at?: string | null;
          role: Database['public']['Enums']['member_role_enum'];
          tenant_id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          joined_at?: string | null;
          role?: Database['public']['Enums']['member_role_enum'];
          tenant_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'memberships_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
        ];
      };
      projects: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          tenant_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          tenant_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          tenant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'projects_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
        ];
      };
      tenants: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          owner_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          owner_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          owner_id?: string;
        };
        Relationships: [];
      };
      test_runs: {
        Row: {
          branch: string | null;
          commit_hash: string | null;
          creator_id: string | null;
          creator_type: Database['public']['Enums']['creator_type_enum'] | null;
          duration: number | null;
          id: string;
          project_id: string;
          raw_json: Json;
          run_at: string | null;
          status: Database['public']['Enums']['run_status_enum'] | null;
          tenant_id: string;
          test_tool: Database['public']['Enums']['test_tool_enum'];
        };
        Insert: {
          branch?: string | null;
          commit_hash?: string | null;
          creator_id?: string | null;
          creator_type?: Database['public']['Enums']['creator_type_enum'] | null;
          duration?: number | null;
          id?: string;
          project_id: string;
          raw_json: Json;
          run_at?: string | null;
          status?: Database['public']['Enums']['run_status_enum'] | null;
          tenant_id: string;
          test_tool: Database['public']['Enums']['test_tool_enum'];
        };
        Update: {
          branch?: string | null;
          commit_hash?: string | null;
          creator_id?: string | null;
          creator_type?: Database['public']['Enums']['creator_type_enum'] | null;
          duration?: number | null;
          id?: string;
          project_id?: string;
          raw_json?: Json;
          run_at?: string | null;
          status?: Database['public']['Enums']['run_status_enum'] | null;
          tenant_id?: string;
          test_tool?: Database['public']['Enums']['test_tool_enum'];
        };
        Relationships: [
          {
            foreignKeyName: 'test_runs_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'test_runs_tenant_id_fkey';
            columns: ['tenant_id'];
            isOneToOne: false;
            referencedRelation: 'tenants';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      api_key_status: 'active' | 'revoked';
      creator_type_enum: 'human' | 'ci';
      member_role_enum: 'admin' | 'member';
      run_status_enum: 'passed' | 'failed' | 'partial';
      test_tool_enum: 'vitest' | 'playwright' | 'jest' | 'cypress';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | {schema: keyof Database},
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {schema: keyof Database}
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | {schema: keyof Database},
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {schema: keyof Database}
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | {schema: keyof Database},
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {schema: keyof Database}
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | {schema: keyof Database},
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {schema: keyof Database}
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes'] | {schema: keyof Database},
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {schema: keyof Database}
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      api_key_status: ['active', 'revoked'],
      creator_type_enum: ['human', 'ci'],
      member_role_enum: ['admin', 'member'],
      run_status_enum: ['passed', 'failed', 'partial'],
      test_tool_enum: ['vitest', 'playwright', 'jest', 'cypress'],
    },
  },
} as const;
