import React, { useState } from 'react';

const GearIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0l-.1.41a1.5 1.5 0 01-2.1 1.45l-.41-.1a1.5 1.5 0 00-1.88.93l-.28.48a1.5 1.5 0 00.36 1.93l.34.25a1.5 1.5 0 010 2.44l-.34.25a1.5 1.5 0 00-.36 1.93l.28.48a1.5 1.5 0 001.88.93l.41-.1a1.5 1.5 0 012.1 1.45l.1.41c.38 1.56 2.6 1.56 2.98 0l.1-.41a1.5 1.5 0 012.1-1.45l.41.1a1.5 1.5 0 001.88-.93l.28-.48a1.5 1.5 0 00-.36-1.93l-.34-.25a1.5 1.5 0 010-2.44l.34-.25a1.5 1.5 0 00.36-1.93l-.28-.48a1.5 1.5 0 00-1.88-.93l-.41.1a1.5 1.5 0 01-2.1-1.45l-.1-.41zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
);

interface LeagueSetupProps {
    onSetup: (players: string[]) => void;
    onCancel: () => void;
    currentPlayers: string[];
}

export const LeagueSetup: React.FC<LeagueSetupProps> = ({ onSetup, onCancel, currentPlayers }) => {
    const [inputText, setInputText] = useState(currentPlayers.join(', '));
    const [error, setError] = useState('');

    const handleSetup = () => {
        let hasError = false;
        setError('');

        const entries = inputText.split(',').map(s => s.trim()).filter(Boolean);
        if (entries.length === 0) {
            setError('Please enter at least one player or team.');
            return;
        }

        const playerSet = new Set<string>();
        entries.forEach(entry => {
            if (entry.includes('&')) {
                const teamPlayers = entry.split('&').map(p => p.trim()).filter(Boolean);
                if (teamPlayers.length !== 2) {
                    setError(`Invalid team format: "${entry}". Teams must have exactly two players separated by '&'.`);
                    hasError = true;
                }
                teamPlayers.forEach(p => playerSet.add(p));
            } else {
                playerSet.add(entry);
            }
        });

        if (hasError) return;

        const players = Array.from(playerSet).sort();
        if (players.length > 0 && players.length < 4) {
            setError('You need at least 4 unique players to form two teams.');
            return;
        }

        onSetup(players);
    };

    return (
        <div className="bg-slate-800/50 rounded-xl shadow-lg border border-slate-700 max-w-3xl mx-auto animate-fade-in">
            <div className="p-6 border-b border-slate-700">
                <div className="flex items-center space-x-3">
                    <GearIcon className="text-lime-400 h-6 w-6"/>
                    <h2 className="text-2xl font-bold text-white">League Setup</h2>
                </div>
            </div>
            <div className="p-6 space-y-6">
                <div>
                    <label htmlFor="player-input" className="block text-sm font-medium text-slate-300 mb-2">
                        Enter Players or Teams
                    </label>
                    <p className="text-xs text-slate-400 mb-2">
                        Separate entries with commas. For teams, use an ampersand (&).
                        <br />
                        Example: <code className="bg-slate-700 px-1 py-0.5 rounded text-xs">John Doe, Jane Smith, Player One & Player Two</code>
                    </p>
                    <textarea
                        id="player-input"
                        rows={8}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 transition"
                        placeholder="e.g., Rich, Rick, Janet, Joe, Lou & Robert, ..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        aria-describedby="player-input-help"
                    />
                </div>

                {error && <p className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-md">{error}</p>}

                <div className="flex justify-end gap-4 pt-2">
                    <button onClick={onCancel} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSetup} className="bg-lime-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-lime-400 transition-colors">
                        Create League
                    </button>
                </div>
            </div>
        </div>
    );
};
