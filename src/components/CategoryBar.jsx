import React from 'react';
import {
  Layers,
  Flame,
  Puzzle,
  Sword,
  History,
  Brain,
  Trophy,
  ArrowUpDown,
} from 'lucide-react';

const CATEGORY_ITEMS = [
  { label: 'All', icon: Layers },
  { label: 'Arcade', icon: Flame },
  { label: 'Puzzle', icon: Puzzle },
  { label: 'Action', icon: Sword },
  { label: 'Classic', icon: History },
  { label: 'Strategy', icon: Brain },
  { label: 'Sports', icon: Trophy },
];

export function CategoryBar({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  sortOption,
  onSortChange,
}) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
      {/* Category Pills Bento Flow */}
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
        {CATEGORY_ITEMS.map(({ label, icon: Icon }) => {
          const isSelected = selectedCategory === label;
          const count = categoryCounts[label] || 0;

          return (
            <button
              key={label}
              id={`category-btn-${label.toLowerCase()}`}
              onClick={() => onSelectCategory(label)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-cyan-400'}`} />
              <span>{label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                  isSelected ? 'bg-slate-950/25 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sort Select Box */}
      <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
        <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
          <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
          Sort by:
        </span>
        <select
          id="sort-select"
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
        >
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Featured First</option>
          <option value="alphabetical">Alphabetical (A-Z)</option>
        </select>
      </div>
    </div>
  );
}
