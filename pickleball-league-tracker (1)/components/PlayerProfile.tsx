import React from 'react';
import type { PlayerStats, Match } from '../types';

interface PlayerProfileProps {
  player: PlayerStats;
  matches: Match[];
  onClose: () => void;
}

const StatCard: React.FC<{ label: string; value: string | number; color?: string }> = ({ label, value, color = 'text-white' }) => (
    <div className="bg-slate-700/50 p-4 rounded-lg text-center">
        <p className="text-sm text-slate-400">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
);

export const PlayerProfile: React.FC<PlayerProfileProps> = ({ player, matches, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="player-profile-title"
        >
            <div 
                className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-700"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                    <h2 id="player-profile-title" className="text-3xl font-bold text-white">{player.name}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label="Close player profile">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <StatCard label="Played" value={player.played} />
                        <StatCard label="Wins" value={player.wins} color="text-green-400" />
                        <StatCard label="Losses" value={player.losses} color="text-red-400" />
                        <StatCard label="Win Rate" value={`${player.winRate}%`} color="text-cyan-400" />
                    </div>
                    
                    {/* Match History */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-white">Match History</h3>
                        <div className="space-y-3">
                            {matches.map((match, index) => {
                                const isPlayerInTeamA = match.teamA.includes(player.name);
                                const isWinner = (isPlayerInTeamA && match.scoreA > match.scoreB) || (!isPlayerInTeamA && match.scoreB > match.scoreA);
                                
                                return (
                                    <div key={index} className={`bg-slate-900/50 p-4 rounded-lg border-l-4 ${isWinner ? 'border-green-500' : 'border-red-500'}`}>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-white">{match.teamA}</p>
                                                <p className="text-sm text-slate-400">vs</p>
                                                <p className="font-semibold text-white">{match.teamB}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-mono text-xl ${match.scoreA > match.scoreB ? 'text-white' : 'text-slate-400'}`}>{match.scoreA}</p>
                                                <p className={`font-mono text-xl ${match.scoreB > match.scoreA ? 'text-white' : 'text-slate-400'}`}>{match.scoreB}</p>
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-2 text-right">
                                            {new Date(match.date  + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })}
                                            {' '}&bull;{' '}
                                            Game {match.game}
                                        </div>
                                    </div>
                                );
                            })}
                            {matches.length === 0 && (
                                <p className="text-slate-400 text-center py-4">No matches found for this player.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
