import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Calendar, Clock, Filter, Search, ShieldAlert } from 'lucide-react';
import { Notice } from '../types';

interface NoticeBoardViewProps {
  notices: Notice[];
}

export default function NoticeBoardView({ notices }: NoticeBoardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'notice' | 'holiday'>('all');

  const filteredNotices = notices
    .filter(n => n.published)
    .filter(n => {
      // Search
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            n.content.toLowerCase().includes(searchQuery.toLowerCase());
      // Type Filter
      if (filterType === 'holiday') return matchesSearch && n.isHoliday;
      if (filterType === 'notice') return matchesSearch && !n.isHoliday;
      return matchesSearch;
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12"
    >
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-bold block">Official Communications</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-sans text-slate-900 tracking-tight">Notice Board</h1>
        <p className="text-sm text-slate-500">Live feed of guidelines, announcements, schedules, and holiday notifications.</p>
      </div>

      {/* Filters & Search bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 max-w-4xl mx-auto">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all w-full md:w-auto ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Board
          </button>
          <button
            onClick={() => setFilterType('notice')}
            className={`flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all w-full md:w-auto ${
              filterType === 'notice'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" /> Circulars
          </button>
          <button
            onClick={() => setFilterType('holiday')}
            className={`flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all w-full md:w-auto ${
              filterType === 'holiday'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Holidays
          </button>
        </div>
      </div>

      {/* Dynamic List */}
      <div className="max-w-4xl mx-auto space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((n, idx) => (
              <motion.div
                layout
                key={n.id || idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`p-6 rounded-3xl border shadow-sm transition-all flex flex-col md:flex-row gap-6 ${
                  n.isHoliday 
                    ? 'bg-amber-50/40 border-amber-100/80 hover:bg-amber-50/70' 
                    : 'bg-white border-slate-100 hover:border-indigo-100 hover:shadow-md'
                }`}
              >
                {/* Date stamp icon */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold font-sans ${
                  n.isHoliday ? 'bg-amber-100 text-amber-800' : 'bg-indigo-50 text-indigo-700'
                }`}>
                  <Clock className="w-5 h-5 mb-1" />
                  <span className="text-[9px] font-mono font-bold tracking-wider">ANN</span>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">{n.date}</span>
                    {n.isHoliday ? (
                      <span className="px-2.5 py-0.5 rounded text-[9px] font-mono bg-amber-100 text-amber-800 font-extrabold uppercase">Official Holiday</span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded text-[9px] font-mono bg-indigo-50 text-indigo-700 font-extrabold uppercase">Circular Notice</span>
                    )}
                  </div>
                  <h3 className="font-sans font-extrabold text-slate-900 text-base">{n.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
              No notices or holidays found matching your query.
            </div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}
