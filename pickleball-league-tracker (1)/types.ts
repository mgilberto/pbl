export interface Match {
  game: number;
  date: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
}

export interface TeamStats {
  name: string;
  played: number;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  pointsDifference: number;
}

export interface PlayerStats {
  name: string;
  played: number;
  wins: number;
  losses: number;
  winRate: number;
  pointsFor: number;
  pointsAgainst: number;
}
