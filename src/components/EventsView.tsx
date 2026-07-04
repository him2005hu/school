import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Search, Award, Compass, Newspaper, Sparkles } from 'lucide-react';
import { SchoolEvent, NewsItem } from '../types';

interface EventsViewProps {
  events: SchoolEvent[];
  news: NewsItem[];
}

export default function EventsView({ events, news }: EventsViewProps) {
  const [activeTab, setActiveTab] = useState<'events' | 'news'>('events');

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12"
    >
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-bold block">Campus Buzz</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-sans text-slate-900 tracking-tight">Events & News</h1>
        <p className="text-sm text-slate-500">Stay abreast of school accomplishments, scheduled activities, and cultural festivals.</p>
      </div>

      {/* Segmented Control */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 shadow-inner border border-slate-200">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'events'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" /> Upcoming Events
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'news'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Newspaper className="w-4 h-4" /> School News
          </button>
        </div>
      </div>

      {/* Contents */}
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'events' ? (
            <motion.div
              key="events-list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {events.length > 0 ? (
                events.map((e) => (
                  <div key={e.id} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all flex gap-6">
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex flex-col items-center justify-center">
                      <Calendar className="w-6 h-6 mb-1" />
                      <span className="text-[8px] font-bold font-mono uppercase">Event</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">{e.category || 'School celebration'}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{e.date}</span>
                      </div>
                      <h3 className="font-sans font-extrabold text-slate-900 text-base">{e.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{e.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-slate-400">
                  No upcoming school events listed.
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="news-list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {news.length > 0 ? (
                news.map((n) => (
                  <div key={n.id} className="p-8 rounded-3xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-md transition-all space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-mono tracking-widest font-extrabold text-indigo-600 uppercase block">Media Release</span>
                      <h3 className="font-sans font-extrabold text-slate-900 text-lg">{n.title}</h3>
                      <p className="text-[10px] text-slate-400 font-mono">{n.date}</p>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-slate-400">
                  No school news announcements published.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}
