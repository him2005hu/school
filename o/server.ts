import express from 'express';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  limit,
  increment
} from 'firebase/firestore';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for base64 image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Load Firebase Config
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
if (!fs.existsSync(configPath)) {
  console.error('CRITICAL: firebase-applet-config.json is missing! Firebase will not connect.');
  process.exit(1);
}

const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Initialize Firebase Client SDK
const firebaseApp = initializeApp(firebaseConfig);
const db = initializeFirestore(firebaseApp, {
  databaseId: firebaseConfig.firestoreDatabaseId
} as any);

const JWT_SECRET = process.env.JWT_SECRET || 'edufuture_secret_jwt_key_2026_xyz';
const ADMIN_USER = 'Anmol12558';
const ADMIN_PASSWORD_PLAIN = 'Anmol@123';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(ADMIN_PASSWORD_PLAIN, 10);

// JWT Middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication token is missing.' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Session expired or invalid token.' });
    }
    req.user = user;
    next();
  });
}

// Seed Database helper
async function seedDatabaseIfEmpty() {
  try {
    const settingsDocRef = doc(db, 'settings', 'main');
    const settingsSnap = await getDoc(settingsDocRef);
    if (!settingsSnap.exists()) {
      await setDoc(settingsDocRef, {
        schoolName: "EduFuture Public School",
        logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop",
        favicon: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=32&auto=format&fit=crop",
        address: "123 Education Boulevard, Knowledge City, State - 452001",
        phone: "+1 (555) 019-2834",
        email: "info@edufuture.edu.gcp",
        socialMedia: {
          facebook: "https://facebook.com",
          twitter: "https://twitter.com",
          instagram: "https://instagram.com",
          linkedin: "https://linkedin.com"
        },
        footerText: "© 2026 EduFuture Public School. All Rights Reserved.",
        metaTitle: "EduFuture Public School - Shaping Future Leaders",
        metaDescription: "Welcome to EduFuture Public School, where academic excellence meets holistic development. Join us to shape your child's future.",
        metaKeywords: "school, education, admissions open, edufuture, curriculum, faculty",
        principalMessage: "At EduFuture, we strive to nurture inquisitive minds and foster a love for learning. Our dedicated staff ensures a supportive environment where every student can achieve their full potential.",
        principalPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop",
        vision: "To be a global beacon of educational excellence, empowering students to lead with integrity, innovate with courage, and serve with compassion.",
        mission: "We are committed to providing a holistic, rigorous, and inclusive education that prepares diverse learners to excel in an interconnected world.",
        admissionOpen: true,
        totalStudentsManual: 1250,
        visitorsCount: 5824
      });
      console.log('Seeded default settings.');
    }

    const teachersCol = collection(db, 'teachers');
    const teachersSnap = await getDocs(query(teachersCol, limit(1)));
    if (teachersSnap.empty) {
      const defaultTeachers = [
        {
          name: "Sarah Jenkins",
          qualification: "M.Sc. Mathematics",
          subject: "Mathematics",
          experience: "8 Years",
          photo: "https://images.unsplash.com/photo-1580894732444-8febeb28a57b?w=300&auto=format&fit=crop"
        },
        {
          name: "Robert Chen",
          qualification: "Ph.D. Physics",
          subject: "Science",
          experience: "12 Years",
          photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop"
        },
        {
          name: "Elena Rostova",
          qualification: "M.A. English Literature",
          subject: "English",
          experience: "6 Years",
          photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop"
        },
        {
          name: "Marcus Vance",
          qualification: "B.P.Ed",
          subject: "Physical Education",
          experience: "10 Years",
          photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop"
        }
      ];
      for (const t of defaultTeachers) {
        await addDoc(teachersCol, t);
      }
      console.log('Seeded default teachers.');
    }

    const noticesCol = collection(db, 'notices');
    const noticesSnap = await getDocs(query(noticesCol, limit(1)));
    if (noticesSnap.empty) {
      const defaultNotices = [
        {
          title: "Admissions Open for Academic Year 2026-27",
          content: "Online registration for Nursery to Grade 11 is now open. Apply online or visit our campus for prospectus and details.",
          date: "2026-06-15",
          published: true,
          isHoliday: false
        },
        {
          title: "Summer Vacation Schedule & Holidays List",
          content: "School will remain closed for summer break starting July 15th, 2026. Holiday homework and project assignments are available under curriculum downloads.",
          date: "2026-06-30",
          published: true,
          isHoliday: true
        },
        {
          title: "Parent-Teacher Meeting (PTM) Scheduled",
          content: "Term 1 report card distribution and teacher interaction are scheduled for next Saturday from 8:30 AM to 12:30 PM.",
          date: "2026-06-28",
          published: true,
          isHoliday: false
        }
      ];
      for (const n of defaultNotices) {
        await addDoc(noticesCol, n);
      }
      console.log('Seeded default notices.');
    }

    const eventsCol = collection(db, 'events');
    const eventsSnap = await getDocs(query(eventsCol, limit(1)));
    if (eventsSnap.empty) {
      const defaultEvents = [
        {
          title: "Annual Sports Athletics Meet 2026",
          description: "Our annual sporting extravaganza celebrating fitness, team play, track races, and relay championships.",
          date: "2026-08-15",
          category: "Sports"
        },
        {
          title: "Science & Innovation Tech Fair",
          description: "Stalls displaying student inventions, coding scripts, environment models, and research projects.",
          date: "2026-09-10",
          category: "Academic"
        },
        {
          title: "Annual Cultural & Dance Fest",
          description: "A gorgeous array of theatrical dramas, music orchestras, and folklore dances presented by our students.",
          date: "2026-10-05",
          category: "Cultural"
        }
      ];
      for (const e of defaultEvents) {
        await addDoc(eventsCol, e);
      }
      console.log('Seeded default events.');
    }

    const newsCol = collection(db, 'news');
    const newsSnap = await getDocs(query(newsCol, limit(1)));
    if (newsSnap.empty) {
      const defaultNews = [
        {
          title: "EduFuture Ranks #1 in National Merit Olympiad",
          content: "We are extremely proud to announce our high school Olympiad squad has bagged the coveted national champion cup.",
          date: "2026-06-20"
        },
        {
          title: "Inauguration of New Advanced STEM Laboratory",
          content: "A cutting-edge lab boasting computing nodes, 3D printers, and robotics rigs has been unveiled to advance our tech-forward agenda.",
          date: "2026-05-15"
        }
      ];
      for (const n of defaultNews) {
        await addDoc(newsCol, n);
      }
      console.log('Seeded default news.');
    }

    const galleryCol = collection(db, 'gallery');
    const gallerySnap = await getDocs(query(galleryCol, limit(1)));
    if (gallerySnap.empty) {
      const defaultGallery = [
        {
          url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop",
          caption: "Active collaborative classwork.",
          type: "image"
        },
        {
          url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop",
          caption: "School central library reading hall.",
          type: "image"
        },
        {
          url: "https://images.unsplash.com/photo-1562774053-401386dfdf3f?w=600&auto=format&fit=crop",
          caption: "Modern science experiment testing.",
          type: "image"
        },
        {
          url: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600&auto=format&fit=crop",
          caption: "Athletes practicing sprint dashes.",
          type: "image"
        }
      ];
      for (const g of defaultGallery) {
        await addDoc(galleryCol, g);
      }
      console.log('Seeded default gallery.');
    }

    const admissionsCol = collection(db, 'admissions');
    const admissionsSnap = await getDocs(query(admissionsCol, limit(1)));
    if (admissionsSnap.empty) {
      const defaultAdmission = {
        studentName: "Alex Mercer",
        dateOfBirth: "2012-05-14",
        grade: "Grade 9",
        parentName: "Dana Mercer",
        email: "alex@example.com",
        phone: "555-019-9988",
        address: "456 Oak Avenue, Knowledge City",
        previousSchool: "St. Jude Secondary Academy",
        submittedAt: new Date().toISOString(),
        status: "Pending"
      };
      await addDoc(admissionsCol, defaultAdmission);
      console.log('Seeded default admission application.');
    }

    const messagesCol = collection(db, 'messages');
    const messagesSnap = await getDocs(query(messagesCol, limit(1)));
    if (messagesSnap.empty) {
      const defaultMessage = {
        name: "Jane Doe",
        email: "jane@example.com",
        subject: "Transportation Facilities Inquiry",
        message: "Hello, I wanted to inquire if there is a school bus route active for the Westside residential sector? If yes, please share the fees.",
        submittedAt: new Date().toISOString(),
        read: false
      };
      await addDoc(messagesCol, defaultMessage);
      console.log('Seeded default contact message.');
    }
  } catch (error) {
    console.error('Error during automatic database seeding:', error);
  }
}

// Call seeder after initializing Firebase
seedDatabaseIfEmpty();

// ---------------- API ROUTES ----------------

// Auth Endpoint
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  if (username === ADMIN_USER && password === ADMIN_PASSWORD_PLAIN) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, username });
  }

  return res.status(401).json({ error: 'Incorrect username or password.' });
});

// Settings Endpoints
app.get('/api/settings', async (req, res) => {
  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'main'));
    if (settingsDoc.exists()) {
      return res.json(settingsDoc.data());
    } else {
      return res.status(404).json({ error: 'Settings not configured.' });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', authenticateToken, async (req, res) => {
  try {
    const settingsDocRef = doc(db, 'settings', 'main');
    await updateDoc(settingsDocRef, req.body);
    const updated = await getDoc(settingsDocRef);
    return res.json(updated.data());
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Increment Visitors
app.post('/api/visitors/increment', async (req, res) => {
  try {
    const settingsDocRef = doc(db, 'settings', 'main');
    await updateDoc(settingsDocRef, {
      visitorsCount: increment(1)
    });
    const updated = await getDoc(settingsDocRef);
    const count = updated.exists() ? updated.data().visitorsCount : 0;
    return res.json({ visitorsCount: count });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Dashboard Stats Endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const [gallerySnap, teachersSnap, noticesSnap, eventsSnap, settingsSnap] = await Promise.all([
      getDocs(collection(db, 'gallery')),
      getDocs(collection(db, 'teachers')),
      getDocs(collection(db, 'notices')),
      getDocs(collection(db, 'events')),
      getDoc(doc(db, 'settings', 'main'))
    ]);

    const settingsData = settingsSnap.exists() ? settingsSnap.data() : {};

    return res.json({
      totalGallery: gallerySnap.size,
      totalTeachers: teachersSnap.size,
      totalNotices: noticesSnap.size,
      totalEvents: eventsSnap.size,
      totalStudents: settingsData.totalStudentsManual || 0,
      visitors: settingsData.visitorsCount || 0
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Teachers Endpoints
app.get('/api/teachers', async (req, res) => {
  try {
    const snap = await getDocs(collection(db, 'teachers'));
    const teachers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json(teachers);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/teachers', authenticateToken, async (req, res) => {
  try {
    const ref = await addDoc(collection(db, 'teachers'), req.body);
    return res.json({ id: ref.id, ...req.body });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/teachers/:id', authenticateToken, async (req, res) => {
  try {
    const ref = doc(db, 'teachers', req.params.id);
    await updateDoc(ref, req.body);
    return res.json({ id: req.params.id, ...req.body });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/teachers/:id', authenticateToken, async (req, res) => {
  try {
    await deleteDoc(doc(db, 'teachers', req.params.id));
    return res.json({ success: true, id: req.params.id });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Notices Endpoints
app.get('/api/notices', async (req, res) => {
  try {
    const snap = await getDocs(collection(db, 'notices'));
    const notices = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json(notices);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/notices', authenticateToken, async (req, res) => {
  try {
    const ref = await addDoc(collection(db, 'notices'), req.body);
    return res.json({ id: ref.id, ...req.body });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/notices/:id', authenticateToken, async (req, res) => {
  try {
    const ref = doc(db, 'notices', req.params.id);
    await updateDoc(ref, req.body);
    return res.json({ id: req.params.id, ...req.body });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/notices/:id', authenticateToken, async (req, res) => {
  try {
    await deleteDoc(doc(db, 'notices', req.params.id));
    return res.json({ success: true, id: req.params.id });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Events Endpoints
app.get('/api/events', async (req, res) => {
  try {
    const snap = await getDocs(collection(db, 'events'));
    const events = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json(events);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const ref = await addDoc(collection(db, 'events'), req.body);
    return res.json({ id: ref.id, ...req.body });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const ref = doc(db, 'events', req.params.id);
    await updateDoc(ref, req.body);
    return res.json({ id: req.params.id, ...req.body });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    await deleteDoc(doc(db, 'events', req.params.id));
    return res.json({ success: true, id: req.params.id });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// News Endpoints
app.get('/api/news', async (req, res) => {
  try {
    const snap = await getDocs(collection(db, 'news'));
    const news = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json(news);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/news', authenticateToken, async (req, res) => {
  try {
    const ref = await addDoc(collection(db, 'news'), req.body);
    return res.json({ id: ref.id, ...req.body });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/news/:id', authenticateToken, async (req, res) => {
  try {
    const ref = doc(db, 'news', req.params.id);
    await updateDoc(ref, req.body);
    return res.json({ id: req.params.id, ...req.body });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/news/:id', authenticateToken, async (req, res) => {
  try {
    await deleteDoc(doc(db, 'news', req.params.id));
    return res.json({ success: true, id: req.params.id });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Gallery Endpoints
app.get('/api/gallery', async (req, res) => {
  try {
    const snap = await getDocs(collection(db, 'gallery'));
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json(items);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/gallery', authenticateToken, async (req, res) => {
  try {
    const ref = await addDoc(collection(db, 'gallery'), req.body);
    return res.json({ id: ref.id, ...req.body });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/gallery/:id', authenticateToken, async (req, res) => {
  try {
    await deleteDoc(doc(db, 'gallery', req.params.id));
    return res.json({ success: true, id: req.params.id });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Admissions Endpoints (Admin check on GET, public on POST)
app.get('/api/admissions', authenticateToken, async (req, res) => {
  try {
    const snap = await getDocs(collection(db, 'admissions'));
    const forms = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json(forms);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/admissions', async (req, res) => {
  try {
    const submission = {
      ...req.body,
      submittedAt: new Date().toISOString(),
      status: 'Pending'
    };
    const ref = await addDoc(collection(db, 'admissions'), submission);
    return res.json({ id: ref.id, ...submission });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admissions/:id', authenticateToken, async (req, res) => {
  try {
    await deleteDoc(doc(db, 'admissions', req.params.id));
    return res.json({ success: true, id: req.params.id });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Contact Messages Endpoints (Admin check on GET, public on POST)
app.get('/api/messages', authenticateToken, async (req, res) => {
  try {
    const snap = await getDocs(collection(db, 'messages'));
    const messages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json(messages);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const submission = {
      ...req.body,
      submittedAt: new Date().toISOString(),
      read: false
    };
    const ref = await addDoc(collection(db, 'messages'), submission);
    return res.json({ id: ref.id, ...submission });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/messages/:id/read', authenticateToken, async (req, res) => {
  try {
    const ref = doc(db, 'messages', req.params.id);
    await updateDoc(ref, { read: true });
    return res.json({ success: true, id: req.params.id, read: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/messages/:id', authenticateToken, async (req, res) => {
  try {
    await deleteDoc(doc(db, 'messages', req.params.id));
    return res.json({ success: true, id: req.params.id });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ---------------- VITE MIDDLEWARE SETUP ----------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduFuture Server running on port ${PORT}`);
  });
}

startServer();
