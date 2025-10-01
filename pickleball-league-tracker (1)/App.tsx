import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { PlayerProfile } from './components/PlayerProfile';
import { AddScoreModal } from './components/AddScoreModal';
import { LeagueSetup } from './components/LeagueSetup';
import { rawMatches, initialPlayers } from './data/mockData';
import type { Match, TeamStats, PlayerStats } from './types';

const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>(rawMatches);
  const [players, setPlayers] = useState<string[]>(initialPlayers);
  const [view, setView] = useState<'dashboard' | 'setup'>('dashboard');
  const [stats, setStats] = useState<TeamStats[]>([]);
  const [playerStats, setPlayerStats] = useState<Map<string, PlayerStats>>(new Map());
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [isAddScoreModalOpen, setAddScoreModalOpen] = useState(false);

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
  
  const handleAddMatch = (newMatch: Omit<Match, 'game' | 'date'> & { game: number | string }) => {
    const gameNumber = typeof newMatch.game === 'string' ? parseInt(newMatch.game, 10) : newMatch.game;
    if (isNaN(gameNumber)) return;

    const matchWithDate: Match = {
        ...newMatch,
        game: gameNumber,
        date: new Date().toISOString().split('T')[0], // Add current date
    };

    setMatches(prevMatches => [...prevMatches, matchWithDate]);
    setAddScoreModalOpen(false);
  };

  const handleLeagueSetup = (newPlayers: string[]) => {
    setPlayers(newPlayers);
    setMatches([]); // Reset matches for the new league
    setView('dashboard');
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
        onNavigate={setView}
        showAddMatch={view === 'dashboard'}
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {view === 'dashboard' ? (
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
    </div>
  );
};

export default App;
