import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, Users, Bell, Calendar, Image as ImageIcon, MessageSquare, 
  BookOpen, Plus, Trash2, Edit2, Check, X, Shield, LogIn, ArrowRight,
  Eye, FileText, Globe, RefreshCw, BarChart2, CheckCircle2, ChevronRight
} from 'lucide-react';
import { 
  SchoolSettings, Teacher, Notice, SchoolEvent, NewsItem, 
  GalleryItem, AdmissionForm, ContactMessage 
} from '../types';

interface AdminPortalProps {
  settings: SchoolSettings | null;
  teachers: Teacher[];
  notices: Notice[];
  events: SchoolEvent[];
  news: NewsItem[];
  gallery: GalleryItem[];
  admissions: AdmissionForm[];
  messages: ContactMessage[];
  token: string | null;
  onLogin: (token: string) => void;
  onLogout: () => void;
  refreshData: () => Promise<void>;
}

export default function AdminPortal({
  settings, teachers, notices, events, news, gallery, admissions, messages,
  token, onLogin, onLogout, refreshData
}: AdminPortalProps) {
  // Login credentials states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Active admin module tab
  const [activeModule, setActiveModule] = useState<'overview' | 'gallery' | 'notices' | 'events' | 'news' | 'teachers' | 'admissions' | 'messages' | 'settings'>('overview');

  // Stats overview state
  const [stats, setStats] = useState({
    totalGallery: 0,
    totalTeachers: 0,
    totalNotices: 0,
    totalEvents: 0,
    totalStudents: 0,
    visitors: 0
  });

  // Action states (create/edit triggers)
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Form states for modules
  // 1. Notice Form
  const [noticeForm, setNoticeForm] = useState({
    title: '', content: '', date: '', published: true, isHoliday: false
  });
  // 2. Event Form
  const [eventForm, setEventForm] = useState({
    title: '', description: '', date: '', category: 'General'
  });
  // 3. News Form
  const [newsForm, setNewsForm] = useState({
    title: '', content: '', date: ''
  });
  // 4. Teacher Form
  const [teacherForm, setTeacherForm] = useState({
    name: '', qualification: '', subject: '', experience: '', photo: ''
  });
  // 5. Gallery Form
  const [galleryForm, setGalleryForm] = useState({
    url: '', caption: '', type: 'image' as 'image' | 'video'
  });
  // 6. Settings & SEO Form
  const [settingsForm, setSettingsForm] = useState<any>(null);

  // Load stats
  useEffect(() => {
    if (token) {
      fetchStats();
      if (settings) {
        setSettingsForm({ ...settings });
      }
    }
  }, [token, settings, gallery.length, teachers.length, notices.length, events.length]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed.');
      }

      const data = await response.json();
      onLogin(data.token);
      setUsername('');
      setPassword('');
    } catch (err: any) {
      setLoginError(err.message || 'Incorrect username or password.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Helper to read and compress local image file to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Auto-Resize / Compress image using Canvas
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // compress quality
        callback(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Generic API request triggers
  const executeAction = async (url: string, method: 'POST' | 'PUT' | 'DELETE', body?: any) => {
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: body ? JSON.stringify(body) : undefined
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server rejected action.');
      }

      setActionSuccess('Action executed successfully.');
      await refreshData();
      setIsCreating(false);
      setEditingItem(null);
    } catch (err: any) {
      setActionError(err.message || 'Action failed.');
    } finally {
      setActionLoading(false);
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh]">
      {!token ? (
        // ---------------- ADMIN LOGIN FORM ----------------
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-100 shadow-2xl p-8 space-y-6 mt-12 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-600 to-violet-600" />
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="font-sans font-extrabold text-2xl text-slate-900 tracking-tight">Admin Portal</h2>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">Authorized Personnel Only</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-50 text-rose-600 text-xs rounded-xl border border-rose-100 font-medium text-center">
                {loginError}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="E.g. Anmol12558"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-semibold text-xs shadow-lg shadow-indigo-500/15 transition-all cursor-pointer"
            >
              {loginLoading ? 'Authenticating...' : (
                <>
                  <LogIn className="w-4 h-4" /> Log In Securely
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 text-[10px] text-slate-400 font-mono space-y-1 border-t border-slate-50">
            <p>Demo Login Details:</p>
            <p>User: <strong className="text-indigo-600">Anmol12558</strong> | Pass: <strong className="text-indigo-600">Anmol@123</strong></p>
          </div>
        </div>
      ) : (
        // ---------------- ADMIN DASHBOARD VIEW ----------------
        <div id="admin-dashboard-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Dashboard Sidebar Tabs */}
          <div className="lg:col-span-3 bg-white p-4 rounded-3xl border border-slate-100 shadow-lg space-y-1">
            <div className="p-4 border-b border-slate-50 mb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-600 font-bold block">Portal Active</span>
                <span className="font-sans font-extrabold text-sm text-slate-900 block">Dashboard Manager</span>
              </div>
              <button 
                onClick={onLogout}
                className="px-2.5 py-1 text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all"
              >
                Logout
              </button>
            </div>

            <button
              onClick={() => { setActiveModule('overview'); setIsCreating(false); setEditingItem(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all ${
                activeModule === 'overview' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BarChart2 className="w-4 h-4" /> Overview Dashboard
            </button>

            <button
              onClick={() => { setActiveModule('settings'); setIsCreating(false); setEditingItem(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all ${
                activeModule === 'settings' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Settings className="w-4 h-4" /> Settings & SEO
            </button>

            <button
              onClick={() => { setActiveModule('gallery'); setIsCreating(false); setEditingItem(null); setGalleryForm({ url: '', caption: '', type: 'image' }); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all ${
                activeModule === 'gallery' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Gallery & Sliders
            </button>

            <button
              onClick={() => { setActiveModule('notices'); setIsCreating(false); setEditingItem(null); setNoticeForm({ title: '', content: '', date: new Date().toISOString().split('T')[0], published: true, isHoliday: false }); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all ${
                activeModule === 'notices' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Bell className="w-4 h-4" /> Notice Board
            </button>

            <button
              onClick={() => { setActiveModule('events'); setIsCreating(false); setEditingItem(null); setEventForm({ title: '', description: '', date: new Date().toISOString().split('T')[0], category: 'General' }); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all ${
                activeModule === 'events' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4" /> Events Manager
            </button>

            <button
              onClick={() => { setActiveModule('news'); setIsCreating(false); setEditingItem(null); setNewsForm({ title: '', content: '', date: new Date().toISOString().split('T')[0] }); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all ${
                activeModule === 'news' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Globe className="w-4 h-4" /> News announcements
            </button>

            <button
              onClick={() => { setActiveModule('teachers'); setIsCreating(false); setEditingItem(null); setTeacherForm({ name: '', qualification: '', subject: 'Mathematics', experience: '', photo: '' }); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all ${
                activeModule === 'teachers' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" /> Teachers Directory
            </button>

            <button
              onClick={() => { setActiveModule('admissions'); setIsCreating(false); setEditingItem(null); }}
              className={`w-full flex items-center justify-between px-4 py-3 text-xs font-semibold rounded-xl transition-all ${
                activeModule === 'admissions' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-3"><FileText className="w-4 h-4" /> Admission Forms</span>
              {admissions.filter(a => a.status === 'Pending').length > 0 && (
                <span className="bg-amber-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold">
                  {admissions.filter(a => a.status === 'Pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveModule('messages'); setIsCreating(false); setEditingItem(null); }}
              className={`w-full flex items-center justify-between px-4 py-3 text-xs font-semibold rounded-xl transition-all ${
                activeModule === 'messages' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-3"><MessageSquare className="w-4 h-4" /> Contact Messages</span>
              {messages.filter(m => !m.read).length > 0 && (
                <span className="bg-indigo-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold">
                  {messages.filter(m => !m.read).length}
                </span>
              )}
            </button>
          </div>

          {/* Dashboard Module Display */}
          <div className="lg:col-span-9 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-lg min-h-[500px]">
            {actionError && (
              <div className="p-3 bg-rose-50 text-rose-600 text-xs rounded-xl border border-rose-100 font-medium mb-4 text-center">
                {actionError}
              </div>
            )}
            {actionSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-600 text-xs rounded-xl border border-emerald-100 font-medium mb-4 text-center flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> {actionSuccess}
              </div>
            )}

            {/* 1. OVERVIEW SCREEN */}
            {activeModule === 'overview' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold font-sans text-slate-900">Dashboard Overview</h2>
                    <p className="text-xs text-slate-400">Aggregated counters and telemetry metrics of the active database.</p>
                  </div>
                  <button 
                    onClick={refreshData}
                    className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-500 transition-all flex items-center gap-1 text-xs font-bold"
                  >
                    <RefreshCw className="w-4 h-4" /> Refresh
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase">Total Banners / Photos</span>
                    <span className="text-2xl font-extrabold text-slate-950 font-sans block mt-1">{stats.totalGallery}</span>
                  </div>
                  <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase">Teachers Listed</span>
                    <span className="text-2xl font-extrabold text-slate-950 font-sans block mt-1">{stats.totalTeachers}</span>
                  </div>
                  <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase">Notices Active</span>
                    <span className="text-2xl font-extrabold text-slate-950 font-sans block mt-1">{stats.totalNotices}</span>
                  </div>
                  <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase">Events Managed</span>
                    <span className="text-2xl font-extrabold text-slate-950 font-sans block mt-1">{stats.totalEvents}</span>
                  </div>
                  <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                    <span className="text-[10px] font-mono text-indigo-600 block font-bold uppercase">Total Students Manual</span>
                    <span className="text-2xl font-extrabold text-indigo-950 font-sans block mt-1">{stats.totalStudents}</span>
                  </div>
                  <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                    <span className="text-[10px] font-mono text-emerald-600 block font-bold uppercase">Website Visitors</span>
                    <span className="text-2xl font-extrabold text-emerald-950 font-sans block mt-1">{stats.visitors}</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/40 space-y-3">
                  <h3 className="font-sans font-bold text-sm text-slate-900">Database Auto Seeding Active</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    If you delete notices or other collections entirely, our Firestore engine will automatically re-seed representative default school data at startup to ensure seamless visual layout displays.
                  </p>
                </div>
              </div>
            )}

            {/* 2. SETTINGS & SEO SCREEN */}
            {activeModule === 'settings' && settingsForm && (
              <form 
                onSubmit={(e) => { e.preventDefault(); executeAction('/api/settings', 'PUT', settingsForm); }}
                className="space-y-6"
              >
                <div className="border-b border-slate-50 pb-4">
                  <h2 className="text-xl font-extrabold font-sans text-slate-900">Website Settings & SEO Settings</h2>
                  <p className="text-xs text-slate-400">Modify branding parameters, social metadata, and Principal details dynamically.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">School Name</label>
                    <input
                      type="text"
                      value={settingsForm.schoolName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, schoolName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Logo URL or Base64</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={settingsForm.logo}
                        onChange={(e) => setSettingsForm({ ...settingsForm, logo: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        id="logo-upload"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, (base64) => setSettingsForm({ ...settingsForm, logo: base64 }))}
                      />
                      <label htmlFor="logo-upload" className="px-3.5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer flex-shrink-0">
                        Upload
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Contact Phone</label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Contact Email</label>
                    <input
                      type="text"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Total Students (Manual)</label>
                    <input
                      type="number"
                      value={settingsForm.totalStudentsManual}
                      onChange={(e) => setSettingsForm({ ...settingsForm, totalStudentsManual: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Physical Campus Address</label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Principal Message</label>
                  <textarea
                    rows={3}
                    value={settingsForm.principalMessage}
                    onChange={(e) => setSettingsForm({ ...settingsForm, principalMessage: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Vision Statement</label>
                    <textarea
                      rows={2}
                      value={settingsForm.vision}
                      onChange={(e) => setSettingsForm({ ...settingsForm, vision: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Mission Statement</label>
                    <textarea
                      rows={2}
                      value={settingsForm.mission}
                      onChange={(e) => setSettingsForm({ ...settingsForm, mission: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-800">Online Admission Open</span>
                    <p className="text-[10px] text-slate-400">Controls whether the admissions banner and online apply triggers are active.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.admissionOpen}
                    onChange={(e) => setSettingsForm({ ...settingsForm, admissionOpen: e.target.checked })}
                    className="w-5 h-5 accent-indigo-600 rounded"
                  />
                </div>

                {/* SEO Sub-section */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 font-mono uppercase">SEO Settings</span>
                    <p className="text-[10px] text-slate-400">Configure page indexing titles, meta keywords, and site descriptors.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Meta Title</label>
                      <input
                        type="text"
                        value={settingsForm.metaTitle}
                        onChange={(e) => setSettingsForm({ ...settingsForm, metaTitle: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Meta Keywords</label>
                      <input
                        type="text"
                        value={settingsForm.metaKeywords}
                        onChange={(e) => setSettingsForm({ ...settingsForm, metaKeywords: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Meta Description</label>
                    <textarea
                      rows={2}
                      value={settingsForm.metaDescription}
                      onChange={(e) => setSettingsForm({ ...settingsForm, metaDescription: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {actionLoading ? 'Updating System...' : 'Save Settings Changes'}
                </button>
              </form>
            )}

            {/* 3. GALLERY MANAGEMENT */}
            {activeModule === 'gallery' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold font-sans text-slate-900">Gallery & Slider Management</h2>
                    <p className="text-xs text-slate-400">Upload multiple banners, dynamic photos, or link YouTube video recordings.</p>
                  </div>
                  <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Item
                  </button>
                </div>

                {isCreating && (
                  <form 
                    onSubmit={(e) => { e.preventDefault(); executeAction('/api/gallery', 'POST', galleryForm); }}
                    className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Item Type</label>
                        <select
                          value={galleryForm.type}
                          onChange={(e: any) => setGalleryForm({ ...galleryForm, type: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                        >
                          <option value="image">Photograph (Image)</option>
                          <option value="video">School Event Video Link</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Upload Local Photo</label>
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full text-xs"
                          onChange={(e) => handleImageUpload(e, (base64) => setGalleryForm({ ...galleryForm, url: base64 }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Image URL or Video Link</label>
                      <input
                        type="text"
                        placeholder="Paste image address, Base64 data, or video embedding URL"
                        value={galleryForm.url}
                        onChange={(e) => setGalleryForm({ ...galleryForm, url: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-100 rounded-xl text-xs outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Caption Label</label>
                      <input
                        type="text"
                        placeholder="Enter description caption text"
                        value={galleryForm.caption}
                        onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-100 rounded-xl text-xs outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCreating(false)}
                        className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 rounded-xl text-xs font-semibold text-slate-700 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-all"
                      >
                        {actionLoading ? 'Saving...' : 'Add Gallery Item'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {gallery.map((g) => (
                    <div key={g.id} className="group relative rounded-2xl border border-slate-100 overflow-hidden aspect-video">
                      <img
                        src={g.url}
                        alt="Gallery"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => executeAction(`/api/gallery/${g.id}`, 'DELETE')}
                          className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-md"
                          title="Delete image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 p-2 text-[10px] text-white line-clamp-1">
                        {g.caption || 'No caption'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. NOTICE MANAGEMENT */}
            {activeModule === 'notices' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold font-sans text-slate-900">Notice Management</h2>
                    <p className="text-xs text-slate-400">Add, Edit, Publish / Unpublish school circulars or holidays.</p>
                  </div>
                  <button
                    onClick={() => { setIsCreating(!isCreating); setEditingItem(null); setNoticeForm({ title: '', content: '', date: new Date().toISOString().split('T')[0], published: true, isHoliday: false }); }}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Circular
                  </button>
                </div>

                {isCreating && (
                  <form 
                    onSubmit={(e) => { e.preventDefault(); executeAction('/api/notices', 'POST', noticeForm); }}
                    className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Notice Date</label>
                        <input
                          type="date"
                          value={noticeForm.date}
                          onChange={(e) => setNoticeForm({ ...noticeForm, date: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-4 pt-4">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={noticeForm.isHoliday}
                            onChange={(e) => setNoticeForm({ ...noticeForm, isHoliday: e.target.checked })}
                            className="w-4 h-4 accent-indigo-600"
                          />
                          Holiday Notice?
                        </label>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={noticeForm.published}
                            onChange={(e) => setNoticeForm({ ...noticeForm, published: e.target.checked })}
                            className="w-4 h-4 accent-indigo-600"
                          />
                          Publish Live?
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Circular Title</label>
                      <input
                        type="text"
                        placeholder="E.g. Parent Teacher Meeting Notification"
                        value={noticeForm.title}
                        onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-100 rounded-xl text-xs outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Detailed Content Body</label>
                      <textarea
                        rows={3}
                        placeholder="Write detailed announcements instructions here..."
                        value={noticeForm.content}
                        onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-100 rounded-xl text-xs outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2.5 bg-slate-200 rounded-xl text-xs font-semibold text-slate-700">Cancel</button>
                      <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md">Add Circular</button>
                    </div>
                  </form>
                )}

                {/* Edit Form */}
                {editingItem && activeModule === 'notices' && (
                  <form 
                    onSubmit={(e) => { e.preventDefault(); executeAction(`/api/notices/${editingItem.id}`, 'PUT', editingItem); }}
                    className="p-6 bg-slate-100 border border-slate-200 rounded-2xl space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Notice Date</label>
                        <input
                          type="date"
                          value={editingItem.date}
                          onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-4 pt-4">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={editingItem.isHoliday}
                            onChange={(e) => setEditingItem({ ...editingItem, isHoliday: e.target.checked })}
                            className="w-4 h-4 accent-indigo-600"
                          />
                          Holiday Notice?
                        </label>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={editingItem.published}
                            onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                            className="w-4 h-4 accent-indigo-600"
                          />
                          Publish Live?
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Circular Title</label>
                      <input
                        type="text"
                        value={editingItem.title}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Detailed Content Body</label>
                      <textarea
                        rows={3}
                        value={editingItem.content}
                        onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2.5 bg-slate-200 rounded-xl text-xs font-semibold text-slate-700">Cancel</button>
                      <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md">Save Changes</button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {notices.map((n) => (
                    <div key={n.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block">{n.date} {n.isHoliday ? '• Holiday' : ''}</span>
                        <h4 className="font-bold text-xs text-slate-900 mt-0.5">{n.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingItem(n)}
                          className="p-1.5 bg-white border border-slate-200 hover:border-indigo-500 rounded-lg text-slate-600 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => executeAction(`/api/notices/${n.id}`, 'DELETE')}
                          className="p-1.5 bg-white border border-slate-200 hover:border-rose-500 rounded-lg text-rose-600 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. EVENT MANAGEMENT */}
            {activeModule === 'events' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold font-sans text-slate-900">Event Management</h2>
                    <p className="text-xs text-slate-400">Add, Edit, and Delete upcoming sports or cultural school celebrations.</p>
                  </div>
                  <button
                    onClick={() => { setIsCreating(!isCreating); setEditingItem(null); setEventForm({ title: '', description: '', date: new Date().toISOString().split('T')[0], category: 'Sports' }); }}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Event
                  </button>
                </div>

                {isCreating && (
                  <form 
                    onSubmit={(e) => { e.preventDefault(); executeAction('/api/events', 'POST', eventForm); }}
                    className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Event Date</label>
                        <input
                          type="date"
                          value={eventForm.date}
                          onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Category</label>
                        <select
                          value={eventForm.category}
                          onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                        >
                          <option value="Sports">Sports</option>
                          <option value="Cultural">Cultural</option>
                          <option value="Academic">Academic</option>
                          <option value="General">General</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Event Title</label>
                      <input
                        type="text"
                        placeholder="E.g. Sports Day Meet 2026"
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Event Description</label>
                      <textarea
                        rows={3}
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2.5 bg-slate-200 rounded-xl text-xs font-semibold text-slate-700">Cancel</button>
                      <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md">Add Event</button>
                    </div>
                  </form>
                )}

                {/* Edit Event Form */}
                {editingItem && activeModule === 'events' && (
                  <form 
                    onSubmit={(e) => { e.preventDefault(); executeAction(`/api/events/${editingItem.id}`, 'PUT', editingItem); }}
                    className="p-6 bg-slate-100 border border-slate-200 rounded-2xl space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Event Date</label>
                        <input
                          type="date"
                          value={editingItem.date}
                          onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Category</label>
                        <select
                          value={editingItem.category}
                          onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                        >
                          <option value="Sports">Sports</option>
                          <option value="Cultural">Cultural</option>
                          <option value="Academic">Academic</option>
                          <option value="General">General</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Event Title</label>
                      <input
                        type="text"
                        value={editingItem.title}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Event Description</label>
                      <textarea
                        rows={3}
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2.5 bg-slate-200 rounded-xl text-xs font-semibold text-slate-700">Cancel</button>
                      <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md">Save Changes</button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {events.map((e) => (
                    <div key={e.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block">{e.date} • {e.category}</span>
                        <h4 className="font-bold text-xs text-slate-900 mt-0.5">{e.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditingItem(e)} className="p-1.5 bg-white border border-slate-200 hover:border-indigo-500 rounded-lg text-slate-600"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => executeAction(`/api/events/${e.id}`, 'DELETE')} className="p-1.5 bg-white border border-slate-200 hover:border-rose-500 rounded-lg text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. NEWS MODULE */}
            {activeModule === 'news' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold font-sans text-slate-900">News Announcements</h2>
                    <p className="text-xs text-slate-400">Add, edit, or delete recent school media releases and news articles.</p>
                  </div>
                  <button
                    onClick={() => { setIsCreating(!isCreating); setEditingItem(null); setNewsForm({ title: '', content: '', date: new Date().toISOString().split('T')[0] }); }}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add News
                  </button>
                </div>

                {isCreating && (
                  <form 
                    onSubmit={(e) => { e.preventDefault(); executeAction('/api/news', 'POST', newsForm); }}
                    className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">News Release Date</label>
                      <input
                        type="date"
                        value={newsForm.date}
                        onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">News Title</label>
                      <input
                        type="text"
                        placeholder="E.g. District Math Championship Trophy"
                        value={newsForm.title}
                        onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Content Text Body</label>
                      <textarea
                        rows={4}
                        value={newsForm.content}
                        onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2.5 bg-slate-200 rounded-xl text-xs font-semibold text-slate-700">Cancel</button>
                      <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md">Add News</button>
                    </div>
                  </form>
                )}

                {/* Edit News Form */}
                {editingItem && activeModule === 'news' && (
                  <form 
                    onSubmit={(e) => { e.preventDefault(); executeAction(`/api/news/${editingItem.id}`, 'PUT', editingItem); }}
                    className="p-6 bg-slate-100 border border-slate-200 rounded-2xl space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">News Release Date</label>
                      <input
                        type="date"
                        value={editingItem.date}
                        onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">News Title</label>
                      <input
                        type="text"
                        value={editingItem.title}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Content Text Body</label>
                      <textarea
                        rows={4}
                        value={editingItem.content}
                        onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2.5 bg-slate-200 rounded-xl text-xs font-semibold text-slate-700">Cancel</button>
                      <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md">Save Changes</button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {news.map((n) => (
                    <div key={n.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block">{n.date}</span>
                        <h4 className="font-bold text-xs text-slate-900 mt-0.5">{n.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditingItem(n)} className="p-1.5 bg-white border border-slate-200 hover:border-indigo-500 rounded-lg text-slate-600"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => executeAction(`/api/news/${n.id}`, 'DELETE')} className="p-1.5 bg-white border border-slate-200 hover:border-rose-500 rounded-lg text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. TEACHERS DIRECTORY */}
            {activeModule === 'teachers' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold font-sans text-slate-900">Teachers Directory</h2>
                    <p className="text-xs text-slate-400">Add, edit, or delete professional academic tutors.</p>
                  </div>
                  <button
                    onClick={() => { setIsCreating(!isCreating); setEditingItem(null); setTeacherForm({ name: '', qualification: '', subject: 'Science', experience: '', photo: '' }); }}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Teacher
                  </button>
                </div>

                {isCreating && (
                  <form 
                    onSubmit={(e) => { e.preventDefault(); executeAction('/api/teachers', 'POST', teacherForm); }}
                    className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Teacher Name</label>
                        <input
                          type="text"
                          required
                          value={teacherForm.name}
                          onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                          placeholder="E.g. Sarah Jenkins"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Qualification</label>
                        <input
                          type="text"
                          required
                          value={teacherForm.qualification}
                          onChange={(e) => setTeacherForm({ ...teacherForm, qualification: e.target.value })}
                          placeholder="E.g. M.Sc. Mathematics"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1 col-span-2">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Subject Specialization</label>
                        <input
                          type="text"
                          required
                          value={teacherForm.subject}
                          onChange={(e) => setTeacherForm({ ...teacherForm, subject: e.target.value })}
                          placeholder="E.g. Mathematics"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Experience Years</label>
                        <input
                          type="text"
                          required
                          value={teacherForm.experience}
                          onChange={(e) => setTeacherForm({ ...teacherForm, experience: e.target.value })}
                          placeholder="E.g. 8 Years"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Photo URL or Base64</label>
                        <input
                          type="text"
                          value={teacherForm.photo}
                          onChange={(e) => setTeacherForm({ ...teacherForm, photo: e.target.value })}
                          placeholder="Paste image link or upload"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Upload Local Photo</label>
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full text-xs pt-2"
                          onChange={(e) => handleImageUpload(e, (base64) => setTeacherForm({ ...teacherForm, photo: base64 }))}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2.5 bg-slate-200 rounded-xl text-xs font-semibold text-slate-700">Cancel</button>
                      <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md">Add Teacher</button>
                    </div>
                  </form>
                )}

                {/* Edit Teacher Form */}
                {editingItem && activeModule === 'teachers' && (
                  <form 
                    onSubmit={(e) => { e.preventDefault(); executeAction(`/api/teachers/${editingItem.id}`, 'PUT', editingItem); }}
                    className="p-6 bg-slate-100 border border-slate-200 rounded-2xl space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Teacher Name</label>
                        <input
                          type="text"
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Qualification</label>
                        <input
                          type="text"
                          value={editingItem.qualification}
                          onChange={(e) => setEditingItem({ ...editingItem, qualification: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1 col-span-2">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Subject Specialization</label>
                        <input
                          type="text"
                          value={editingItem.subject}
                          onChange={(e) => setEditingItem({ ...editingItem, subject: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Experience Years</label>
                        <input
                          type="text"
                          value={editingItem.experience}
                          onChange={(e) => setEditingItem({ ...editingItem, experience: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Photo URL or Base64</label>
                        <input
                          type="text"
                          value={editingItem.photo}
                          onChange={(e) => setEditingItem({ ...editingItem, photo: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Upload Local Photo</label>
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full text-xs pt-2"
                          onChange={(e) => handleImageUpload(e, (base64) => setEditingItem({ ...editingItem, photo: base64 }))}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2.5 bg-slate-200 rounded-xl text-xs font-semibold text-slate-700">Cancel</button>
                      <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md">Save Changes</button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {teachers.map((t) => (
                    <div key={t.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img src={t.photo} alt="t" className="w-10 h-10 object-cover rounded-xl border" referrerPolicy="no-referrer" />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{t.name}</h4>
                          <span className="text-[10px] font-mono text-slate-400">{t.subject} • {t.qualification}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditingItem(t)} className="p-1.5 bg-white border border-slate-200 hover:border-indigo-500 rounded-lg text-slate-600"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => executeAction(`/api/teachers/${t.id}`, 'DELETE')} className="p-1.5 bg-white border border-slate-200 hover:border-rose-500 rounded-lg text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. ADMISSION FORMS */}
            {activeModule === 'admissions' && (
              <div className="space-y-6">
                <div className="border-b border-slate-50 pb-4">
                  <h2 className="text-xl font-extrabold font-sans text-slate-900">Admission Forms</h2>
                  <p className="text-xs text-slate-400">View student application details, download records, and delete forms.</p>
                </div>

                <div className="space-y-4">
                  {admissions.map((form) => (
                    <div key={form.id} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase">{form.grade} Application</span>
                          <h3 className="font-sans font-extrabold text-slate-900 text-sm mt-0.5">{form.studentName}</h3>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              // Simulate text sheet download
                              const text = `STUDENT APPLICATION\nName: ${form.studentName}\nGrade: ${form.grade}\nDOB: ${form.dateOfBirth}\nParent: ${form.parentName}\nPhone: ${form.phone}\nEmail: ${form.email}\nAddress: ${form.address}\nPrevious School: ${form.previousSchool || 'None'}\nSubmitted: ${form.submittedAt}`;
                              const element = document.createElement("a");
                              const file = new Blob([text], {type: 'text/plain'});
                              element.href = URL.createObjectURL(file);
                              element.download = `${form.studentName.replace(/\s+/g, '_')}_Admission_Form.txt`;
                              document.body.appendChild(element);
                              element.click();
                              document.body.removeChild(element);
                            }}
                            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-[10px] rounded-lg shadow-sm"
                          >
                            Download Form
                          </button>
                          <button
                            onClick={() => executeAction(`/api/admissions/${form.id}`, 'DELETE')}
                            className="p-1.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg hover:bg-rose-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans text-slate-600">
                        <div>
                          <span className="text-[9px] font-mono text-slate-400 block">PARENT NAME</span>
                          <span className="font-semibold text-slate-900">{form.parentName}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-slate-400 block">DOB</span>
                          <span className="font-semibold text-slate-900">{form.dateOfBirth}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-slate-400 block">PHONE</span>
                          <span className="font-semibold text-slate-900">{form.phone}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-slate-400 block">EMAIL</span>
                          <span className="font-semibold text-slate-900">{form.email}</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 pt-2 border-t border-slate-100">
                        <span className="text-[9px] font-mono text-slate-400 block">RESIDENTIAL ADDRESS</span>
                        <p className="font-medium text-slate-800">{form.address}</p>
                      </div>
                    </div>
                  ))}
                  {admissions.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-12">No online admission application logged yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* 9. CONTACT MESSAGES */}
            {activeModule === 'messages' && (
              <div className="space-y-6">
                <div className="border-b border-slate-50 pb-4">
                  <h2 className="text-xl font-extrabold font-sans text-slate-900">Inquiry Messages</h2>
                  <p className="text-xs text-slate-400">View incoming emails, mark inquiries as Read, or delete logs.</p>
                </div>

                <div className="space-y-4">
                  {messages.map((m) => (
                    <div 
                      key={m.id} 
                      className={`p-6 border rounded-2xl space-y-3 relative transition-all ${
                        m.read ? 'bg-slate-50/50 border-slate-100' : 'bg-indigo-50/20 border-indigo-100 shadow-sm'
                      }`}
                    >
                      {!m.read && (
                        <span className="absolute top-4 right-4 px-2 py-0.5 bg-indigo-600 text-white rounded text-[9px] font-bold font-mono">NEW INQUIRY</span>
                      )}

                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block">{m.submittedAt}</span>
                          <h4 className="font-bold text-xs text-slate-900 mt-0.5">{m.name}</h4>
                          <span className="text-[10px] text-indigo-600 font-medium font-mono block mt-0.5">{m.email}</span>
                        </div>
                        <div className="flex gap-2">
                          {!m.read && (
                            <button
                              onClick={() => executeAction(`/api/messages/${m.id}/read`, 'PUT')}
                              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[9px] rounded-lg flex items-center gap-1 shadow"
                            >
                              <Check className="w-3 h-3" /> Mark Read
                            </button>
                          )}
                          <button
                            onClick={() => executeAction(`/api/messages/${m.id}`, 'DELETE')}
                            className="p-1.5 bg-white border border-slate-200 rounded-lg text-rose-600 hover:border-rose-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-mono font-bold text-slate-400">SUBJECT: {m.subject}</span>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-white/50 p-3 rounded-lg border border-slate-50 font-sans italic">
                          "{m.message}"
                        </p>
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-12">No contact messages logged yet.</p>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
}
