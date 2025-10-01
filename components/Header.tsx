import React from 'react';

const PickleballIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-lime-400" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM8.5 12a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0zm3.5-2.5a1 1 0 100 2 1 1 0 000-2zM5.13 8.35a1 1 0 011.414 0l1.06 1.06a1 1 0 11-1.414 1.414l-1.06-1.06a1 1 0 010-1.414zM16.4 14.18a1 1 0 011.414 0l1.06 1.06a1 1 0 01-1.414 1.414l-1.06-1.06a1 1 0 010-1.414zM8.35 5.13a1 1 0 010 1.414l-1.06 1.06A1 1 0 015.876 6.19l1.06-1.06a1 1 0 011.414 0zM14.18 16.4a1 1 0 010 1.414l-1.06 1.06a1 1 0 01-1.414-1.414l1.06-1.06a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const GearIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0l-.1.41a1.5 1.5 0 01-2.1 1.45l-.41-.1a1.5 1.5 0 00-1.88.93l-.28.48a1.5 1.5 0 00.36 1.93l.34.25a1.5 1.5 0 010 2.44l-.34.25a1.5 1.5 0 00-.36 1.93l.28.48a1.5 1.5 0 001.88.93l.41-.1a1.5 1.5 0 012.1 1.45l.1.41c.38 1.56 2.6 1.56 2.98 0l.1-.41a1.5 1.5 0 012.1-1.45l.41.1a1.5 1.5 0 001.88-.93l.28-.48a1.5 1.5 0 00-.36-1.93l-.34-.25a1.5 1.5 0 010-2.44l.34-.25a1.5 1.5 0 00.36-1.93l-.28-.48a1.5 1.5 0 00-1.88-.93l-.41.1a1.5 1.5 0 01-2.1-1.45l-.1-.41zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
);

interface HeaderProps {
    onAddMatch: () => void;
    onNavigate: (view: 'dashboard' | 'setup') => void;
    showAddMatch: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onAddMatch, onNavigate, showAddMatch }) => {
    return (
        <header className="bg-slate-900/70 backdrop-blur-lg sticky top-0 z-10 shadow-lg shadow-slate-950/10">
            <div className="container mx-auto flex items-center justify-between p-4">
                <div 
                    className="flex items-center space-x-3 cursor-pointer"
                    onClick={() => onNavigate('dashboard')}
                >
                    <PickleballIcon />
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        Pickleball League Tracker
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => onNavigate('setup')}
                        className="flex items-center space-x-2 bg-slate-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-lime-500"
                    >
                         <GearIcon />
                        <span>Setup</span>
                    </button>
                    {showAddMatch && (
                        <button 
                            onClick={onAddMatch}
                            className="bg-lime-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-lime-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-lime-500"
                        >
                            + Match
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};