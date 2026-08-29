import React, { useState } from 'react';
import { X, Plus, Play, Sparkles, ExternalLink } from 'lucide-react';

export function AddGameModal({ isOpen, onClose, onAddGame }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [iframeInput, setIframeInput] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [tags, setTags] = useState('');
  const [controlsKey, setControlsKey] = useState('Arrow Keys / WASD');
  const [controlsVal, setControlsVal] = useState('Move player');
  const [previewActive, setPreviewActive] = useState(false);

  if (!isOpen) return null;

  // Extract clean URL if user pasted raw <iframe src="..."></iframe>
  const parseIframeUrl = (input) => {
    const trimmed = (input || '').trim();
    if (trimmed.startsWith('<iframe')) {
      const match = trimmed.match(/src=["']([^"']+)["']/);
      if (match && match[1]) {
        return match[1];
      }
    }
    return trimmed;
  };

  const cleanUrl = parseIframeUrl(iframeInput);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !iframeInput.trim()) return;

    const id =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `game-${Date.now()}`;

    const tagsArray = tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    if (tagsArray.length === 0) {
      tagsArray.push(category.toLowerCase(), 'custom');
    }

    const newGame = {
      id,
      title: title.trim(),
      category: category === 'All' ? 'Arcade' : category,
      description:
        description.trim() ||
        `Play ${title.trim()} unblocked in browser via JSON iframe.`,
      instructions:
        instructions.trim() || 'Use keyboard or mouse controls to play.',
      iframeUrl: cleanUrl,
      thumbnail:
        thumbnail.trim() ||
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
      tags: tagsArray,
      rating: 5.0,
      featured: true,
      plays: 1,
      controls: {
        [controlsKey.trim() || 'Controls']: controlsVal.trim() || 'Interact',
      },
    };

    onAddGame(newGame);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#020617] border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shadow-inner">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white font-mono">
                ADD CUSTOM IFRAME GAME
              </h2>
              <p className="text-xs text-slate-400">
                Register a new game entry into the JSON database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Game Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Slope 3D / Super Mario"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
              >
                <option value="Arcade">Arcade</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Action">Action</option>
                <option value="Classic">Classic</option>
                <option value="Strategy">Strategy</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
          </div>

          {/* Iframe URL or snippet */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Iframe Web URL or Embed Code *
              </label>
              <button
                type="button"
                onClick={() => setPreviewActive(!previewActive)}
                disabled={!cleanUrl}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 disabled:opacity-40 flex items-center gap-1 font-mono"
              >
                <Play className="w-3 h-3" />
                {previewActive ? 'Hide Live Test' : 'Test Iframe Live'}
              </button>
            </div>
            <textarea
              required
              rows={2}
              placeholder="Paste game URL (https://...) or full <iframe src='...'> snippet"
              value={iframeInput}
              onChange={(e) => setIframeInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 text-xs font-mono text-cyan-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          {/* Live Preview Box */}
          {previewActive && cleanUrl && (
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate max-w-[320px]">URL: {cleanUrl}</span>
                <span className="text-emerald-400 font-mono">SANDBOX ACTIVE</span>
              </div>
              <div className="h-44 rounded-xl overflow-hidden border border-slate-800 bg-black">
                <iframe
                  src={cleanUrl}
                  title="Test Game"
                  className="w-full h-full border-none"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            </div>
          )}

          {/* Description & How to Play */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary of the game gameplay..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Instructions & Controls
            </label>
            <input
              type="text"
              placeholder="e.g. Use Arrow keys to jump over obstacles"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          {/* Thumbnail & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Thumbnail Image URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="arcade, 3d, fast, action"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Save Game to Vault</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
