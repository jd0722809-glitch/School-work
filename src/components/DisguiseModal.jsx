import React, { useState } from 'react';
import { X, Shield, Check, ExternalLink, AlertTriangle } from 'lucide-react';

const PRESETS = [
  {
    name: 'Google Classroom',
    title: 'Classes',
    favicon: 'https://ssl.gstatic.com/classroom/favicon.png',
    iconBg: 'bg-emerald-600',
  },
  {
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    favicon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png',
    iconBg: 'bg-amber-600',
  },
  {
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
    iconBg: 'bg-blue-600',
  },
  {
    name: 'Wikipedia',
    title: 'Wikipedia, the free encyclopedia',
    favicon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
    iconBg: 'bg-slate-700',
  },
  {
    name: 'Canvas LMS',
    title: 'Dashboard | Canvas',
    favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico',
    iconBg: 'bg-red-600',
  },
  {
    name: 'Default (Unblocked Vault)',
    title: 'Unblocked Games Vault',
    favicon: '/favicon.ico',
    iconBg: 'bg-cyan-600',
  },
];

export function DisguiseModal({ isOpen, onClose }) {
  const [activePreset, setActivePreset] = useState('Default (Unblocked Vault)');
  const [panicUrl, setPanicUrl] = useState('https://google.com');

  if (!isOpen) return null;

  const applyCloak = (preset) => {
    document.title = preset.title;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = preset.favicon;
    setActivePreset(preset.name);
  };

  const triggerPanic = () => {
    window.location.href = panicUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#020617] border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white font-mono">
                TAB CLOAK & PANIC BUTTON
              </h2>
              <p className="text-xs text-slate-400">
                Disguise the browser tab icon and title seamlessly
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

        {/* Presets List Bento */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2.5">
              Select Tab Disguise Preset:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESETS.map((p) => {
                const isSelected = activePreset === p.name;
                return (
                  <button
                    key={p.name}
                    onClick={() => applyCloak(p)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500 text-white font-semibold shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl ${p.iconBg} flex items-center justify-center text-white text-[11px] font-bold shrink-0 overflow-hidden shadow-inner`}
                    >
                      {p.favicon && p.favicon !== '/favicon.ico' ? (
                        <img
                          src={p.favicon}
                          alt=""
                          className="w-4 h-4 object-contain"
                        />
                      ) : (
                        'G'
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {p.title}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Panic Redirect Bento */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-amber-400 text-xs font-bold font-mono">
              <AlertTriangle className="w-4 h-4" />
              <span>EMERGENCY PANIC REDIRECT</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Instantly leave this page and redirect your browser to a safe website:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={panicUrl}
                onChange={(e) => setPanicUrl(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <button
                onClick={triggerPanic}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all shrink-0 flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Panic Now</span>
              </button>
            </div>
          </div>

          {/* Close button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
