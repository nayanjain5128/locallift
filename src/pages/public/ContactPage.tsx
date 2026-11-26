import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { submitContactMessage } from '../../services/storageService';

const FAQS = [
  {
    q: 'How does LocalLift handle custom service requests?',
    a: 'Select the services you need on the Services page and submit an enquiry. Our team reviews your business requirements, accepts suitable enquiries, and converts them into a tracked project with clear milestones.',
  },
  {
    q: 'Do I have to pay online when selecting a service package?',
    a: 'No. Service selection creates a tailored business enquiry for scope confirmation and planning—never an automated purchase.',
  },
  {
    q: 'How can I track my project once it starts?',
    a: 'After your enquiry is converted into a project, you can log into the Client Portal to view all seven milestones, completion percentages, pending requirements, and team updates.',
  },
  {
    q: 'Can I modify a Starter, Growth, or Premium combination?',
    a: 'Yes. Any predefined combination acts as a convenient starting point—you can freely add or remove individual services before submitting your enquiry.',
  },
];

export const ContactPage: React.FC = () => {
  const { showToast, refreshData } = useApp();
  const [type, setType] = useState<'General Enquiry' | 'Business Support'>(
    'General Enquiry'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('Please complete all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    const saved = submitContactMessage({
      type,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      businessName: businessName.trim() || undefined,
      subject: subject.trim(),
      message: message.trim(),
    });
    refreshData();
    setSubmittedId(saved.id);
    setName('');
    setEmail('');
    setPhone('');
    setBusinessName('');
    setSubject('');
    setMessage('');
    showToast('Message received', 'success', `Reference ID: ${saved.id}`);
  };

  return (
    <div className="page-enter">
      <section className="bg-[#102A43] text-white py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-wider text-[#FF9F1C]">
            Contact & Help
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold">
            We’re Here to Help Your Business Get Started
          </h1>
          <p className="mt-3 text-slate-200 max-w-2xl">
            Send a general question or request support for an ongoing LocalLift business account.
          </p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white shadow-xs">
              <h2 className="text-xl font-bold text-[#102A43]">
                Send Us a Message
              </h2>

              <div className="mt-4 inline-flex rounded-xl bg-slate-100 p-1">
                {(['General Enquiry', 'Business Support'] as const).map(
                  (opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setType(opt)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        type === opt
                          ? 'bg-white text-[#102A43] shadow-xs'
                          : 'text-slate-600 hover:text-[#102A43]'
                      }`}
                    >
                      {opt}
                    </button>
                  )
                )}
              </div>

              {submittedId && (
                <div className="mt-5 rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-emerald-900">
                    <p className="font-bold">
                      Message Sent ({submittedId})
                    </p>
                    <p className="text-xs mt-0.5">
                      Your {type.toLowerCase()} has been saved in the LocalLift prototype portal.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <p className="mt-4 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5">
                  {error}
                </p>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#102A43] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#102A43] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@business.example"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#102A43] mb-1">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 ..."
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#102A43] mb-1">
                      Business Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Your business"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={
                      type === 'Business Support'
                        ? 'e.g., Question regarding milestone review'
                        : 'e.g., Inquiry about website & local SEO'
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102A43] mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can LocalLift assist you?"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3478F6]"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#3478F6] hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Send {type}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Placeholder Details + FAQ */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#102A43]">
                  Contact Channels
                </h3>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Placeholders
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#3478F6] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Support Email (Placeholder)
                  </p>
                  <p className="text-sm font-semibold text-[#102A43]">
                    contact@locallift.example
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#3478F6] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Phone Line (Placeholder)
                  </p>
                  <p className="text-sm font-semibold text-[#102A43]">
                    +91 00000 00000
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#3478F6] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Prototype Notice
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Placeholder contact details are shown for demonstration purposes only.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-[#3478F6]" />
                <h3 className="text-base font-bold text-[#102A43]">
                  Frequently Asked Questions
                </h3>
              </div>

              <div className="space-y-2.5">
                {FAQS.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={item.q}
                      className="rounded-xl border border-slate-200 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between gap-2 text-xs font-semibold text-[#102A43] hover:bg-slate-50"
                      >
                        <span>{item.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 shrink-0 text-slate-400 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-3 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2.5 bg-slate-50/50">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
