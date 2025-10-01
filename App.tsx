import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { PlayerProfile } from './components/PlayerProfile';
import { AddScoreModal } from './components/AddScoreModal';
import { BulkUploadModal, type ParsedMatch } from './components/BulkUploadModal';
import { LeagueSetup } from './components/LeagueSetup';
import { DatabaseService } from './lib/database.service';
import type { Match, TeamStats, PlayerStats } from './types';

const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<string[]>([]);
  const [view, setView] = useState<'dashboard' | 'setup'>('dashboard');
  const [stats, setStats] = useState<TeamStats[]>([]);
  const [playerStats, setPlayerStats] = useState<Map<string, PlayerStats>>(new Map());
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [isAddScoreModalOpen, setAddScoreModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [matchesData, playersData] = await Promise.all([
        DatabaseService.getMatchesWithPlayerNames(),
        DatabaseService.getAllPlayers(),
      ]);
      setMatches(matchesData);
      setPlayers(playersData.map(p => p.name));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const processedMatches = useMemo<Match[]>(() => {
    return matches
      .map(match => ({
        ...match,
        teamA: match.teamA.split(' & ').sort().join(' & '),
        teamB: match.teamB.split(' & ').sort().join(' & '),
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [matches]);

  useEffect(() => {
    const calculateTeamStats = () => {
      const teamStatsMap = new Map<string, TeamStats>();

      const initializeTeam = (name: string) => {
        if (!teamStatsMap.has(name)) {
          teamStatsMap.set(name, {
            name,
            played: 0,
            wins: 0,
            losses: 0,
            pointsFor: 0,
            pointsAgainst: 0,
            pointsDifference: 0,
          });
        }
      };

      processedMatches.forEach(match => {
        initializeTeam(match.teamA);
        initializeTeam(match.teamB);

        const statsA = teamStatsMap.get(match.teamA)!;
        const statsB = teamStatsMap.get(match.teamB)!;

        statsA.played += 1;
        statsB.played += 1;

        statsA.pointsFor += match.scoreA;
        statsA.pointsAgainst += match.scoreB;
        statsB.pointsFor += match.scoreB;
        statsB.pointsAgainst += match.scoreA;
        
        if (match.scoreA > match.scoreB) {
          statsA.wins += 1;
          statsB.losses += 1;
        } else {
          statsB.wins += 1;
          statsA.losses += 1;
        }
      });
      
      teamStatsMap.forEach(stats => {
          stats.pointsDifference = stats.pointsFor - stats.pointsAgainst;
      });

      const sortedStats = Array.from(teamStatsMap.values()).sort((a, b) => {
        if (b.wins !== a.wins) {
          return b.wins - a.wins;
        }
        if (b.pointsDifference !== a.pointsDifference) {
            return b.pointsDifference - a.pointsDifference;
        }
        return b.pointsFor - a.pointsFor;
      });

      setStats(sortedStats);
    };

    const calculatePlayerStats = () => {
        const playerStatsMap = new Map<string, PlayerStats>();

        const initializePlayer = (name: string) => {
            if (!playerStatsMap.has(name)) {
                playerStatsMap.set(name, {
                    name,
                    played: 0,
                    wins: 0,
                    losses: 0,
                    winRate: 0,
                    pointsFor: 0,
                    pointsAgainst: 0,
                });
            }
        };

        processedMatches.forEach(match => {
            const teamAPlayers = match.teamA.split(' & ');
            const teamBPlayers = match.teamB.split(' & ');
            const allMatchPlayers = [...teamAPlayers, ...teamBPlayers];

            allMatchPlayers.forEach(p => initializePlayer(p.trim()));

            const isTeamAWinner = match.scoreA > match.scoreB;

            teamAPlayers.forEach(playerName => {
                const stats = playerStatsMap.get(playerName.trim())!;
                stats.played += 1;
                stats.wins += isTeamAWinner ? 1 : 0;
                stats.losses += isTeamAWinner ? 0 : 1;
                stats.pointsFor += match.scoreA;
                stats.pointsAgainst += match.scoreB;
            });

            teamBPlayers.forEach(playerName => {
                const stats = playerStatsMap.get(playerName.trim())!;
                stats.played += 1;
                stats.wins += !isTeamAWinner ? 1 : 0;
                stats.losses += !isTeamAWinner ? 0 : 1;
                stats.pointsFor += match.scoreB;
                stats.pointsAgainst += match.scoreA;
            });
        });

        playerStatsMap.forEach(stats => {
            stats.winRate = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
        });
        
        setPlayerStats(playerStatsMap);
    };

    calculateTeamStats();
    calculatePlayerStats();
  }, [processedMatches]);

  const handlePlayerSelect = (playerName: string) => {
    if (playerStats.has(playerName)) {
      setSelectedPlayer(playerName);
    }
  };

  const handleCloseProfile = () => {
    setSelectedPlayer(null);
  };
  
  const handleAddMatch = async (newMatch: Omit<Match, 'game' | 'date'> & { game: number | string }) => {
    const gameNumber = typeof newMatch.game === 'string' ? parseInt(newMatch.game, 10) : newMatch.game;
    if (isNaN(gameNumber)) return;

    try {
      setError(null);
      const [teamAPlayer1, teamAPlayer2] = newMatch.teamA.split(' & ');
      const [teamBPlayer1, teamBPlayer2] = newMatch.teamB.split(' & ');

      await DatabaseService.createMatch({
        gameNumber,
        matchDate: new Date().toISOString().split('T')[0],
        teamAPlayer1: teamAPlayer1.trim(),
        teamAPlayer2: teamAPlayer2.trim(),
        teamBPlayer1: teamBPlayer1.trim(),
        teamBPlayer2: teamBPlayer2.trim(),
        teamAScore: newMatch.scoreA,
        teamBScore: newMatch.scoreB,
      });

      await loadData();
      setAddScoreModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add match');
      console.error('Error adding match:', err);
    }
  };

  const handleBulkUpload = async (matches: ParsedMatch[]) => {
    try {
      setError(null);
      setBulkUploadModalOpen(false);
      setIsLoading(true);

      for (const match of matches) {
        await DatabaseService.createMatch(match);
      }

      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload matches');
      console.error('Error uploading matches:', err);
      setIsLoading(false);
    }
  };

  const handleLeagueSetup = async (newPlayers: string[]) => {
    try {
      setError(null);
      await Promise.all(newPlayers.map(name => DatabaseService.getOrCreatePlayer(name)));
      await loadData();
      setView('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup league');
      console.error('Error setting up league:', err);
    }
  };

  const selectedPlayerData = useMemo(() => {
    if (!selectedPlayer) return null;
    const stats = playerStats.get(selectedPlayer);
    if (!stats) return null;
    
    const matches = processedMatches.filter(m => 
        m.teamA.includes(selectedPlayer) || m.teamB.includes(selectedPlayer)
    );

    return { stats, matches };
  }, [selectedPlayer, playerStats, processedMatches]);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans">
      <Header
        onAddMatch={() => setAddScoreModalOpen(true)}
        onUpload={() => setBulkUploadModalOpen(true)}
        onNavigate={setView}
        showAddMatch={view === 'dashboard'}
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mb-4"></div>
              <p className="text-slate-400">Loading league data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
            <p className="text-red-400 font-semibold mb-2">Error loading data</p>
            <p className="text-slate-300 mb-4">{error}</p>
            <button
              onClick={loadData}
              className="bg-lime-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-lime-400 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : view === 'dashboard' ? (
            <Dashboard stats={stats} matches={processedMatches} onSelectPlayer={handlePlayerSelect} />
        ) : (
            <LeagueSetup onSetup={handleLeagueSetup} onCancel={() => setView('dashboard')} currentPlayers={players} />
        )}
      </main>
      {selectedPlayerData && (
        <PlayerProfile 
          player={selectedPlayerData.stats} 
          matches={selectedPlayerData.matches} 
          onClose={handleCloseProfile} 
        />
      )}
      {isAddScoreModalOpen && (
        <AddScoreModal
            isOpen={isAddScoreModalOpen}
            onClose={() => setAddScoreModalOpen(false)}
            onSubmit={handleAddMatch}
            players={players}
        />
      )}
      {isBulkUploadModalOpen && (
        <BulkUploadModal
            isOpen={isBulkUploadModalOpen}
            onClose={() => setBulkUploadModalOpen(false)}
            onSubmit={handleBulkUpload}
        />
      )}
    </div>
  );
};

export default App;
