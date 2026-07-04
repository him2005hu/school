import { useState } from 'react';
import { Menu, X, BookOpen, LogIn, Settings } from 'lucide-react';
import { SchoolSettings } from '../types';

interface NavbarProps {
  settings: SchoolSettings | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  onLogout: () => void;
}

export default function Navbar({ settings, activeTab, setActiveTab, isAdmin, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'academics', label: 'Academics' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'notices', label: 'Notices' },
    { id: 'events', label: 'Events & News' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  return (
    <nav id="app-navbar" className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleTabClick('home')}>
            {settings?.logo ? (
              <img
                src={settings.logo}
                alt="Logo"
                className="w-12 h-12 object-cover rounded-xl shadow-sm"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <BookOpen className="w-6 h-6" />
              </div>
            )}
            <div>
              <span className="font-sans text-xl font-bold tracking-tight text-slate-900 block">
                {settings?.schoolName || 'EduFuture Public School'}
              </span>
              <span className="text-[10px] uppercase tracking-widest font-mono text-indigo-600 block font-semibold">
                Nurturing Tomorrow's Leaders
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-3.5 py-2 rounded-lg font-sans text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="ml-4 pl-4 border-l border-slate-100 flex items-center gap-2">
              {isAdmin ? (
                <>
                  <button
                    onClick={() => handleTabClick('admin')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'admin'
                        ? 'bg-emerald-50 text-emerald-600 font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    Dashboard
                  </button>
                  <button
                    onClick={onLogout}
                    className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleTabClick('admin')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-100 shadow-lg`}
                >
                  <LogIn className="w-4 h-4" />
                  Admin Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center xl:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-all"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="xl:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`block w-full text-left px-4 py-3 rounded-xl font-sans text-base font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-100">
            {isAdmin ? (
              <div className="space-y-2">
                <button
                  onClick={() => handleTabClick('admin')}
                  className={`flex items-center justify-center gap-1.5 w-full px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    activeTab === 'admin'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={onLogout}
                  className="block w-full text-center px-4 py-3 text-base font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleTabClick('admin')}
                className="flex items-center justify-center gap-1.5 w-full px-4 py-3 rounded-xl text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md"
              >
                <LogIn className="w-4 h-4" />
                Admin Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
