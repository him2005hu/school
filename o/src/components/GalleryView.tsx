import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image, Video, Eye, X, ZoomIn } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryViewProps {
  gallery: GalleryItem[];
}

export default function GalleryView({ gallery }: GalleryViewProps) {
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = gallery.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
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
        <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-bold block">Visual Chronicles</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-sans text-slate-900 tracking-tight">Our Gallery</h1>
        <p className="text-sm text-slate-500">A dynamic view of school celebrations, laboratory events, and campus life.</p>
      </div>

      {/* Toggles */}
      <div className="flex justify-center gap-2 border-b border-slate-100 pb-6">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            filterType === 'all'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          All Items
        </button>
        <button
          onClick={() => setFilterType('image')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            filterType === 'image'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Image className="w-3.5 h-3.5" /> Photos Only
        </button>
        <button
          onClick={() => setFilterType('video')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            filterType === 'video'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Video className="w-3.5 h-3.5" /> Videos Only
        </button>
      </div>

      {/* Dynamic Grid */}
      <AnimatePresence mode="popLayout">
        {filteredItems.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredItems.map((item, idx) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group relative bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300"
              >
                {item.type === 'video' ? (
                  <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                    {/* Render standard embedding or responsive cover */}
                    <img 
                      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop" 
                      alt="Video thumbnail"
                      className="w-full h-full object-cover opacity-40 filter blur-sm"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
                      <div className="w-12 h-12 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
                        <Video className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300">Click to Play Video</span>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => setLightboxIndex(idx)}
                    className="relative aspect-video bg-slate-50 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.url}
                      alt={item.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white scale-90 group-hover:scale-100 transition-transform duration-300" />
                    </div>
                  </div>
                )}
                
                <div className="p-5 space-y-1">
                  <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-indigo-600 block">
                    {item.type === 'image' ? 'Photograph' : 'Video Recording'}
                  </span>
                  <p className="font-sans font-bold text-slate-900 text-sm line-clamp-1">{item.caption || 'Campus Highlight'}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            No gallery items match the active category filter.
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredItems[lightboxIndex]?.type === 'image' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-w-4xl w-full flex flex-col items-center gap-4">
              <motion.img
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                src={filteredItems[lightboxIndex].url}
                alt={filteredItems[lightboxIndex].caption}
                className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/10"
                referrerPolicy="no-referrer"
              />
              <p className="text-sm font-sans text-white text-center tracking-wide">
                {filteredItems[lightboxIndex].caption}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
