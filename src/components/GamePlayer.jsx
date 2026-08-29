import React, { useState, useRef, useEffect } from 'react';
import { EMBEDDED_GAMES } from '../data/embeddedGames.js';
import {
  ArrowLeft,
  Maximize,
  Minimize,
  RotateCw,
  ExternalLink,
  Heart,
  Gamepad,
  Keyboard,
  Info,
  Sparkles,
  Code2,
  Tv,
} from 'lucide-react';

export function GamePlayer({
  game,
  onBack,
  isFavorite,
  onToggleFavorite,
  allGames = [],
  onSelectGame,
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [useEmbeddedFallback, setUseEmbeddedFallback] = useState(() => {
    return Boolean(EMBEDDED_GAMES[game.id]);
  });
  const [showJsonDetails, setShowJsonDetails] = useState(false);

  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  // Reset embedded mode when game changes
  useEffect(() => {
    setUseEmbeddedFallback(Boolean(EMBEDDED_GAMES[game.id]));
    setIframeKey((prev) => prev + 1);
  }, [game.id]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen error:', err);
    }
  };

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleOpenNewTab = () => {
    if (game.iframeUrl) {
      window.open(game.iframeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const relatedGames = allGames
    .filter((g) => g.id !== game.id && (g.category === game.category || g.featured))
    .slice(0, 4);

  const hasEmbeddedEngine = Boolean(EMBEDDED_GAMES[game.id]);

  return (
    <div className="flex flex-col gap-6 py-4 animate-in fade-in duration-300">
      {/* Top Action Bar Bento */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <button
            id="back-to-games-btn"
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Vault</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2 font-mono">
              <span>{game.title}</span>
              <span className="text-xs px-2 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                {game.category}
              </span>
            </h1>
          </div>
        </div>

        {/* Player Controls Bento */}
        <div className="flex items-center gap-2">
          {hasEmbeddedEngine && (
            <button
              onClick={() => setUseEmbeddedFallback(!useEmbeddedFallback)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                useEmbeddedFallback
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Toggle between standalone HTML5 engine and web host"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {useEmbeddedFallback ? 'Offline Engine (Active)' : 'Web Host'}
              </span>
            </button>
          )}

          <button
            id="player-favorite-btn"
            onClick={(e) => onToggleFavorite(e, game.id)}
            className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
              isFavorite
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-sm shadow-rose-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title={isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
          </button>

          <button
            id="player-theater-btn"
            onClick={() => setIsTheater(!isTheater)}
            className={`p-2 rounded-xl border border-slate-800 transition-all ${
              isTheater
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                : 'bg-slate-950 text-slate-300 hover:text-cyan-400'
            }`}
            title="Toggle Theater Mode"
          >
            <Tv className="w-4 h-4" />
          </button>

          <button
            id="player-reload-btn"
            onClick={handleReload}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-all"
            title="Reload game iframe"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            id="player-newtab-btn"
            onClick={handleOpenNewTab}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-all"
            title="Open original game in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            id="player-fullscreen-btn"
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/25 transition-all"
            title="Toggle fullscreen"
          >
            {isFullscreen ? (
              <>
                <Minimize className="w-4 h-4" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize className="w-4 h-4" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Iframe Player Stage Bento Container */}
      <div
        ref={containerRef}
        className={`relative w-full rounded-3xl overflow-hidden border border-slate-800 bg-[#020617] shadow-2xl flex flex-col ${
          isFullscreen
            ? 'h-screen border-none rounded-none'
            : isTheater
            ? 'h-[750px]'
            : 'h-[580px] sm:h-[640px]'
        }`}
      >
        {/* Iframe element */}
        {useEmbeddedFallback && EMBEDDED_GAMES[game.id] ? (
          <iframe
            key={`embed-${game.id}-${iframeKey}`}
            ref={iframeRef}
            srcDoc={EMBEDDED_GAMES[game.id]}
            title={game.title}
            className="w-full h-full border-none bg-slate-950 flex-1"
            allow="fullscreen; autoplay; gamepad; keyboard"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : game.iframeHtml ? (
          <div
            className="w-full h-full flex items-center justify-center bg-slate-950"
            dangerouslySetInnerHTML={{ __html: game.iframeHtml }}
          />
        ) : (
          <iframe
            key={`url-${game.id}-${iframeKey}`}
            ref={iframeRef}
            src={game.iframeUrl}
            title={game.title}
            className="w-full h-full border-none bg-slate-950 flex-1"
            allow="fullscreen; autoplay; gamepad; keyboard"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
          />
        )}
      </div>

      {/* Game Details & Controls Guide (Bento Multi-Block Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: About & Instructions Bento Box */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-cyan-400 font-bold text-sm font-mono">
              <Info className="w-4 h-4" />
              <span>ABOUT {game.title.toUpperCase()}</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-5">
              {game.description}
            </p>

            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
              <div className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider mb-2">
                How to Play
              </div>
              <p className="text-slate-200 text-sm leading-relaxed">
                {game.instructions}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5 mt-5">
              {game.tags &&
                game.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-xl text-xs bg-slate-950 text-slate-400 border border-slate-800 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
            </div>
          </div>

          {/* JSON Object Inspector Bento */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-5 shadow-lg">
            <button
              onClick={() => setShowJsonDetails(!showJsonDetails)}
              className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>JSON Record for this Game</span>
              </span>
              <span className="font-mono text-cyan-400">{showJsonDetails ? 'Hide JSON [-]' : 'View Raw JSON [+]'}</span>
            </button>
            {showJsonDetails && (
              <pre className="mt-4 p-4 rounded-2xl bg-slate-950 text-[11px] text-emerald-400 font-mono overflow-x-auto border border-slate-800 leading-relaxed">
                {JSON.stringify(game, null, 2)}
              </pre>
            )}
          </div>
        </div>

        {/* Right: Key Controls & Suggested Games Bento Blocks */}
        <div className="space-y-4">
          {/* Controls Bento Box */}
          {game.controls && Object.keys(game.controls).length > 0 && (
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-3 text-cyan-400 font-bold text-sm font-mono">
                <Keyboard className="w-4 h-4" />
                <span>GAME CONTROLS</span>
              </div>
              <div className="space-y-2">
                {Object.entries(game.controls).map(([key, action]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-3 text-xs bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800"
                  >
                    <kbd className="px-2.5 py-1 bg-slate-900 text-cyan-300 font-mono font-bold rounded-lg border border-slate-700 shadow-sm text-[11px]">
                      {key}
                    </kbd>
                    <span className="text-slate-300 text-right">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Games Suggestions Bento Box */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-cyan-400 font-bold text-sm font-mono">
              <Gamepad className="w-4 h-4" />
              <span>MORE {game.category.toUpperCase()} GAMES</span>
            </div>
            <div className="space-y-2.5">
              {relatedGames.map((relGame) => (
                <div
                  key={relGame.id}
                  onClick={() => onSelectGame(relGame)}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all group"
                >
                  <img
                    src={
                      relGame.thumbnail ||
                      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=120'
                    }
                    alt={relGame.title}
                    className="w-12 h-10 rounded-xl object-cover bg-slate-900 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 truncate">
                      {relGame.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {relGame.category} • ⭐ {typeof relGame.rating === 'number' ? relGame.rating.toFixed(1) : '4.8'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
