import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Calendar, Bell, Users, Award, BookOpen, Clock, 
  MapPin, Phone, Mail, ChevronLeft, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { SchoolSettings, SchoolEvent, Notice, GalleryItem, NewsItem } from '../types';

interface HomeViewProps {
  settings: SchoolSettings | null;
  events: SchoolEvent[];
  notices: Notice[];
  gallery: GalleryItem[];
  news: NewsItem[];
  setActiveTab: (tab: string) => void;
}

export default function HomeView({ settings, events, notices, gallery, news, setActiveTab }: HomeViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Default slider banners if none is specified
  const slides = gallery.filter(item => item.type === 'image').slice(0, 4);
  const fallbackSlides = [
    {
      url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1600&auto=format&fit=crop",
      caption: "EduFuture Campus - Shaping Future Leaders"
    },
    {
      url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&auto=format&fit=crop",
      caption: "Interactive Learning & Modern Technology"
    },
    {
      url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600&auto=format&fit=crop",
      caption: "Rich Resource Library with 10k+ Books"
    }
  ];

  const activeSlides = slides.length > 0 ? slides : fallbackSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const publishedNotices = notices.filter(n => n.published).slice(0, 3);
  const upcomingEvents = events.slice(0, 3);
  const latestNews = news.slice(0, 2);

  return (
    <div id="home-view" className="space-y-16 pb-16">
      
      {/* 1. Hero Image Slider */}
      <section className="relative h-[450px] sm:h-[600px] w-full overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-transparent z-10" />
            <img
              src={activeSlides[currentSlide]?.url}
              alt="School Banner"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>

        {/* Hero Slider Navigation */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Hero Content */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-2xl text-white space-y-6"
            >
              {settings?.admissionOpen && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/90 text-white backdrop-blur-sm shadow-md animate-pulse">
                  <CheckCircle2 className="w-4 h-4" /> Admission Open 2026-27
                </span>
              )}
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-sans text-white leading-tight">
                Empowering the Leaders of <span className="text-indigo-400">Tomorrow</span>
              </h1>
              <p className="text-base sm:text-xl text-slate-200 font-sans font-light">
                {settings?.metaDescription || "Welcome to EduFuture Public School, where rigorous academics meet creative expression and empathetic character building."}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('admissions')}
                  className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
                >
                  Apply Online Now
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-sm border border-white/20 transition-all"
                >
                  Explore Campus
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentSlide === idx ? 'bg-indigo-500 w-8' : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. Quick Action Action Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => setActiveTab('notices')}
            className="group cursor-pointer bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:shadow-indigo-50 hover:border-indigo-100 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-bold text-lg text-slate-900 mb-2">Latest Notices</h3>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              Stay updated with the latest administrative guidelines, circulars, and announcements.
            </p>
            <span className="text-sm font-semibold text-indigo-600 group-hover:text-indigo-700 inline-flex items-center gap-1">
              View Notice Board <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          <div 
            onClick={() => setActiveTab('faculty')}
            className="group cursor-pointer bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:shadow-indigo-50 hover:border-indigo-100 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-bold text-lg text-slate-900 mb-2">Meet Our Faculty</h3>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              Get to know our highly qualified scholars and professional mentors leading the curriculum.
            </p>
            <span className="text-sm font-semibold text-indigo-600 group-hover:text-indigo-700 inline-flex items-center gap-1">
              View Teachers <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          <div 
            onClick={() => setActiveTab('admissions')}
            className="group cursor-pointer bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:shadow-indigo-50 hover:border-indigo-100 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-bold text-lg text-slate-900 mb-2">Academic Programs</h3>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              Explore classes, curriculum frameworks, fee breakdown, and our simple online application process.
            </p>
            <span className="text-sm font-semibold text-indigo-600 group-hover:text-indigo-700 inline-flex items-center gap-1">
              Academics & Fee <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </section>

      {/* 3. Welcome & About School Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute -bottom-4 right-4 w-32 h-32 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <img
              src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop"
              alt="EduFuture Learning Campus"
              className="relative rounded-3xl shadow-xl border border-slate-100 w-full object-cover h-[400px]"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-bold block">
              About Our School
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-slate-900 tracking-tight">
              Shaping Holistic Development & Intellectual Curiosity
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Welcome to <strong>{settings?.schoolName || 'EduFuture Public School'}</strong>, an institution where tradition marries innovation. Established with a core conviction that learning must be life-giving and empowering, we foster a community of scholars, artists, scientists, and athletes.
            </p>
            <p className="text-base text-slate-600 leading-relaxed">
              Our campus boasts state-of-the-art physics, chemistry, biology, and modern computing labs, a sports arena, and a multi-level library. We nurture high scores alongside critical reasoning, emotional resilience, and civic virtues.
            </p>
            <div className="flex gap-4 pt-2">
              <button
                onClick={() => setActiveTab('about')}
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-md transition-all"
              >
                Learn More About Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Principal's Message & Vision-Mission */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            
            {/* Principal card */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-md flex flex-col justify-between">
              <div className="space-y-6">
                <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-bold block">
                  Principal's Address
                </span>
                <p className="text-slate-600 italic font-sans text-base leading-relaxed">
                  "{settings?.principalMessage || 'At EduFuture, we strive to nurture inquisitive minds and foster a love for learning. Our dedicated staff ensures a supportive environment where every student can achieve their full potential.'}"
                </p>
              </div>
              <div className="flex items-center gap-4 pt-6 border-t border-slate-100 mt-6">
                <img
                  src={settings?.principalPhoto || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop"}
                  alt="Principal"
                  className="w-14 h-14 object-cover rounded-full border-2 border-indigo-100"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-sans font-bold text-slate-900 text-base">Dr. Anjali Sharma</h4>
                  <p className="text-xs text-slate-500 font-mono">Principal, Ph.D. in Education Admin</p>
                </div>
              </div>
            </div>

            {/* Vision & Mission Card */}
            <div className="space-y-6 flex flex-col justify-between">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-md">
                <h3 className="font-sans font-extrabold text-slate-900 text-lg mb-2 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" /> Our Vision
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {settings?.vision || "To be a global beacon of educational excellence, empowering students to lead with integrity, innovate with courage, and serve with compassion."}
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-md">
                <h3 className="font-sans font-extrabold text-slate-900 text-lg mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" /> Our Mission
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {settings?.mission || "We are committed to providing a holistic, rigorous, and inclusive education that prepares diverse learners to excel in an interconnected world."}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. School Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full" />
          <div className="absolute left-1/4 top-1/4 w-24 h-24 bg-indigo-800/60 rounded-full filter blur-xl" />
          
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-5xl font-extrabold font-sans text-white mb-2">12+</div>
              <div className="text-xs sm:text-sm text-indigo-200 font-mono uppercase tracking-wider">Years of Glory</div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-extrabold font-sans text-white mb-2">
                {settings?.totalStudentsManual || 1250}+
              </div>
              <div className="text-xs sm:text-sm text-indigo-200 font-mono uppercase tracking-wider">Happy Students</div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-extrabold font-sans text-white mb-2">45+</div>
              <div className="text-xs sm:text-sm text-indigo-200 font-mono uppercase tracking-wider">Certified Faculty</div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-extrabold font-sans text-white mb-2">100%</div>
              <div className="text-xs sm:text-sm text-indigo-200 font-mono uppercase tracking-wider">Board Results</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Notices, News & Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Notice Board Preview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex justify-between items-end border-b border-slate-100 pb-4">
            <h3 className="font-sans font-extrabold text-xl text-slate-900">Latest Notices</h3>
            <button 
              onClick={() => setActiveTab('notices')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              See All
            </button>
          </div>
          <div className="space-y-4">
            {publishedNotices.length > 0 ? (
              publishedNotices.map((n) => (
                <div key={n.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-indigo-50/20 transition-all">
                  <div className="flex gap-2 items-center text-xs text-slate-400 font-mono mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    {n.date}
                    {n.isHoliday && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">Holiday</span>
                    )}
                  </div>
                  <h4 className="font-sans font-bold text-sm text-slate-900 mb-1">{n.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{n.content}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No active notices published.</p>
            )}
          </div>
        </div>

        {/* School Events Preview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex justify-between items-end border-b border-slate-100 pb-4">
            <h3 className="font-sans font-extrabold text-xl text-slate-900">Upcoming Events</h3>
            <button 
              onClick={() => setActiveTab('events')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              See All
            </button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((e) => (
                <div key={e.id} className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex flex-col items-center justify-center font-bold text-sm leading-none">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-slate-900 mb-0.5">{e.title}</h4>
                    <p className="text-xs font-mono text-indigo-600 mb-1">{e.date}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{e.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No upcoming events listed.</p>
            )}
          </div>
        </div>

        {/* Latest News Preview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex justify-between items-end border-b border-slate-100 pb-4">
            <h3 className="font-sans font-extrabold text-xl text-slate-900">Latest News</h3>
            <button 
              onClick={() => setActiveTab('events')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              See All
            </button>
          </div>
          <div className="space-y-4">
            {latestNews.length > 0 ? (
              latestNews.map((n) => (
                <div key={n.id} className="p-5 rounded-2xl border border-slate-100 space-y-2 hover:shadow-md transition-all">
                  <span className="text-[10px] font-bold tracking-widest text-indigo-600 font-mono block uppercase">News Announcement</span>
                  <h4 className="font-sans font-extrabold text-sm text-slate-900">{n.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{n.content}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{n.date}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No recent news available.</p>
            )}
          </div>
        </div>

      </section>

      {/* 7. Gallery Preview Section */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-bold block mb-1">Visual Memories</span>
              <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">Our Gallery Preview</h3>
            </div>
            <button 
              onClick={() => setActiveTab('gallery')}
              className="px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-white rounded-xl border border-slate-200 transition-all shadow-sm"
            >
              View Full Gallery
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeSlides.slice(0, 4).map((g, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden aspect-video border border-slate-200 shadow-sm">
                <img
                  src={g.url}
                  alt={g.caption || "Gallery Preview"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                  <p className="text-xs text-white font-sans">{g.caption || "Campus Life"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-bold block mb-2">Endorsements</span>
          <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">What Our Parents & Alumni Say</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md space-y-4">
            <p className="text-sm text-slate-600 italic leading-relaxed">
              "The academic rigor and science laboratories at EduFuture are top notch. My son was able to clear the IIT JEE exam with high honors because of his foundation here."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-indigo-600">RP</div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">Raman Patel</h5>
                <p className="text-[10px] text-slate-400 font-mono">Parent of Grade 12 Scholar</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md space-y-4">
            <p className="text-sm text-slate-600 italic leading-relaxed">
              "EduFuture gave me the courage to excel in public speech. Teachers are incredibly kind, dedicating extra hours for guidance whenever necessary."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-indigo-600">SM</div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">Sarah Miller</h5>
                <p className="text-[10px] text-slate-400 font-mono">Alumna, Stanford Class of '25</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md space-y-4">
            <p className="text-sm text-slate-600 italic leading-relaxed">
              "Outstanding focus on multi-disciplinary growth. Our children love school. The visual arts, athletics program, and chess clubs are excellent additions."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-indigo-600">DK</div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">Deepak Kumar</h5>
                <p className="text-[10px] text-slate-400 font-mono">Parent of Grade 5 Scholar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Contact Preview with Map */}
      <section className="bg-slate-950 py-16 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold block">Get In Touch</span>
            <h3 className="font-sans font-extrabold text-3xl text-white tracking-tight">Connect with Our Admissions Desk</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Whether you are looking to enroll your child, want to schedule a physical campus tour, or require custom information, feel free to write or call our support lines.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span className="text-sm">{settings?.address || "123 Education Boulevard, Knowledge City, State - 452001"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span className="text-sm">{settings?.phone || "+1 (555) 019-2834"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span className="text-sm">{settings?.email || "info@edufuture.edu.gcp"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden h-[300px] border border-slate-800 shadow-lg relative bg-slate-900 flex items-center justify-center text-center p-8">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 space-y-3">
              <MapPin className="w-10 h-10 text-rose-500 mx-auto" />
              <h4 className="font-sans font-bold text-white text-base">Campus Map Location</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {settings?.address || "123 Education Boulevard, Knowledge City"}
              </p>
              <button 
                onClick={() => setActiveTab('contact')}
                className="px-4 py-2 text-xs font-semibold text-indigo-400 hover:text-white border border-indigo-500/30 hover:border-indigo-400 hover:bg-indigo-950/40 rounded-xl transition-all"
              >
                Send Message / View Directions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 pt-8 text-center text-xs text-slate-400 font-sans max-w-7xl mx-auto px-4">
        <p>{settings?.footerText || "© 2026 EduFuture Public School. All Rights Reserved."}</p>
      </footer>

    </div>
  );
}
