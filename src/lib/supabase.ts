import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          universe_seed: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          universe_seed?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          universe_seed?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      celestial_bodies: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content_type: 'movie' | 'book' | 'album' | 'game' | 'studying' | 'work' | 'other';
          genre: string | null;
          creator_id: string | null;
          series_id: string | null;
          external_id: string | null;
          api_data: any | null;
          position_x: number;
          position_y: number;
          position_z: number;
          visual_attributes: any;
          is_singularity: boolean;
          has_impact: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content_type: 'movie' | 'book' | 'album' | 'game' | 'studying' | 'work' | 'other';
          genre?: string | null;
          creator_id?: string | null;
          series_id?: string | null;
          external_id?: string | null;
          api_data?: any | null;
          position_x: number;
          position_y: number;
          position_z: number;
          visual_attributes: any;
          is_singularity?: boolean;
          has_impact?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content_type?: 'movie' | 'book' | 'album' | 'game' | 'studying' | 'work' | 'other';
          genre?: string | null;
          creator_id?: string | null;
          series_id?: string | null;
          external_id?: string | null;
          api_data?: any | null;
          position_x?: number;
          position_y?: number;
          position_z?: number;
          visual_attributes?: any;
          is_singularity?: boolean;
          has_impact?: boolean;
          created_at?: string;
        };
      };
      phenomena: {
        Row: {
          id: string;
          user_id: string;
          type: 'galaxy' | 'constellation' | 'stream';
          name: string;
          description: string | null;
          celestial_body_ids: string[];
          visual_data: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'galaxy' | 'constellation' | 'stream';
          name: string;
          description?: string | null;
          celestial_body_ids: string[];
          visual_data: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'galaxy' | 'constellation' | 'stream';
          name?: string;
          description?: string | null;
          celestial_body_ids?: string[];
          visual_data?: any;
          created_at?: string;
        };
      };
    };
  };
};