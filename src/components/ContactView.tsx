import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Mail, MapPin, Phone, Send, Sparkles } from 'lucide-react';
import { SchoolSettings } from '../types';

interface ContactViewProps {
  settings: SchoolSettings | null;
}

export default function ContactView({ settings }: ContactViewProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill in all the fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Message submission failed on server.');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
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
        <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-bold block">Support Desk</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-sans text-slate-900 tracking-tight">Contact Us</h1>
        <p className="text-sm text-slate-500">We are always available to help parents, students, and stakeholders.</p>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Contact info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold font-sans text-slate-900">EduFuture Administration</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              If you have queries regarding school transport, fee waivers, prospectus collections, or athletic coaching schedules, please get in touch.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 items-center">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Campus Address</h4>
                <p className="text-xs text-slate-700 font-medium">{settings?.address || '123 Education Boulevard, Knowledge City, State - 452001'}</p>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 items-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Admissions Hotline</h4>
                <p className="text-xs text-slate-700 font-medium">{settings?.phone || '+1 (555) 019-2834'}</p>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 items-center">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Email Inbox</h4>
                <p className="text-xs text-slate-700 font-medium">{settings?.email || 'info@edufuture.edu.gcp'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl relative">
          <div className="absolute top-6 right-6 text-indigo-600 opacity-20">
            <Sparkles className="w-12 h-12" />
          </div>

          <h2 className="text-2xl font-extrabold font-sans text-slate-900 mb-6">Send an Inquiry Message</h2>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-sans font-extrabold text-2xl text-slate-900 font-sans">Message Dispatched!</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed mt-1">
                    Your inquiry has been successfully sent to the school administrative dashboard. We will get back to you shortly.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-xs rounded-xl transition-all"
                >
                  Send Another Inquiry
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="E.g. Jack Ryan"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Your Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jack@example.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Inquiry Subject *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="E.g. Bus transport availability or fee details"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Your Detailed Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your complete inquiry here..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-xl text-xs outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-semibold text-xs shadow-lg shadow-indigo-500/15 transition-all cursor-pointer"
                >
                  {loading ? (
                    'Sending Message Securely...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Inquiry Message
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Map Mockup */}
      <section className="space-y-6 max-w-4xl mx-auto">
        <h3 className="font-sans font-extrabold text-slate-900 text-lg text-center">Interactive Direction Coordinates</h3>
        <div className="h-[350px] rounded-3xl overflow-hidden border border-slate-100 shadow-md relative bg-slate-100 flex items-center justify-center">
          {/* A styled responsive grid of road directions */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#6366f1_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
          <div className="absolute inset-x-0 h-0.5 bg-indigo-100 top-1/3" />
          <div className="absolute inset-x-0 h-0.5 bg-indigo-100 top-2/3" />
          <div className="absolute inset-y-0 w-0.5 bg-indigo-100 left-1/3" />
          <div className="absolute inset-y-0 w-0.5 bg-indigo-100 left-2/3" />
          
          <div className="absolute top-1/4 left-1/4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[9px] font-bold font-mono tracking-wider shadow text-indigo-600">
            NATURE AVENUE
          </div>
          <div className="absolute bottom-1/4 right-1/4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[9px] font-bold font-mono tracking-wider shadow text-indigo-600">
            KNOWLEDGE BOULEVARD
          </div>

          <div className="relative z-10 text-center bg-white p-6 rounded-2xl shadow-xl border border-indigo-50 max-w-sm space-y-3 mx-4">
            <MapPin className="w-10 h-10 text-rose-500 mx-auto animate-bounce" />
            <h4 className="font-bold text-sm text-slate-900 font-sans">EduFuture Public School Location</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              {settings?.address || '123 Education Boulevard, Knowledge City, State - 452001'}. Adjacent to Global Science Park.
            </p>
          </div>
        </div>
      </section>

    </motion.div>
  );
}
