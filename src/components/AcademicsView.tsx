import { motion } from 'motion/react';
import { BookOpen, Award, Sparkles, ShieldAlert, GraduationCap } from 'lucide-react';

export default function AcademicsView() {
  const classesList = [
    { grade: "Pre-Primary", age: "Ages 3 - 5", desc: "Nursery, Lower KG, Upper KG. Focused on play-based learning, sensory motor skills, and phonics development." },
    { grade: "Primary School", age: "Grades 1 - 5", desc: "Building mathematical reasoning, environmental consciousness, languages, and artistic expressions." },
    { grade: "Middle School", age: "Grades 6 - 8", desc: "Core focus on Sciences, Algebra, Social Sciences, STEM scripting, and physical training." },
    { grade: "Senior Secondary", age: "Grades 9 - 12", desc: "Specialized streams in Science (PCM/PCB), Commerce, and Humanities. Intense training for national examinations." }
  ];

  const curriculumHighlights = [
    { title: "Dynamic STEM Labs", desc: "Real robotics hardware, introductory Python programming, and smart lab kits integrated right into Grade 5 and upwards." },
    { title: "Experiential Pedagogy", desc: "We emphasize 'learning by doing' with regular museum visits, nature treks, science fairs, and debating tournaments." },
    { title: "Holistic Fine Arts", desc: "Symphony Orchestras, theatre troupes, canvas oil painting, and pottery workshops are central to the core timetable." }
  ];

  const subjectsGrid = [
    {
      level: "Pre-Primary & Primary",
      subjects: ["English Language", "Mathematics", "Environmental Science (EVS)", "Second Language (Hindi/Spanish)", "Physical Play", "Digital Drawing"]
    },
    {
      level: "Middle School",
      subjects: ["Physics, Chemistry, Biology", "Advanced Algebra & Geometry", "World History & Geography", "Computer Science", "Third Language", "Creative Arts"]
    },
    {
      level: "Senior Secondary (9 - 12)",
      subjects: ["Physics, Chemistry, Calculus", "Biomedical Science", "Accountancy & Economics", "Information Practices (Python/SQL)", "Political Science & Literature", "Physical Ed"]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16"
    >
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-bold block">Curriculum & Methods</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-sans text-slate-900 tracking-tight">Academics</h1>
        <p className="text-sm text-slate-500">Rigorous academic schedules designed to nurture intelligent, ethical citizens.</p>
      </div>

      {/* 1. Classes Section */}
      <section className="space-y-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-900 tracking-tight flex items-center gap-2">
          <GraduationCap className="w-7 h-7 text-indigo-600" /> Grade Levels & Classes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classesList.map((cls, i) => (
            <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-3 hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all">
              <div className="flex justify-between items-center">
                <h4 className="font-sans font-extrabold text-lg text-slate-900">{cls.grade}</h4>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{cls.age}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{cls.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Curriculum Highlights */}
      <section className="bg-indigo-950 p-8 sm:p-12 rounded-3xl text-white space-y-8">
        <div className="max-w-xl">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold block">Our Approach</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-white tracking-tight mt-1">Holistic Curriculum Highlights</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {curriculumHighlights.map((hl, i) => (
            <div key={i} className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-sans font-bold text-base text-white">{hl.title}</h4>
              <p className="text-xs text-indigo-200 leading-relaxed">{hl.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Subjects Framework */}
      <section className="space-y-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" /> Subject Framework
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {subjectsGrid.map((grid, i) => (
            <div key={i} className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all space-y-4">
              <h4 className="font-sans font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 block font-mono uppercase tracking-wider text-indigo-600">
                {grid.level}
              </h4>
              <ul className="space-y-2">
                {grid.subjects.map((sub, idx) => (
                  <li key={idx} className="text-xs text-slate-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                    {sub}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Examination Information */}
      <section className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-4 flex justify-center">
          <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center shadow-inner">
            <Award className="w-10 h-10" />
          </div>
        </div>
        <div className="lg:col-span-8 space-y-4">
          <h3 className="font-sans font-extrabold text-slate-900 text-lg">Examination & Assessment Pattern</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            EduFuture follows a continuous comprehensive evaluation format. The school year is split into two terms:
          </p>
          <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
            <li><strong>Term 1 (April to September):</strong> Periodic assessments (20%) + Half-yearly term examination (80%).</li>
            <li><strong>Term 2 (October to March):</strong> Periodic assessments (20%) + Annual final board examination (80%).</li>
            <li><strong>Practical labs & Project files:</strong> 20% weightage in STEM subjects.</li>
          </ul>
        </div>
      </section>

    </motion.div>
  );
}
