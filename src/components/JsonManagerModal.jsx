import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Upload,
  RefreshCw,
  FileCode,
  AlertCircle,
} from 'lucide-react';

export function JsonManagerModal({
  isOpen,
  onClose,
  games = [],
  onImportGames,
  onResetDefaults,
}) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('view');
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(games, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        setImportText(text);
      } catch (err) {
        setImportError('Failed to read uploaded file.');
      }
    };
    reader.readAsText(file);
  };

  const handleApplyImport = () => {
    setImportError(null);
    setImportSuccess(false);
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) {
        throw new Error('JSON root must be an array of game objects.');
      }
      if (parsed.length === 0) {
        throw new Error('JSON array is empty.');
      }

      // Validate objects
      const validated = parsed.map((item, index) => {
        if (!item.title || !item.iframeUrl) {
          throw new Error(
            `Game at index ${index} must have 'title' and 'iframeUrl'.`
          );
        }
        return {
          id: item.id || `game-${index}-${Date.now()}`,
          title: String(item.title),
          category: item.category || 'Arcade',
          description: item.description || '',
          instructions: item.instructions || 'Follow on-screen instructions.',
          iframeUrl: String(item.iframeUrl),
          iframeHtml: item.iframeHtml,
          thumbnail: item.thumbnail || '',
          tags: Array.isArray(item.tags) ? item.tags : ['unblocked'],
          rating: typeof item.rating === 'number' ? item.rating : 4.5,
          featured: Boolean(item.featured),
          plays: typeof item.plays === 'number' ? item.plays : 0,
          controls: item.controls || {},
        };
      });

      onImportGames(validated);
      setImportSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setImportError(err.message || 'Invalid JSON syntax.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#020617] border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white font-mono">
                JSON GAMES DATABASE
              </h2>
              <p className="text-xs text-slate-400">
                Inspect, export, download or import the <code>games.json</code> database
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-5 pt-2 gap-3">
          <button
            onClick={() => setActiveTab('view')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 font-mono transition-colors ${
              activeTab === 'view'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            VIEW & EXPORT JSON ({games.length} GAMES)
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 font-mono transition-colors ${
              activeTab === 'import'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            IMPORT CUSTOM JSON
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 flex-1 overflow-hidden flex flex-col">
          {activeTab === 'view' ? (
            <div className="flex-1 flex flex-col min-h-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  Schema: Array&lt;Game (with iframeUrl / iframeHtml)&gt;
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Raw JSON</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download games.json</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto rounded-2xl bg-slate-950 p-4 border border-slate-800">
                <pre className="text-xs text-emerald-400 font-mono leading-relaxed whitespace-pre">
                  {jsonString}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Paste JSON Array or Upload File
                </label>
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Upload .json File</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='[
  {
    "id": "custom-game",
    "title": "My Custom Game",
    "category": "Arcade",
    "iframeUrl": "https://example.com/game",
    "description": "...",
    "instructions": "...",
    "tags": ["custom"],
    "rating": 4.8,
    "plays": 100
  }
]'
                className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />

              {importError && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {importSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Games JSON successfully imported and updated!</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onResetDefaults}
                  className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold px-2 py-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset to Official Default Games</span>
                </button>

                <button
                  type="button"
                  onClick={handleApplyImport}
                  disabled={!importText.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-40 transition-all shadow-lg shadow-cyan-500/20"
                >
                  Apply & Load Games
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
