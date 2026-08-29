import React from 'react';
import {
  Gamepad2,
  Search,
  Dices,
  PlusCircle,
  FileJson,
  Shield,
  Heart,
  X,
  Sparkles,
} from 'lucide-react';

export function Header({
  searchQuery,
  onSearchChange,
  onRandomGame,
  onOpenAddModal,
  onOpenJsonModal,
  onOpenDisguiseModal,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  favoritesCount,
  totalGamesCount,
}) {
  return (
    <header className="sticky top-0 z-30 bg-[#020617]/90 backdrop-blur-xl border-b border-slate-800/80 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo Bento Block */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-base sm:text-lg text-slate-100 font-mono">
                UNBLOCKED<span className="text-cyan-400">VAULT</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                <Sparkles className="w-2.5 h-2.5" />
                JSON IFRAMES
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              {totalGamesCount} Web Games • Pure HTML/JS/CSS Storage
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md relative hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="game-search-input"
              type="text"
              placeholder="Search unblocked games, tags, or genres..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-10 pr-10 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons Bento Cluster */}
        <div className="flex items-center gap-2">
          {/* Favorites Filter Toggle */}
          <button
            id="toggle-favorites-btn"
            onClick={onToggleFavoritesOnly}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              showFavoritesOnly
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-sm shadow-rose-500/20'
                : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="Show saved favorite games"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                showFavoritesOnly ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
              }`}
            />
            <span className="hidden md:inline">Favorites</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-950 text-[10px] font-mono font-bold text-rose-400">
              {favoritesCount}
            </span>
          </button>

          {/* Random Game */}
          <button
            id="random-game-btn"
            onClick={onRandomGame}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-all"
            title="Play a random game"
          >
            <Dices className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">Random</span>
          </button>

          {/* Add Game */}
          <button
            id="add-game-btn"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all"
            title="Add a new game with an iframe"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Game</span>
          </button>

          {/* JSON File Manager */}
          <button
            id="json-manager-btn"
            onClick={onOpenJsonModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-all"
            title="Manage games.json database"
          >
            <FileJson className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xl:inline">JSON Vault</span>
          </button>

          {/* Tab Cloaker */}
          <button
            id="disguise-tab-btn"
            onClick={onOpenDisguiseModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-amber-400 transition-all"
            title="Cloak tab & disguise icon"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">Cloak</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-3 sm:hidden">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search games, tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-10 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
