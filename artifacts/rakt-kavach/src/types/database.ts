export interface Database {
  public: { Tables: {
    donors: { Row: { id: string; full_name: string; blood_group: string; aadhaar_last4: string | null; abha_id: string | null; lifetime_donations: number; latitude: number | null; longitude: number | null; verified: boolean }; Insert: Partial<Database['public']['Tables']['donors']['Row']> & { full_name: string; blood_group: string }; Update: Partial<Database['public']['Tables']['donors']['Row']>; Relationships: [] };
    blood_inventory: { Row: { id: string; facility_name: string; blood_group: string; units: number; updated_at: string }; Insert: Partial<Database['public']['Tables']['blood_inventory']['Row']>; Update: Partial<Database['public']['Tables']['blood_inventory']['Row']>; Relationships: [] };
    blood_wallets: { Row: { id: string; donor_id: string; credits: number }; Insert: Record<string, unknown>; Update: Partial<Record<string, unknown>>; Relationships: [] };
    institutions: { Row: { id: string; name: string; role: string; latitude: number | null; longitude: number | null; verified: boolean }; Insert: Partial<Database['public']['Tables']['institutions']['Row']>; Update: Partial<Database['public']['Tables']['institutions']['Row']>; Relationships: [] };
    crisis_alerts: { Row: { id: string; title: string; status: string; created_at: string }; Insert: Record<string, unknown>; Update: Partial<Record<string, unknown>>; Relationships: [] };
    platform_metrics: { Row: { key: string; value: number }; Insert: Partial<Database['public']['Tables']['platform_metrics']['Row']>; Update: Partial<Database['public']['Tables']['platform_metrics']['Row']>; Relationships: [] };
  }; Views: Record<string, never>; Functions: Record<string, never>; Enums: Record<string, never>; CompositeTypes: Record<string, never>; };
}
export type Donor = Database['public']['Tables']['donors']['Row'];
export type InventoryUnit = Database['public']['Tables']['blood_inventory']['Row'];
