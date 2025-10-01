import React, { useState } from 'react';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (matches: ParsedMatch[]) => void;
}

export interface ParsedMatch {
  teamAPlayer1: string;
  teamAPlayer2: string;
  teamBPlayer1: string;
  teamBPlayer2: string;
  teamAScore: number;
  teamBScore: number;
  gameNumber: number;
  matchDate: string;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [pastedData, setPastedData] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<ParsedMatch[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const parseTableData = (data: string): ParsedMatch[] => {
    const lines = data.trim().split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      throw new Error('No data provided');
    }

    const matches: ParsedMatch[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(/[\t,|]/).map(p => p.trim()).filter(p => p);

      if (parts.length < 7) {
        throw new Error(`Line ${i + 1}: Expected at least 7 columns (Team A Player 1, Team A Player 2, Team B Player 1, Team B Player 2, Team A Score, Team B Score, Game #). Got ${parts.length}`);
      }

      const [teamAP1, teamAP2, teamBP1, teamBP2, scoreA, scoreB, gameNum, ...rest] = parts;
      const date = rest.length > 0 ? rest[0] : new Date().toISOString().split('T')[0];

      const teamAScore = parseInt(scoreA, 10);
      const teamBScore = parseInt(scoreB, 10);
      const gameNumber = parseInt(gameNum, 10);

      if (isNaN(teamAScore) || isNaN(teamBScore)) {
        throw new Error(`Line ${i + 1}: Invalid scores (${scoreA}, ${scoreB})`);
      }

      if (isNaN(gameNumber)) {
        throw new Error(`Line ${i + 1}: Invalid game number (${gameNum})`);
      }

      if (teamAScore === teamBScore) {
        throw new Error(`Line ${i + 1}: Scores cannot be equal (no ties allowed)`);
      }

      if (teamAScore < 0 || teamBScore < 0) {
        throw new Error(`Line ${i + 1}: Scores must be positive`);
      }

      const players = [teamAP1, teamAP2, teamBP1, teamBP2];
      if (new Set(players).size !== 4) {
        throw new Error(`Line ${i + 1}: All four players must be unique`);
      }

      matches.push({
        teamAPlayer1: teamAP1,
        teamAPlayer2: teamAP2,
        teamBPlayer1: teamBP1,
        teamBPlayer2: teamBP2,
        teamAScore,
        teamBScore,
        gameNumber,
        matchDate: date,
      });
    }

    return matches;
  };

  const handlePreview = () => {
    setError('');
    setShowPreview(false);

    try {
      const parsed = parseTableData(pastedData);
      setPreview(parsed);
      setShowPreview(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse data');
    }
  };

  const handleSubmit = () => {
    if (preview.length === 0) {
      setError('No matches to upload');
      return;
    }
    onSubmit(preview);
    setPastedData('');
    setPreview([]);
    setShowPreview(false);
  };

  const handleClose = () => {
    setPastedData('');
    setError('');
    setPreview([]);
    setShowPreview(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Bulk Upload Matches</h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <h3 className="font-semibold text-lime-400 mb-2">Format Instructions</h3>
            <p className="text-sm text-slate-300 mb-2">
              Paste your match data with columns separated by tabs, commas, or pipes. Each line should contain:
            </p>
            <code className="text-xs text-lime-300 block bg-slate-900 p-2 rounded">
              Team A Player 1, Team A Player 2, Team B Player 1, Team B Player 2, Team A Score, Team B Score, Game #, [Date (optional)]
            </code>
            <p className="text-xs text-slate-400 mt-2">
              Example: Nick, Tim, Paul, Steve, 11, 9, 1, 2024-01-15
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Paste Match Data
            </label>
            <textarea
              value={pastedData}
              onChange={(e) => setPastedData(e.target.value)}
              className="w-full h-48 bg-slate-700 border border-slate-600 rounded-md p-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
              placeholder="Paste your match data here..."
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {showPreview && preview.length > 0 && (
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lime-400 mb-3">
                Preview ({preview.length} match{preview.length !== 1 ? 'es' : ''})
              </h3>
              <div className="overflow-x-auto max-h-64">
                <table className="w-full text-sm">
                  <thead className="text-slate-400 border-b border-slate-600">
                    <tr>
                      <th className="text-left p-2">Team A</th>
                      <th className="text-left p-2">Team B</th>
                      <th className="text-center p-2">Score</th>
                      <th className="text-center p-2">Game</th>
                      <th className="text-center p-2">Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    {preview.map((match, idx) => (
                      <tr key={idx} className="border-b border-slate-700/50">
                        <td className="p-2">{match.teamAPlayer1} & {match.teamAPlayer2}</td>
                        <td className="p-2">{match.teamBPlayer1} & {match.teamBPlayer2}</td>
                        <td className="text-center p-2">{match.teamAScore} - {match.teamBScore}</td>
                        <td className="text-center p-2">{match.gameNumber}</td>
                        <td className="text-center p-2 text-xs">{match.matchDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors"
            >
              Cancel
            </button>
            {!showPreview ? (
              <button
                type="button"
                onClick={handlePreview}
                disabled={!pastedData.trim()}
                className="bg-cyan-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Preview
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-lime-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-lime-400 transition-colors"
              >
                Upload {preview.length} Match{preview.length !== 1 ? 'es' : ''}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
