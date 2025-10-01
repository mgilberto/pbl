import { supabase } from './supabase';
import type { Match } from '../types';

export interface Player {
  id: string;
  name: string;
  created_at: string;
}

export interface DbMatch {
  id: string;
  game_number: number;
  match_date: string;
  team_a_player1_id: string;
  team_a_player2_id: string;
  team_b_player1_id: string;
  team_b_player2_id: string;
  team_a_score: number;
  team_b_score: number;
  created_at: string;
}

export const DatabaseService = {
  async getAllPlayers(): Promise<Player[]> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getPlayerByName(name: string): Promise<Player | null> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('name', name)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createPlayer(name: string): Promise<Player> {
    const { data, error } = await supabase
      .from('players')
      .insert({ name })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getOrCreatePlayer(name: string): Promise<Player> {
    const existing = await this.getPlayerByName(name);
    if (existing) return existing;
    return this.createPlayer(name);
  },

  async getAllMatches(): Promise<DbMatch[]> {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('match_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createMatch(match: {
    gameNumber: number;
    matchDate: string;
    teamAPlayer1: string;
    teamAPlayer2: string;
    teamBPlayer1: string;
    teamBPlayer2: string;
    teamAScore: number;
    teamBScore: number;
  }): Promise<DbMatch> {
    const player1 = await this.getOrCreatePlayer(match.teamAPlayer1);
    const player2 = await this.getOrCreatePlayer(match.teamAPlayer2);
    const player3 = await this.getOrCreatePlayer(match.teamBPlayer1);
    const player4 = await this.getOrCreatePlayer(match.teamBPlayer2);

    const { data, error } = await supabase
      .from('matches')
      .insert({
        game_number: match.gameNumber,
        match_date: match.matchDate,
        team_a_player1_id: player1.id,
        team_a_player2_id: player2.id,
        team_b_player1_id: player3.id,
        team_b_player2_id: player4.id,
        team_a_score: match.teamAScore,
        team_b_score: match.teamBScore,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async convertDbMatchToMatch(dbMatch: DbMatch, playersMap: Map<string, string>): Promise<Match> {
    const teamAPlayer1 = playersMap.get(dbMatch.team_a_player1_id) || '';
    const teamAPlayer2 = playersMap.get(dbMatch.team_a_player2_id) || '';
    const teamBPlayer1 = playersMap.get(dbMatch.team_b_player1_id) || '';
    const teamBPlayer2 = playersMap.get(dbMatch.team_b_player2_id) || '';

    return {
      game: dbMatch.game_number,
      date: dbMatch.match_date,
      teamA: `${teamAPlayer1} & ${teamAPlayer2}`,
      teamB: `${teamBPlayer1} & ${teamBPlayer2}`,
      scoreA: dbMatch.team_a_score,
      scoreB: dbMatch.team_b_score,
    };
  },

  async getMatchesWithPlayerNames(): Promise<Match[]> {
    const [players, dbMatches] = await Promise.all([
      this.getAllPlayers(),
      this.getAllMatches(),
    ]);

    const playersMap = new Map(players.map(p => [p.id, p.name]));

    return Promise.all(
      dbMatches.map(dbMatch => this.convertDbMatchToMatch(dbMatch, playersMap))
    );
  },
};
