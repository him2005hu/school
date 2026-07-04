import { motion } from 'motion/react';
import { Award, BookOpen, Layers, Milestone, Sparkles } from 'lucide-react';
import { SchoolSettings } from '../types';

interface AboutViewProps {
  settings: SchoolSettings | null;
}

export default function AboutView({ settings }: AboutViewProps) {
  const achievements = [
    { year: "2025", title: "Best Science & Tech Initiative", desc: "Awarded by National Educational Council for our comprehensive STEM curriculum." },
    { year: "2024", title: "District Football Championship", desc: "EduFuture Athletics squad brought home the gold in the inter-school relay & football." },
    { year: "2023", title: "Excellent Board Scores Citation", desc: "100% of our Grade 10 and 12 students passed the central boards with 92% first-class marks." },
    { year: "2022", title: "Green Campus Certified", desc: "Recognized as a zero-plastic, solar-powered eco-friendly campus in the territory." }
  ];

  const infrastructure = [
    { title: "Futuristic STEM Lab", desc: "Armed with robotics modules, computing blocks, and modern 3D printing equipment to enable coding & design thinking.", img: "https://images.unsplash.com/photo-1562774053-401386dfdf3f?w=400&auto=format&fit=crop" },
    { title: "Central Reading Library", desc: "A sanctuary with over 10,000 reference books, classic literature, digital journal memberships, and cozy reading halls.", img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&auto=format&fit=crop" },
    { title: "Elite Sports Arena", desc: "A massive field, athletic tracks, lawn tennis courts, and basketball arenas supporting certified coaching and fitness.", img: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400&auto=format&fit=crop" },
    { title: "Smart Classrooms", desc: "Ergonomically designed lecture rooms equipped with dynamic high-contrast screens and collaborative tables.", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&auto=format&fit=crop" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16"
    >
      
      {/* Page Title */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-bold block">Legacy & Spirit</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-sans text-slate-900 tracking-tight">About EduFuture</h1>
        <p className="text-sm text-slate-500">Discover our rich legacy, inspiring values, and state-of-the-art campus setup.</p>
      </div>

      {/* 1. History Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-900 tracking-tight flex items-center gap-2">
            <Milestone className="w-6 h-6 text-indigo-600" /> Our Inspiring History
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            EduFuture was founded in 2014 by a group of visionary scholars and social entrepreneurs. Observing a widening gap between rote theoretical schooling and practical innovative thinking, they set out to formulate a model that empowers the hands, the head, and the heart.
          </p>
          <p className="text-slate-600 leading-relaxed text-sm">
            What started as an experimental academy with 150 students has blossomed into a legendary educational powerhouse serving over 1,200 scholars. Today, our alumni are spread across top colleges worldwide, carrying with them our signature spirit of lifelong curiosity.
          </p>
        </div>
        <div className="lg:col-span-6">
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop"
            alt="Graduates"
            className="rounded-3xl border border-slate-100 shadow-xl object-cover h-[350px] w-full"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* 2. Vision & Mission Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-indigo-900 text-indigo-100 shadow-lg space-y-4">
          <BookOpen className="w-8 h-8 text-indigo-300" />
          <h3 className="font-sans font-extrabold text-2xl text-white">Our Shared Vision</h3>
          <p className="text-sm leading-relaxed text-indigo-100/90">
            {settings?.vision || "To be a global beacon of educational excellence, empowering students to lead with integrity, innovate with courage, and serve with compassion."}
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900 text-slate-100 shadow-lg space-y-4">
          <Sparkles className="w-8 h-8 text-emerald-400" />
          <h3 className="font-sans font-extrabold text-2xl text-white">Our Devoted Mission</h3>
          <p className="text-sm leading-relaxed text-slate-300">
            {settings?.mission || "We are committed to providing a holistic, rigorous, and inclusive education that prepares diverse learners to excel in an interconnected world."}
          </p>
        </div>
      </section>

      {/* 3. Infrastructure Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-bold">Our Campus</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-900 tracking-tight">World-Class Infrastructure</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {infrastructure.map((inf, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col">
              <img
                src={inf.img}
                alt={inf.title}
                className="w-full h-40 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <h4 className="font-sans font-bold text-sm text-slate-900">{inf.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{inf.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Achievements Timeline */}
      <section className="bg-slate-50 p-8 sm:p-12 rounded-3xl space-y-8">
        <div className="text-center space-y-2">
          <Award className="w-8 h-8 text-amber-500 mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-900 tracking-tight">Our Achievements & Milestones</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {achievements.map((ach, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 flex gap-4 shadow-sm">
              <div className="flex-shrink-0 font-mono font-extrabold text-2xl text-indigo-600 bg-indigo-50 w-16 h-16 rounded-xl flex items-center justify-center">
                {ach.year}
              </div>
              <div className="space-y-1">
                <h4 className="font-sans font-bold text-sm text-slate-900">{ach.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{ach.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </motion.div>
  );
}
