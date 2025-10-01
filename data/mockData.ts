import type { Match } from '../types';

// FIX: Corrected the type annotation for `rawMatches` to `Match[]`.
// The raw data is missing the 'date' property, but it is added in the `.map()` function below,
// so the final exported constant is of type `Match[]`.
export const rawMatches: Match[] = [
  { game: 3, teamA: 'Nick & Tim', teamB: 'Udi & Dan', scoreA: 13, scoreB: 15 },
  { game: 1, teamA: 'Davide & Gaetano', teamB: 'Paul & Steve', scoreA: 10, scoreB: 12 },
  { game: 3, teamA: 'Nick & Tim', teamB: 'Paul & Steve', scoreA: 14, scoreB: 12 },
  { game: 1, teamA: 'Andrew & Alex', teamB: 'David & Ragav', scoreA: 8, scoreB: 11 },
  { game: 2, teamA: 'Andrew & Alex', teamB: 'David & Ragav', scoreA: 4, scoreB: 11 },
  { game: 3, teamA: 'Andrew & Alex', teamB: 'David & Ragav', scoreA: 1, scoreB: 11 },
  { game: 1, teamA: 'Andrew & Alex', teamB: 'Lee & Eric', scoreA: 8, scoreB: 11 },
  { game: 3, teamA: 'Andrew & Alex', teamB: 'Lee & Eric', scoreA: 1, scoreB: 11 },
  { game: 2, teamA: 'Brian & Tyler', teamB: 'David & Ragav', scoreA: 4, scoreB: 11 },
  { game: 1, teamA: 'Cam & Mark', teamB: 'David & Ragav', scoreA: 9, scoreB: 11 },
  { game: 2, teamA: 'Cam & Mark', teamB: 'David & Ragav', scoreA: 5, scoreB: 11 },
  { game: 3, teamA: 'Cam & Mark', teamB: 'David & Ragav', scoreA: 4, scoreB: 11 },
  { game: 1, teamA: 'Cam & Mark', teamB: 'Kevin & Fatima', scoreA: 6, scoreB: 11 },
  { game: 2, teamA: 'Cam & Mark', teamB: 'Kevin & Fatima', scoreA: 7, scoreB: 11 },
  { game: 3, teamA: 'Cam & Mark', teamB: 'Kevin & Fatima', scoreA: 6, scoreB: 11 },
  { game: 2, teamA: 'Cam & Mark', teamB: 'Paul & Steve', scoreA: 9, scoreB: 11 },
  { game: 3, teamA: 'Cam & Mark', teamB: 'Paul & Steve', scoreA: 4, scoreB: 11 },
  { game: 2, teamA: 'Cam & Mark', teamB: 'Udi & Dan', scoreA: 1, scoreB: 11 },
  { game: 3, teamA: 'Cam & Mark', teamB: 'Udi & Dan', scoreA: 2, scoreB: 11 },
  { game: 1, teamA: 'David & Ragav', teamB: 'George & Frank', scoreA: 6, scoreB: 11 },
  { game: 2, teamA: 'David & Ragav', teamB: 'George & Frank', scoreA: 8, scoreB: 11 },
  { game: 3, teamA: 'David & Ragav', teamB: 'George & Frank', scoreA: 5, scoreB: 11 },
  { game: 1, teamA: 'Kevin & Fatima', teamB: 'Brian & Tyler', scoreA: 7, scoreB: 11 },
  { game: 2, teamA: 'Kevin & Fatima', teamB: 'Brian & Tyler', scoreA: 3, scoreB: 11 },
  { game: 3, teamA: 'Kevin & Fatima', teamB: 'Brian & Tyler', scoreA: 5, scoreB: 11 },
  { game: 1, teamA: 'Kevin & Fatima', teamB: 'Linda & Peter', scoreA: 9, scoreB: 11 },
  { game: 2, teamA: 'Kevin & Fatima', teamB: 'Linda & Peter', scoreA: 3, scoreB: 11 },
  { game: 3, teamA: 'Kevin & Fatima', teamB: 'Linda & Peter', scoreA: 7, scoreB: 11 },
  { game: 2, teamA: 'Lee & Eric', teamB: 'Davide & Gaetano', scoreA: 9, scoreB: 11 },
  { game: 1, teamA: 'Lee & Eric', teamB: 'Udi & Dan', scoreA: 9, scoreB: 11 },
  { game: 2, teamA: 'Lee & Eric', teamB: 'Udi & Dan', scoreA: 9, scoreB: 11 },
  { game: 3, teamA: 'Lee & Eric', teamB: 'Udi & Dan', scoreA: 5, scoreB: 11 },
  { game: 1, teamA: 'Linda & Peter', teamB: 'David & Ragav', scoreA: 2, scoreB: 11 },
  { game: 2, teamA: 'Linda & Peter', teamB: 'David & Ragav', scoreA: 9, scoreB: 11 },
  { game: 3, teamA: 'Linda & Peter', teamB: 'David & Ragav', scoreA: 6, scoreB: 11 },
  { game: 1, teamA: 'Linda & Peter', teamB: 'Davide & Gaetano', scoreA: 6, scoreB: 11 },
  { game: 2, teamA: 'Linda & Peter', teamB: 'Davide & Gaetano', scoreA: 3, scoreB: 11 },
  { game: 3, teamA: 'Linda & Peter', teamB: 'Davide & Gaetano', scoreA: 2, scoreB: 11 },
  { game: 2, teamA: 'Nick & Tim', teamB: 'Cam & Mark', scoreA: 9, scoreB: 11 },
  { game: 3, teamA: 'Nick & Tim', teamB: 'Cam & Mark', scoreA: 4, scoreB: 11 },
  { game: 3, teamA: 'Nick & Tim', teamB: 'David & Ragav', scoreA: 8, scoreB: 11 },
  { game: 1, teamA: 'Nick & Tim', teamB: 'Paul & Steve', scoreA: 6, scoreB: 11 },
  { game: 1, teamA: 'Nick & Tim', teamB: 'Udi & Dan', scoreA: 5, scoreB: 11 },
  { game: 2, teamA: 'Nick & Tim', teamB: 'Udi & Dan', scoreA: 2, scoreB: 11 },
  { game: 1, teamA: 'Paul & Steve', teamB: 'Brian & Tyler', scoreA: 7, scoreB: 11 },
  { game: 2, teamA: 'Paul & Steve', teamB: 'Brian & Tyler', scoreA: 8, scoreB: 11 },
  { game: 3, teamA: 'Paul & Steve', teamB: 'Brian & Tyler', scoreA: 9, scoreB: 11 },
  { game: 2, teamA: 'Andrew & Alex', teamB: 'Lee & Eric', scoreA: 11, scoreB: 9 },
  { game: 1, teamA: 'Brian & Tyler', teamB: 'David & Ragav', scoreA: 11, scoreB: 9 },
  { game: 2, teamA: 'Davide & Gaetano', teamB: 'Paul & Steve', scoreA: 11, scoreB: 9 },
  { game: 3, teamA: 'George & Frank', teamB: 'Brian & Tyler', scoreA: 11, scoreB: 9 },
  { game: 1, teamA: 'Lee & Eric', teamB: 'Davide & Gaetano', scoreA: 11, scoreB: 9 },
  { game: 2, teamA: 'Nick & Tim', teamB: 'Paul & Steve', scoreA: 11, scoreB: 9 },
  { game: 3, teamA: 'Udi & Dan', teamB: 'Brian & Tyler', scoreA: 11, scoreB: 9 },
  { game: 1, teamA: 'Cam & Mark', teamB: 'Udi & Dan', scoreA: 11, scoreB: 8 },
  { game: 2, teamA: 'Nick & Tim', teamB: 'David & Ragav', scoreA: 11, scoreB: 8 },
  { game: 3, teamA: 'Davide & Gaetano', teamB: 'Paul & Steve', scoreA: 11, scoreB: 7 },
  { game: 1, teamA: 'George & Frank', teamB: 'Brian & Tyler', scoreA: 11, scoreB: 7 },
  { game: 3, teamA: 'Nick & Tim', teamB: 'Andrew & Alex', scoreA: 11, scoreB: 6 },
  { game: 3, teamA: 'Brian & Tyler', teamB: 'David & Ragav', scoreA: 11, scoreB: 5 },
  { game: 3, teamA: 'Lee & Eric', teamB: 'Davide & Gaetano', scoreA: 11, scoreB: 5 },
  { game: 1, teamA: 'Udi & Dan', teamB: 'Brian & Tyler', scoreA: 11, scoreB: 5 },
  { game: 1, teamA: 'Cam & Mark', teamB: 'Paul & Steve', scoreA: 11, scoreB: 4 },
  { game: 2, teamA: 'George & Frank', teamB: 'Brian & Tyler', scoreA: 11, scoreB: 4 },
  { game: 1, teamA: 'Nick & Tim', teamB: 'Cam & Mark', scoreA: 11, scoreB: 4 },
  { game: 1, teamA: 'Nick & Tim', teamB: 'Andrew & Alex', scoreA: 11, scoreB: 3 },
  { game: 2, teamA: 'Nick & Tim', teamB: 'Andrew & Alex', scoreA: 11, scoreB: 3 },
  { game: 2, teamA: 'Udi & Dan', teamB: 'Brian & Tyler', scoreA: 11, scoreB: 3 },
  { game: 1, teamA: 'Udi & Dan', teamB: 'Kevin & Fatima', scoreA: 11, scoreB: 3 },
  { game: 1, teamA: 'Nick & Tim', teamB: 'David & Ragav', scoreA: 11, scoreB: 2 },
  { game: 2, teamA: 'Udi & Dan', teamB: 'Kevin & Fatima', scoreA: 11, scoreB: 2 },
  { game: 3, teamA: 'Udi & Dan', teamB: 'Kevin & Fatima', scoreA: 11, scoreB: 1 },
].map((m, i) => {
    const baseDate = new Date('2023-10-10T12:00:00Z');
    const dayOffset = Math.floor(i / 8); // ~8 games per day, spread across weeks
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + dayOffset);
    
    return {
        ...m,
        date: date.toISOString().split('T')[0], // 'YYYY-MM-DD'
        game: typeof m.game === 'string' ? 0 : m.game
    };
}) as Match[];

const playerSet = new Set<string>();
rawMatches.forEach(match => {
    match.teamA.split(' & ').forEach(p => playerSet.add(p.trim()));
    match.teamB.split(' & ').forEach(p => playerSet.add(p.trim()));
});

export const initialPlayers = Array.from(playerSet).sort();