export interface SchoolSettings {
  schoolName: string;
  logo: string;
  favicon: string;
  address: string;
  phone: string;
  email: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  footerText: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  principalMessage: string;
  principalPhoto: string;
  vision: string;
  mission: string;
  admissionOpen: boolean;
  totalStudentsManual: number;
  visitorsCount: number;
}

export interface Teacher {
  id: string;
  name: string;
  qualification: string;
  subject: string;
  experience: string;
  photo: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  published: boolean;
  isHoliday?: boolean;
}

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  category?: string; // e.g. Sports, Cultural, Academic
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  type: 'image' | 'video';
}

export interface AdmissionForm {
  id: string;
  studentName: string;
  dateOfBirth: string;
  grade: string;
  parentName: string;
  email: string;
  phone: string;
  address: string;
  previousSchool?: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  read: boolean;
}
