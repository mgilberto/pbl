export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          game_number: number
          match_date: string
          team_a_player1_id: string
          team_a_player2_id: string
          team_b_player1_id: string
          team_b_player2_id: string
          team_a_score: number
          team_b_score: number
          created_at: string
        }
        Insert: {
          id?: string
          game_number: number
          match_date?: string
          team_a_player1_id: string
          team_a_player2_id: string
          team_b_player1_id: string
          team_b_player2_id: string
          team_a_score: number
          team_b_score: number
          created_at?: string
        }
        Update: {
          id?: string
          game_number?: number
          match_date?: string
          team_a_player1_id?: string
          team_a_player2_id?: string
          team_b_player1_id?: string
          team_b_player2_id?: string
          team_a_score?: number
          team_b_score?: number
          created_at?: string
        }
      }
    }
  }
}
