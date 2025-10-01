import React, { useState, useMemo } from 'react';
import type { Match } from '../types';

interface AddScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (match: Omit<Match, 'game' | 'date'> & { game: number | string }) => void;
  players: string[];
}

export const AddScoreModal: React.FC<AddScoreModalProps> = ({ isOpen, onClose, onSubmit, players }) => {
  const [teamAPlayer1, setTeamAPlayer1] = useState('');
  const [teamAPlayer2, setTeamAPlayer2] = useState('');
  const [teamBPlayer1, setTeamBPlayer1] = useState('');
  const [teamBPlayer2, setTeamBPlayer2] = useState('');
  const [scoreA, setScoreA] = useState('');
  const [scoreB, setScoreB] = useState('');
  const [game, setGame] = useState('');
  const [error, setError] = useState('');

  const selectedPlayers = useMemo(() => {
    return new Set([teamAPlayer1, teamAPlayer2, teamBPlayer1, teamBPlayer2].filter(Boolean));
  }, [teamAPlayer1, teamAPlayer2, teamBPlayer1, teamBPlayer2]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!teamAPlayer1 || !teamAPlayer2 || !teamBPlayer1 || !teamBPlayer2 || !scoreA || !scoreB || !game) {
      setError('All fields are required.');
      return;
    }
    
    if (selectedPlayers.size < 4) {
      setError('Each player can only be selected once.');
      return;
    }

    const parsedScoreA = parseInt(scoreA, 10);
    const parsedScoreB = parseInt(scoreB, 10);

    if (isNaN(parsedScoreA) || isNaN(parsedScoreB) || parsedScoreA < 0 || parsedScoreB < 0) {
        setError('Scores must be positive numbers.');
        return;
    }
    
    if (parsedScoreA === parsedScoreB) {
        setError('A match cannot end in a tie.');
        return;
    }

    const teamA = [teamAPlayer1, teamAPlayer2].sort().join(' & ');
    const teamB = [teamBPlayer1, teamBPlayer2].sort().join(' & ');
    
    if (teamA === teamB) {
        setError('A team cannot play against itself.');
        return;
    }

    onSubmit({
      teamA,
      teamB,
      scoreA: parsedScoreA,
      scoreB: parsedScoreB,
      game,
    });
    // Reset form
    setTeamAPlayer1('');
    setTeamAPlayer2('');
    setTeamBPlayer1('');
    setTeamBPlayer2('');
    setScoreA('');
    setScoreB('');
    setGame('');
  };

  if (!isOpen) return null;

  const renderPlayerOptions = (currentPlayer?: string) => {
    return players.map(p => (
        <option 
            key={p} 
            value={p}
            disabled={selectedPlayers.has(p) && p !== currentPlayer}
            className="disabled:text-gray-500"
        >
            {p}
        </option>
    ));
  }

  return (
    <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-score-title"
    >
      <div 
          className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col border border-slate-700"
          onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 id="add-score-title" className="text-2xl font-bold text-white">Add Match Result</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            {/* Team A */}
            <fieldset className="space-y-2">
                <legend className="font-semibold text-lg text-lime-400">Team A</legend>
                <div className="grid grid-cols-2 gap-4">
                    <select value={teamAPlayer1} onChange={e => setTeamAPlayer1(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-500">
                        <option value="" disabled>Select Player 1</option>
                        {renderPlayerOptions(teamAPlayer1)}
                    </select>
                    <select value={teamAPlayer2} onChange={e => setTeamAPlayer2(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-500">
                        <option value="" disabled>Select Player 2</option>
                        {renderPlayerOptions(teamAPlayer2)}
                    </select>
                </div>
            </fieldset>

            {/* Team B */}
            <fieldset className="space-y-2">
                <legend className="font-semibold text-lg text-cyan-400">Team B</legend>
                <div className="grid grid-cols-2 gap-4">
                    <select value={teamBPlayer1} onChange={e => setTeamBPlayer1(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-500">
                        <option value="" disabled>Select Player 1</option>
                        {renderPlayerOptions(teamBPlayer1)}
                    </select>
                    <select value={teamBPlayer2} onChange={e => setTeamBPlayer2(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-500">
                        <option value="" disabled>Select Player 2</option>
                        {renderPlayerOptions(teamBPlayer2)}
                    </select>
                </div>
            </fieldset>
            
            {/* Scores & Game */}
            <fieldset className="space-y-2">
                 <legend className="font-semibold text-lg text-white">Scores & Game</legend>
                 <div className="grid grid-cols-3 gap-4">
                     <input type="number" placeholder="Team A Score" value={scoreA} onChange={e => setScoreA(e.target.value)} min="0" className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-500"/>
                     <input type="number" placeholder="Team B Score" value={scoreB} onChange={e => setScoreB(e.target.value)} min="0" className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-500"/>
                     <input type="number" placeholder="Game/Court #" value={game} onChange={e => setGame(e.target.value)} min="1" className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-500"/>
                 </div>
            </fieldset>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Cancel</button>
            <button type="submit" className="bg-lime-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-lime-400 transition-colors">Submit Score</button>
          </div>
        </form>
      </div>
    </div>
  );
};
