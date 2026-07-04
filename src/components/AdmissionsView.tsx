import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronRight, Download, FileText, Send, Sparkles, UserCheck } from 'lucide-react';
import { SchoolSettings } from '../types';

interface AdmissionsViewProps {
  settings: SchoolSettings | null;
}

export default function AdmissionsView({ settings }: AdmissionsViewProps) {
  const [formData, setFormData] = useState({
    studentName: '',
    dateOfBirth: '',
    grade: 'Grade 1',
    parentName: '',
    email: '',
    phone: '',
    address: '',
    previousSchool: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const gradeOptions = [
    'Nursery', 'Lower KG', 'Upper KG',
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
    'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic Validation
    if (!formData.studentName || !formData.dateOfBirth || !formData.parentName || !formData.email || !formData.phone || !formData.address) {
      setError('Please fill in all the required fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Admissions server returned an error.');
      }

      const data = await response.json();
      setSubmitted(data.id);
      setFormData({
        studentName: '',
        dateOfBirth: '',
        grade: 'Grade 1',
        parentName: '',
        email: '',
        phone: '',
        address: '',
        previousSchool: ''
      });
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadProspectus = () => {
    // Generate a mock download with clean formatting in a new window or a popup text file
    const text = `
=========================================
      EDUFUTURE PUBLIC SCHOOL
      OFFICIAL PROSPECTUS 2026-27
=========================================

1. VISION:
To be a global beacon of educational excellence,
empowering students to lead with integrity.

2. ACADEMICS & INFRASTRUCTURE:
- Fully automated smart classrooms.
- Physics, Chemistry, Biology and computing Labs.
- Library with 10k+ physical books.
- Professional physical coaching in soccer, cricket, swimming.

3. FEES BREAKDOWN:
- Nursery to UKG: $1,200 per annum
- Grade 1 to 5: $1,800 per annum
- Grade 6 to 10: $2,400 per annum
- Grade 11 to 12: $3,200 per annum

4. ADMISSION REQUIREMENTS:
- Self-attested copy of Birth Certificate.
- Official school-leaving Transfer Certificate (Grade 1 upwards).
- 3 recent passport-sized color photographs.
- Previous class marksheet.

Contact us at info@edufuture.edu.gcp for physical forms.
=========================================
`;
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "EduFuture_Prospectus_2026_27.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16"
    >
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-bold block">Enrollment Gateway</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-sans text-slate-900 tracking-tight">Admissions</h1>
        <p className="text-sm text-slate-500">Secure your child's place in our prestigious cohort today.</p>
      </div>

      {/* Admission Open Announcement Banner */}
      {settings?.admissionOpen ? (
        <div className="bg-gradient-to-r from-emerald-600 to-indigo-600 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-3 max-w-lg">
            <span className="px-3 py-1 bg-white/20 rounded-full font-bold text-[10px] tracking-widest uppercase font-mono">Admission Status</span>
            <h2 className="text-2xl sm:text-3xl font-sans font-extrabold">Online Admissions 2026-27 is Active</h2>
            <p className="text-xs text-indigo-100">Submit your application online through our dynamic digital portal or download our official prospectus for requirements.</p>
          </div>
          <button
            onClick={handleDownloadProspectus}
            className="px-6 py-3.5 bg-white text-indigo-600 hover:bg-slate-50 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all"
          >
            <Download className="w-5 h-5" /> Download Prospectus
          </button>
        </div>
      ) : (
        <div className="bg-slate-100 text-slate-700 rounded-3xl p-8 text-center border border-slate-200">
          <h2 className="font-sans font-extrabold text-xl">Admissions for 2026-27 is Currently Closed</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
            Offline enrollment rounds are being processed. Sign up to our notification lists or contact the administration helpdesk.
          </p>
        </div>
      )}

      {/* Process & Eligibility */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Step by Step Process */}
        <div className="space-y-8">
          <h2 className="text-2xl font-extrabold font-sans text-slate-900">The Enrollment Process</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center font-mono">1</div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Prospectus & Study</h4>
                <p className="text-xs text-slate-500 leading-relaxed mt-0.5">Read through the academic Streams, requirements, eligibility thresholds, and fees detail.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center font-mono">2</div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Digital Submission</h4>
                <p className="text-xs text-slate-500 leading-relaxed mt-0.5">Fill in the online form with authentic parent, grade, contact details, and previous score log.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center font-mono">3</div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Document Review</h4>
                <p className="text-xs text-slate-500 leading-relaxed mt-0.5">Our academic board evaluates forms. Shortlisted parents receive an email call for campus verification.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center font-mono">4</div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Interaction & Fee Clearance</h4>
                <p className="text-xs text-slate-500 leading-relaxed mt-0.5">Interaction round with the Principal followed by formal documents verification and fee payment.</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-3">
            <h4 className="font-sans font-bold text-slate-900 text-sm flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600" /> Eligibility Criteria
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li><strong>Nursery / KG:</strong> Child must be 3+ years of age as of March 31st, 2026.</li>
              <li><strong>Grade 1:</strong> Child must be 5+ years of age.</li>
              <li><strong>Grade 2-10:</strong> Valid transfer clearance certificate from a recognized board.</li>
              <li><strong>Grade 11-12:</strong> Minimum aggregate score of 75% in secondary boards.</li>
            </ul>
          </div>
        </div>

        {/* Online Admission Form */}
        <div id="admission-form-wrapper" className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl relative">
          <div className="absolute top-6 right-6 text-indigo-600 opacity-20">
            <Sparkles className="w-12 h-12" />
          </div>

          <h2 className="text-2xl font-extrabold font-sans text-slate-900 mb-6">Online Admission Form</h2>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-center py-12"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-sans font-extrabold text-2xl text-slate-900">Application Submitted!</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Thank you! Your application has been logged into the school portal database securely.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl inline-block border border-slate-100 text-slate-700">
                  <span className="text-[10px] uppercase font-mono tracking-widest block text-slate-400">Application Ref ID</span>
                  <span className="text-xs font-mono font-bold">{submitted}</span>
                </div>
                <button
                  onClick={() => setSubmitted(null)}
                  className="block w-full py-3 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all"
                >
                  Apply for Another Student
                </button>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {error && (
                  <div className="p-3 bg-rose-50 text-rose-600 text-xs rounded-xl border border-rose-100 font-medium">
                    {error}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="Enter student name"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Grade Requested *</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
                    >
                      {gradeOptions.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="Father/Mother full name"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Parent Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="parent@example.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Parent Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +1 (555) 019-2834"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Residential Address *</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter complete current home address"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Previous School (Optional)</label>
                  <input
                    type="text"
                    value={formData.previousSchool}
                    onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                    placeholder="E.g. St. James Academy"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-semibold text-xs shadow-lg shadow-indigo-500/15 transition-all cursor-pointer"
                >
                  {loading ? (
                    'Submitting Securely...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Application
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Fee Structure Table */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-bold">Transparency</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-900 tracking-tight">Fee Structure 2026-27</h2>
        </div>

        <div className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm bg-white max-w-4xl mx-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 font-mono uppercase text-slate-400 text-[10px] font-bold">
                <th className="px-6 py-4">Grade Group</th>
                <th className="px-6 py-4">Admission Fee (One-Time)</th>
                <th className="px-6 py-4">Tuition Fee (Quarterly)</th>
                <th className="px-6 py-4">Lab & Tech Charges (Annual)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="px-6 py-4 font-bold text-slate-900">Nursery to Upper KG</td>
                <td className="px-6 py-4">$300</td>
                <td className="px-6 py-4">$300</td>
                <td className="px-6 py-4">$150</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-slate-900">Grade 1 to Grade 5</td>
                <td className="px-6 py-4">$450</td>
                <td className="px-6 py-4">$450</td>
                <td className="px-6 py-4">$200</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-slate-900">Grade 6 to Grade 10</td>
                <td className="px-6 py-4">$600</td>
                <td className="px-6 py-4">$600</td>
                <td className="px-6 py-4">$300</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-slate-900">Grade 11 & Grade 12</td>
                <td className="px-6 py-4">$800</td>
                <td className="px-6 py-4">$800</td>
                <td className="px-6 py-4">$400</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </motion.div>
  );
}
