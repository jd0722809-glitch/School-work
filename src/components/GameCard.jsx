import React from 'react';
import { Play, Star, Heart, Flame, Gamepad2 } from 'lucide-react';

export function GameCard({ game, onPlay, isFavorite, onToggleFavorite }) {
  return (
    <div
      id={`game-card-${game.id}`}
      onClick={() => onPlay(game)}
      className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer flex flex-col"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        {game.thumbnail ? (
          <img
            src={game.thumbnail}
            alt={game.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950"
            style={{
              borderColor: game.accentColor || '#06b6d4',
            }}
          >
            <Gamepad2 className="w-12 h-12 text-slate-700 group-hover:text-cyan-400 transition-colors" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono bg-slate-950/80 backdrop-blur-md text-cyan-400 border border-cyan-500/30">
            {game.category}
          </span>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {game.featured && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/30">
                <Flame className="w-3 h-3 text-amber-400" />
                HOT
              </span>
            )}
            <button
              id={`favorite-btn-${game.id}`}
              onClick={(e) => onToggleFavorite(e, game.id)}
              className={`p-1.5 rounded-lg backdrop-blur-md transition-all ${
                isFavorite
                  ? 'bg-rose-500/30 text-rose-400 border border-rose-500/40'
                  : 'bg-slate-950/70 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  isFavorite ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Hover Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/50 backdrop-blur-[2px]">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/40 transform group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 fill-current translate-x-0.5 text-slate-950" />
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-1">
            {game.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Bottom Metadata */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1 text-amber-400 font-medium">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{typeof game.rating === 'number' ? game.rating.toFixed(1) : '4.5'}</span>
          </div>

          <div className="flex items-center gap-1 font-mono text-slate-500">
            <span>{(game.plays || 0).toLocaleString()} plays</span>
          </div>
        </div>
      </div>
    </div>
  );
}
