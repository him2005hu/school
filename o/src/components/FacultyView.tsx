import { motion } from 'motion/react';
import { Award, BookOpen, GraduationCap } from 'lucide-react';
import { Teacher } from '../types';

interface FacultyViewProps {
  teachers: Teacher[];
}

export default function FacultyView({ teachers }: FacultyViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12"
    >
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-bold block">Academic Mentors</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-sans text-slate-900 tracking-tight">Our Faculty</h1>
        <p className="text-sm text-slate-500">Meet our team of licensed educators, scholarly researchers, and empathetic coaches.</p>
      </div>

      {/* Grid */}
      {teachers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teachers.map((teacher, i) => (
            <div
              key={teacher.id || i}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-indigo-100 transition-all duration-300"
            >
              <div>
                <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
                  <img
                    src={teacher.photo || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop"}
                    alt={teacher.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 left-3 bg-indigo-600 text-white font-semibold text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    {teacher.subject}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="space-y-0.5">
                    <h3 className="font-sans font-extrabold text-slate-900 text-base">{teacher.name}</h3>
                    <p className="text-xs text-indigo-600 font-medium flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5" /> {teacher.qualification}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-slate-50 bg-slate-50/50 flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span className="font-bold">EXPERIENCE:</span>
                <span className="px-2.5 py-0.5 rounded bg-white border border-slate-100 text-slate-700 font-semibold shadow-sm">{teacher.experience}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400">
          No faculty members found in the school database.
        </div>
      )}

    </motion.div>
  );
}
