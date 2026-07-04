import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import AcademicsView from './components/AcademicsView';
import AdmissionsView from './components/AdmissionsView';
import GalleryView from './components/GalleryView';
import FacultyView from './components/FacultyView';
import NoticeBoardView from './components/NoticeBoardView';
import EventsView from './components/EventsView';
import ContactView from './components/ContactView';
import AdminPortal from './components/AdminPortal';
import { 
  SchoolSettings, Teacher, Notice, SchoolEvent, NewsItem, 
  GalleryItem, AdmissionForm, ContactMessage 
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  // Core Dynamic Data States
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionForm[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Page Load state
  const [loading, setLoading] = useState<boolean>(true);

  // Pull local token if any
  useEffect(() => {
    const savedToken = localStorage.getItem('edufuture_admin_token');
    if (savedToken) {
      setAdminToken(savedToken);
      setIsAdmin(true);
    }
  }, []);

  // Fetch all primary school datasets
  const fetchSchoolData = async () => {
    try {
      const [resSettings, resTeachers, resNotices, resEvents, resNews, resGallery] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/teachers'),
        fetch('/api/notices'),
        fetch('/api/events'),
        fetch('/api/news'),
        fetch('/api/gallery')
      ]);

      if (resSettings.ok) setSettings(await resSettings.json());
      if (resTeachers.ok) setTeachers(await resTeachers.json());
      if (resNotices.ok) setNotices(await resNotices.json());
      if (resEvents.ok) setEvents(await resEvents.json());
      if (resNews.ok) setNews(await resNews.json());
      if (resGallery.ok) setGallery(await resGallery.json());

    } catch (err) {
      console.error('Error loading school database:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch private admin datasets
  const fetchAdminData = async (tokenString: string) => {
    try {
      const [resAdmissions, resMessages] = await Promise.all([
        fetch('/api/admissions', { headers: { 'Authorization': `Bearer ${tokenString}` } }),
        fetch('/api/messages', { headers: { 'Authorization': `Bearer ${tokenString}` } })
      ]);

      if (resAdmissions.ok) setAdmissions(await resAdmissions.json());
      if (resMessages.ok) setMessages(await resMessages.json());
    } catch (err) {
      console.error('Error fetching admin datasets:', err);
    }
  };

  // Main data sync
  useEffect(() => {
    fetchSchoolData();
  }, []);

  // Sync admin details whenever token is active
  useEffect(() => {
    if (adminToken) {
      fetchAdminData(adminToken);
    } else {
      setAdmissions([]);
      setMessages([]);
    }
  }, [adminToken]);

  // Visitor incrementer run once per session
  useEffect(() => {
    const visited = sessionStorage.getItem('edufuture_visited');
    if (!visited) {
      fetch('/api/visitors/increment', { method: 'POST' })
        .then(res => {
          if (res.ok) {
            sessionStorage.setItem('edufuture_visited', 'true');
          }
        })
        .catch(err => console.error(err));
    }
  }, []);

  // Dynaimc SEO update
  useEffect(() => {
    if (settings) {
      document.title = settings.metaTitle || 'EduFuture Public School';
      
      // Update meta descriptions if elements exist
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', settings.metaDescription || '');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = settings.metaDescription || '';
        document.head.appendChild(meta);
      }

      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', settings.metaKeywords || '');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = settings.metaKeywords || '';
        document.head.appendChild(meta);
      }
    }
  }, [settings]);

  const handleLogin = (token: string) => {
    setAdminToken(token);
    setIsAdmin(true);
    localStorage.setItem('edufuture_admin_token', token);
  };

  const handleLogout = () => {
    setAdminToken(null);
    setIsAdmin(false);
    localStorage.removeItem('edufuture_admin_token');
    setActiveTab('home');
  };

  // Handle data refreshes from dashboard operations
  const refreshAllDatasets = async () => {
    await fetchSchoolData();
    if (adminToken) {
      await fetchAdminData(adminToken);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">Connecting EduFuture Cloud Node...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-950">
      <div>
        <Navbar 
          settings={settings}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAdmin={isAdmin}
          onLogout={handleLogout}
        />

        <main className="min-h-[70vh]">
          {activeTab === 'home' && (
            <HomeView 
              settings={settings}
              events={events}
              notices={notices}
              gallery={gallery}
              news={news}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'about' && (
            <AboutView settings={settings} />
          )}

          {activeTab === 'academics' && (
            <AcademicsView />
          )}

          {activeTab === 'admissions' && (
            <AdmissionsView settings={settings} />
          )}

          {activeTab === 'gallery' && (
            <GalleryView gallery={gallery} />
          )}

          {activeTab === 'faculty' && (
            <FacultyView teachers={teachers} />
          )}

          {activeTab === 'notices' && (
            <NoticeBoardView notices={notices} />
          )}

          {activeTab === 'events' && (
            <EventsView events={events} news={news} />
          )}

          {activeTab === 'contact' && (
            <ContactView settings={settings} />
          )}

          {activeTab === 'admin' && (
            <AdminPortal 
              settings={settings}
              teachers={teachers}
              notices={notices}
              events={events}
              news={news}
              gallery={gallery}
              admissions={admissions}
              messages={messages}
              token={adminToken}
              onLogin={handleLogin}
              onLogout={handleLogout}
              refreshData={refreshAllDatasets}
            />
          )}
        </main>
      </div>
    </div>
  );
}
