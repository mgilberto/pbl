import React from 'react';
import type { TeamStats } from '../types';

interface LeaderboardProps {
  stats: TeamStats[];
  onSelectPlayer: (playerName: string) => void;
}

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 001.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
    </svg>
);


export const Leaderboard: React.FC<LeaderboardProps> = ({ stats, onSelectPlayer }) => {
    const getRankColor = (rank: number) => {
        if (rank === 0) return 'text-amber-300';
        if (rank === 1) return 'text-slate-300';
        if (rank === 2) return 'text-amber-500';
        return 'text-gray-400';
    };

    return (
        <div className="bg-slate-800/50 rounded-xl shadow-lg overflow-hidden border border-slate-700">
            <div className="p-6">
                 <div className="flex items-center space-x-3">
                    <TrophyIcon className="text-lime-400"/>
                    <h2 className="text-2xl font-bold text-white">League Standings</h2>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-slate-900/60 text-xs text-slate-300 uppercase tracking-wider">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-center">Rank</th>
                            <th scope="col" className="px-6 py-3">Team</th>
                            <th scope="col" className="px-6 py-3 text-center">Played</th>
                            <th scope="col" className="px-6 py-3 text-center">Wins</th>
                            <th scope="col" className="px-6 py-3 text-center">Losses</th>
                            <th scope="col" className="px-6 py-3 text-center">Points For</th>
                            <th scope="col" className="px-6 py-3 text-center">Points Against</th>
                            <th scope="col" className="px-6 py-3 text-center">Difference</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {stats.map((team, index) => (
                            <tr key={team.name} className="hover:bg-slate-700/50 transition-colors duration-200">
                                <td className={`px-6 py-4 font-bold text-center ${getRankColor(index)}`}>
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                                  {team.name.split(' & ').map((name, i, arr) => (
                                      <React.Fragment key={name}>
                                          <button 
                                            onClick={() => onSelectPlayer(name.trim())} 
                                            className="hover:underline hover:text-lime-400 focus:outline-none focus:text-lime-400 transition-colors"
                                          >
                                            {name}
                                          </button>
                                          {i < arr.length - 1 && ' & '}
                                      </React.Fragment>
                                  ))}
                                </td>
                                <td className="px-6 py-4 text-center">{team.played}</td>
                                <td className="px-6 py-4 text-center text-green-400 font-semibold">{team.wins}</td>
                                <td className="px-6 py-4 text-center text-red-400 font-semibold">{team.losses}</td>
                                <td className="px-6 py-4 text-center">{team.pointsFor}</td>
                                <td className="px-6 py-4 text-center">{team.pointsAgainst}</td>
                                <td className={`px-6 py-4 text-center font-bold ${team.pointsDifference > 0 ? 'text-cyan-400' : 'text-orange-400'}`}>
                                    {team.pointsDifference > 0 ? '+' : ''}{team.pointsDifference}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
