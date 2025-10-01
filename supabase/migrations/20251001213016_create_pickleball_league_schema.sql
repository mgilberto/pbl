/*
  # Pickleball League Tracker Schema

  ## Overview
  Creates the complete database schema for tracking pickleball league matches, players, and team statistics.

  ## Tables Created

  ### 1. `players`
  Stores information about all players in the league.
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text, unique, not null) - Player's full name
  - `created_at` (timestamptz) - When player was added

  ### 2. `matches`
  Records all match results between teams.
  - `id` (uuid, primary key) - Unique match identifier
  - `game_number` (integer, not null) - Game/court number
  - `match_date` (date, not null) - Date the match was played
  - `team_a_player1_id` (uuid, not null) - First player on Team A
  - `team_a_player2_id` (uuid, not null) - Second player on Team A
  - `team_b_player1_id` (uuid, not null) - First player on Team B
  - `team_b_player2_id` (uuid, not null) - Second player on Team B
  - `team_a_score` (integer, not null) - Final score for Team A
  - `team_b_score` (integer, not null) - Final score for Team B
  - `created_at` (timestamptz) - When match was recorded
  - Constraint: Scores must be non-negative
  - Constraint: Scores cannot be equal (no ties)

  ## Indexes
  - Index on `match_date` for efficient date-based queries
  - Index on player IDs for fast player statistics lookups

  ## Security
  - RLS enabled on all tables
  - Public read access to all data (appropriate for league tracking)
  - Authenticated users can insert new matches and players
  - Authenticated users can update matches within 24 hours

  ## Important Notes
  1. All player IDs reference the players table with cascade delete
  2. Match dates default to current date
  3. No duplicate player checks at DB level - handled in application
  4. Statistics are calculated in real-time from match data
*/

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_number integer NOT NULL,
  match_date date NOT NULL DEFAULT CURRENT_DATE,
  team_a_player1_id uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  team_a_player2_id uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  team_b_player1_id uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  team_b_player2_id uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  team_a_score integer NOT NULL CHECK (team_a_score >= 0),
  team_b_score integer NOT NULL CHECK (team_b_score >= 0),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT no_tie_scores CHECK (team_a_score != team_b_score),
  CONSTRAINT different_players CHECK (
    team_a_player1_id != team_a_player2_id AND
    team_b_player1_id != team_b_player2_id
  )
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date DESC);
CREATE INDEX IF NOT EXISTS idx_matches_team_a_player1 ON matches(team_a_player1_id);
CREATE INDEX IF NOT EXISTS idx_matches_team_a_player2 ON matches(team_a_player2_id);
CREATE INDEX IF NOT EXISTS idx_matches_team_b_player1 ON matches(team_b_player1_id);
CREATE INDEX IF NOT EXISTS idx_matches_team_b_player2 ON matches(team_b_player2_id);

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for players table
CREATE POLICY "Anyone can view players"
  ON players FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert players"
  ON players FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for matches table
CREATE POLICY "Anyone can view matches"
  ON matches FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert matches"
  ON matches FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update recent matches"
  ON matches FOR UPDATE
  TO authenticated
  USING (created_at > now() - interval '24 hours')
  WITH CHECK (created_at > now() - interval '24 hours');