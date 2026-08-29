import React, { useState, useEffect, useMemo } from 'react';
import defaultGamesData from './data/games.json';
import { Header } from './components/Header.jsx';
import { CategoryBar } from './components/CategoryBar.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { JsonManagerModal } from './components/JsonManagerModal.jsx';
import { DisguiseModal } from './components/DisguiseModal.jsx';
import {
  Gamepad2,
  Sparkles,
  Flame,
  Search,
  RotateCcw,
  FileJson,
  Heart,
  Plus,
  Play,
  Dices,
  Shield,
  Zap,
  Layers,
  Award,
} from 'lucide-react';

const STORAGE_GAMES_KEY = 'unblocked_vault_games_v1';
const STORAGE_FAVORITES_KEY = 'unblocked_vault_favorites_v1';

const getInitialGames = () => {
  let fallback = [];
  if (Array.isArray(defaultGamesData)) {
    fallback = defaultGamesData;
  } else if (defaultGamesData && Array.isArray(defaultGamesData.default)) {
    fallback = defaultGamesData.default;
  }

  try {
    const saved = localStorage.getItem(STORAGE_GAMES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse saved games:', e);
  }
  return fallback;
};

export default function App() {
  // Load games from localStorage or default JSON
  const [games, setGames] = useState(getInitialGames);

  // Load favorites
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FAVORITES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse favorites:', e);
    }
    return ['2048', 'hextris', 'chrome-dino'];
  });

  const [activeGame, setActiveGame] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('popular');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isDisguiseModalOpen, setIsDisguiseModalOpen] = useState(false);

  // Sync games to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_GAMES_KEY, JSON.stringify(games));
    } catch (e) {
      console.error(e);
    }
  }, [games]);

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const handleToggleFavorite = (e, gameId) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId]
    );
  };

  const handlePlayGame = (game) => {
    // Increment plays count
    setGames((prev) =>
      prev.map((g) =>
        g.id === game.id ? { ...g, plays: (g.plays || 0) + 1 } : g
      )
    );
    setActiveGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRandomGame = () => {
    if (games.length === 0) return;
    const randomIndex = Math.floor(Math.random() * games.length);
    handlePlayGame(games[randomIndex]);
  };

  const handleAddGame = (newGame) => {
    setGames((prev) => [newGame, ...prev]);
    setActiveGame(newGame);
  };

  const handleImportGames = (importedGames) => {
    setGames(importedGames);
    if (activeGame && !importedGames.some((g) => g.id === activeGame.id)) {
      setActiveGame(null);
    }
  };

  const handleResetDefaults = () => {
    setGames(defaultGamesData);
    localStorage.removeItem(STORAGE_GAMES_KEY);
    if (activeGame) {
      setActiveGame(null);
    }
  };

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: Array.isArray(games) ? games.length : 0 };
    if (Array.isArray(games)) {
      games.forEach((game) => {
        if (game && game.category) {
          counts[game.category] = (counts[game.category] || 0) + 1;
        }
      });
    }
    return counts;
  }, [games]);

  // Total play count
  const totalPlays = useMemo(() => {
    if (!Array.isArray(games)) return 0;
    return games.reduce((acc, g) => acc + (Number(g?.plays) || 0), 0);
  }, [games]);

  // Filter & Sort games
  const filteredGames = useMemo(() => {
    if (!Array.isArray(games)) return [];
    return games
      .filter((game) => {
        if (!game) return false;
        // Favorites filter
        if (showFavoritesOnly && !favorites.includes(game.id)) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'All' && game.category !== selectedCategory) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchTitle = (game.title || '').toLowerCase().includes(query);
          const matchDesc = (game.description || '').toLowerCase().includes(query);
          const matchCategory = (game.category || '').toLowerCase().includes(query);
          const matchTags = Array.isArray(game.tags)
            ? game.tags.some((t) => (t || '').toLowerCase().includes(query))
            : false;
          return matchTitle || matchDesc || matchCategory || matchTags;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'popular':
            return (Number(b?.plays) || 0) - (Number(a?.plays) || 0);
          case 'rating':
            return (Number(b?.rating) || 0) - (Number(a?.rating) || 0);
          case 'newest':
            return (b?.featured ? 1 : 0) - (a?.featured ? 1 : 0);
          case 'alphabetical':
            return (a?.title || '').localeCompare(b?.title || '');
          default:
            return 0;
        }
      });
  }, [games, selectedCategory, searchQuery, sortOption, showFavoritesOnly, favorites]);

  // Spotlight featured game
  const spotlightGame = useMemo(() => {
    if (!Array.isArray(games) || games.length === 0) return null;
    return games.find((g) => g?.featured) || games[0] || null;
  }, [games]);

  // Secondary featured games
  const secondaryFeatured = useMemo(() => {
    return games.filter((g) => g.id !== spotlightGame?.id).slice(0, 2);
  }, [games, spotlightGame]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRandomGame={handleRandomGame}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onOpenDisguiseModal={() => setIsDisguiseModalOpen(true)}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
        favoritesCount={favorites.length}
        totalGamesCount={games.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeGame ? (
          /* Active Game Player View */
          <GamePlayer
            game={activeGame}
            onBack={() => setActiveGame(null)}
            isFavorite={favorites.includes(activeGame.id)}
            onToggleFavorite={handleToggleFavorite}
            allGames={games}
            onSelectGame={handlePlayGame}
          />
        ) : (
          /* Bento Grid Catalog View */
          <div className="space-y-6">
            {/* Bento Hero Showcase (When not searching and on "All" view) */}
            {!searchQuery && !showFavoritesOnly && selectedCategory === 'All' && spotlightGame && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Spotlight Bento Item (Spans 2 cols on lg) */}
                <div
                  onClick={() => handlePlayGame(spotlightGame)}
                  className="group relative md:col-span-2 lg:col-span-2 rounded-3xl overflow-hidden cursor-pointer border border-cyan-500/30 hover:border-cyan-400/80 bg-gradient-to-br from-slate-900 to-[#020617] p-6 flex flex-col justify-between transition-all duration-300 shadow-xl shadow-cyan-950/40 min-h-[260px]"
                >
                  <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity">
                    <img
                      src={spotlightGame.thumbnail}
                      alt={spotlightGame.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent" />
                  </div>

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      FEATURED SPOTLIGHT
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-bold px-2.5 py-0.5 rounded-lg bg-slate-950/80 border border-slate-800">
                      {spotlightGame.category}
                    </span>
                  </div>

                  <div className="relative z-10 pt-12">
                    <h2 className="text-2xl font-extrabold text-white group-hover:text-cyan-300 transition-colors font-mono">
                      {spotlightGame.title}
                    </h2>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 max-w-md">
                      {spotlightGame.description}
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="px-4 py-2 rounded-xl bg-cyan-500 group-hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition-all">
                        <Play className="w-4 h-4 fill-current" />
                        <span>Play Now</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        ⭐ {typeof spotlightGame.rating === 'number' ? spotlightGame.rating.toFixed(1) : '4.8'} • {(spotlightGame.plays || 0).toLocaleString()} plays
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vault Stats Bento Box */}
                <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-5 flex flex-col justify-between shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      VAULT STATS
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 my-3">
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                      <div className="text-xl font-extrabold text-white font-mono">
                        {games.length}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                        Games in JSON
                      </div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                      <div className="text-xl font-extrabold text-cyan-400 font-mono">
                        {totalPlays.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                        Total Sessions
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                    <span>Offline Engines: 3</span>
                    <span className="text-emerald-400 font-semibold">100% Client JS</span>
                  </div>
                </div>

                {/* Quick Vault Actions Bento Box */}
                <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-5 flex flex-col justify-between shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      QUICK LAUNCH
                    </span>
                  </div>

                  <div className="space-y-2 my-2">
                    <button
                      onClick={handleRandomGame}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-cyan-400 border border-slate-800 transition-all text-xs font-semibold"
                    >
                      <span className="flex items-center gap-2">
                        <Dices className="w-4 h-4 text-cyan-400" />
                        <span>Surprise Me</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Random Game</span>
                    </button>

                    <button
                      onClick={() => setIsJsonModalOpen(true)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-emerald-400 border border-slate-800 transition-all text-xs font-semibold"
                    >
                      <span className="flex items-center gap-2">
                        <FileJson className="w-4 h-4 text-emerald-400" />
                        <span>JSON Database</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Export/Import</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => setIsDisguiseModalOpen(true)}
                      className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                    >
                      <Shield className="w-3 h-3" />
                      <span>Tab Cloaker</span>
                    </button>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Game</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Category Filter & Sort Bento Bar */}
            <CategoryBar
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setShowFavoritesOnly(false);
              }}
              categoryCounts={categoryCounts}
              sortOption={sortOption}
              onSortChange={setSortOption}
            />

            {/* Current Filter Title / Status Bar */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-sm text-slate-200 font-mono">
                  {showFavoritesOnly
                    ? 'SAVED FAVORITES'
                    : selectedCategory === 'All'
                    ? 'ALL UNBLOCKED GAMES'
                    : `${selectedCategory.toUpperCase()} GAMES`}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-slate-900 text-cyan-400 border border-slate-800">
                  {filteredGames.length} Available
                </span>
              </div>

              {(searchQuery || showFavoritesOnly || selectedCategory !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setShowFavoritesOnly(false);
                  }}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors font-mono"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Game Cards Bento Grid */}
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onPlay={handlePlayGame}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              /* Empty State Bento Box */
              <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-800">
                  <Search className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="font-bold text-base text-slate-200 font-mono">
                  NO MATCHING GAMES FOUND
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {searchQuery
                    ? `No games found matching "${searchQuery}". Try another keyword or add a new custom iframe game.`
                    : 'No games found in this category.'}
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setShowFavoritesOnly(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-800 transition-colors"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-slate-950 transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Custom Game</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bento Styled Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-[#020617] py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Gamepad2 className="w-3 h-3" />
            </div>
            <span className="font-bold text-slate-200 font-mono">UNBLOCKED VAULT</span>
            <span className="text-slate-700">•</span>
            <span>JSON Iframe Architecture</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1 font-mono"
            >
              <FileJson className="w-3.5 h-3.5 text-emerald-400" />
              <span>games.json vault</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsDisguiseModalOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              Tab Cloak
            </button>
            <span>•</span>
            <span>Pure HTML, JS, CSS</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      <JsonManagerModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={games}
        onImportGames={handleImportGames}
        onResetDefaults={handleResetDefaults}
      />

      <DisguiseModal
        isOpen={isDisguiseModalOpen}
        onClose={() => setIsDisguiseModalOpen(false)}
      />
    </div>
  );
}
