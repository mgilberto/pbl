import React from 'react';
import type { Match, TeamStats } from '../types';
import { Leaderboard } from './Leaderboard';
import { MatchList } from './MatchList';

interface DashboardProps {
  stats: TeamStats[];
  matches: Match[];
  onSelectPlayer: (playerName: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, matches, onSelectPlayer }) => {
  return (
    <div className="space-y-8">
        <Leaderboard stats={stats} onSelectPlayer={onSelectPlayer} />
        <MatchList matches={matches} onSelectPlayer={onSelectPlayer} />
    </div>
  );
};
