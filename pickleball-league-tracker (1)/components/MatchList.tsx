import React, { useState, useMemo } from 'react';
import type { Match } from '../types';

interface MatchListProps {
  matches: Match[];
  onSelectPlayer: (playerName: string) => void;
}

const ResultsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3zm3.172 5.172L8 10.586V15l2-.001v-4.414l1.828-1.828L15.172 6H4.828l2.344 2.172z" clipRule="evenodd" />
    </svg>
);

const TeamDisplay: React.FC<{ teamName: string; isWinner: boolean; onSelectPlayer: (name: string) => void; }> = ({ teamName, isWinner, onSelectPlayer }) => {
    const players = teamName.split(' & ');
    return (
        <p className={`w-2/5 truncate ${isWinner ? 'font-bold text-lime-300' : 'text-gray-300'}`}>
            {players.map((name, i) => (
                <React.Fragment key={name}>
                    <button onClick={(e) => { e.stopPropagation(); onSelectPlayer(name.trim()); }} className="hover:underline focus:outline-none">
                        {name}
                    </button>
                    {i === 0 && ' & '}
                </React.Fragment>
            ))}
        </p>
    );
};

const MatchCard: React.FC<{ match: Match; onSelectPlayer: (playerName: string) => void; }> = ({ match, onSelectPlayer }) => {
    const isTeamAWinner = match.scoreA > match.scoreB;
    return (
        <div className="bg-slate-800 rounded-lg p-4 flex flex-col items-center justify-center text-center transition-transform duration-300 hover:scale-105 hover:bg-slate-700/80 border border-slate-700">
            <div className="w-full flex justify-between items-center text-sm">
                <TeamDisplay teamName={match.teamA} isWinner={isTeamAWinner} onSelectPlayer={onSelectPlayer} />
                <p className="w-1/5 text-xs text-gray-400">vs</p>
                <TeamDisplay teamName={match.teamB} isWinner={!isTeamAWinner} onSelectPlayer={onSelectPlayer} />
            </div>
            <div className="w-full flex justify-between items-center text-lg mt-2">
                <p className={`w-2/5 font-mono ${isTeamAWinner ? 'text-white' : 'text-gray-400'}`}>{match.scoreA}</p>
                <div className="w-1/5">-</div>
                <p className={`w-2/5 font-mono ${!isTeamAWinner ? 'text-white' : 'text-gray-400'}`}>{match.scoreB}</p>
            </div>
             <p className="text-xs text-slate-500 mt-2">Game {match.game}</p>
        </div>
    );
};

const getWeekStartDate = (date: Date) => {
    const d = new Date(date.valueOf());
    const day = d.getUTCDay();
    const diff = d.getUTCDate() - day;
    return new Date(d.setUTCDate(diff));
};

export const MatchList: React.FC<MatchListProps> = ({ matches, onSelectPlayer }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const weeklyMatches = useMemo(() => {
        const filtered = matches.filter(match => 
            match.teamA.toLowerCase().includes(searchTerm.toLowerCase()) || 
            match.teamB.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const groups: { [week: string]: Match[] } = {};
        
        filtered.forEach(match => {
            const matchDate = new Date(match.date + 'T00:00:00'); // Use T00.. to treat date as local
            const weekStartDate = getWeekStartDate(matchDate);
            const weekKey = weekStartDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' });
            const weekLabel = `Week of ${weekKey}`;

            if (!groups[weekLabel]) {
                groups[weekLabel] = [];
            }
            groups[weekLabel].push(match);
        });
        return groups;
    }, [matches, searchTerm]);

    return (
        <div className="bg-slate-800/50 rounded-xl shadow-lg border border-slate-700">
            <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center space-x-3">
                        <ResultsIcon className="text-lime-400" />
                        <h2 className="text-2xl font-bold text-white">All Match Results</h2>
                    </div>
                     <input
                        type="text"
                        placeholder="Search by team or player..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 transition"
                    />
                </div>
            </div>
            <div className="p-6 space-y-8">
                {Object.keys(weeklyMatches).length > 0 ? (
                     Object.entries(weeklyMatches).map(([weekLabel, weekMatches]) => (
                        <div key={weekLabel}>
                            <h3 className="text-xl font-semibold text-slate-300 mb-4 pl-3 border-l-4 border-lime-500">{weekLabel}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {weekMatches.map((match, index) => (
                                    <MatchCard key={`${match.date}-${match.game}-${match.teamA}-${index}`} match={match} onSelectPlayer={onSelectPlayer} />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-slate-400 text-center py-8">No matching results found.</p>
                )}
            </div>
        </div>
    );
};
