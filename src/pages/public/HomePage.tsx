import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Globe,
  Layers,
  Megaphone,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const CATEGORY_CARDS = [
  {
    title: 'Website Services',
    icon: Globe,
    description:
      'Business websites, e-commerce storefronts, redesigns, and focused landing pages built for mobile and desktop.',
    accent: 'text-[#3478F6] bg-blue-50',
  },
  {
    title: 'Social Media',
    icon: Share2,
    description:
      'Consistent channel management, branded post design, short-form reels editing, and engaging local content.',
    accent: 'text-[#FF9F1C] bg-orange-50',
  },
  {
    title: 'Digital Marketing',
    icon: Megaphone,
    description:
      'Local SEO optimization, Google Business Profile setup, targeted digital ads, and practical marketing strategy.',
    accent: 'text-[#3478F6] bg-blue-50',
  },
  {
    title: 'Additional Services',
    icon: Sparkles,
    description:
      'Logo and branding, graphic design, print/QR menu design, and Swiggy & Zomato onboarding assistance.',
    accent: 'text-[#FF9F1C] bg-orange-50',
  },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Build Your Service Mix',
    description:
      'Explore individual services or start from a Starter, Growth, or Premium combination tailored to your goals.',
  },
  {
    title: 'Submit a Business Enquiry',
    step: '02',
    description:
      'Share your business profile, requirements, and timeline. Receive a unique enquiry reference immediately.',
  },
  {
    step: '03',
    title: 'Track 7 Clear Milestones',
    titleAlt: '',
    description:
      'Follow progress inside your Client Portal from Requirements Collection and UI/UX Design through Delivery.',
  },
  {
    step: '04',
    title: 'Launch with Confidence',
    description:
      'Review deliverables, confirm final testing, and receive organized digital assets ready for your customers.',
  },
];

const WHY_POINTS = [
  {
    icon: Layers,
    title: 'Custom-Fit Combinations',
    description:
      'Pick only the digital services your business actually needs right now—without rigid one-size-fits-all bundles.',
  },
  {
    icon: Compass,
    title: 'Designed for Local Growth',
    description:
      'From Google Business Profile discovery to Swiggy/Zomato onboarding and social reels, every service fits local commerce.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparent Milestone Tracking',
    description:
      'See real-time milestone statuses, pending requirements, and agency updates directly in your dedicated client dashboard.',
  },
  {
    icon: TrendingUp,
    title: 'Coordinated Specialist Team',
    description:
      'Web developers, designers, and marketing strategists collaborate in one structured workspace to keep delivery on schedule.',
  },
];

export const HomePage: React.FC = () => {
  const { currentUser } = useApp();

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#102A43] text-white">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#3478F6] blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-[#FF9F1C] blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-22 lg:py-26">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#FF9F1C] mb-6">
                <span className="w-2 h-2 rounded-full bg-[#FF9F1C]" />
                Digital Agency Platform for Small & Local Businesses
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight leading-[1.1] text-white">
                Your Business.{' '}
                <span className="text-[#3478F6]">Our Digital Drive.</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
                LocalLift empowers cafés, salons, coaching centers, clinics, and neighborhood shops to build credible websites, stay active on social media, and attract local customers online.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#3478F6] hover:bg-blue-600 text-white font-semibold text-sm shadow-lg shadow-blue-900/30 transition-all"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/services#builder"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF9F1C] hover:bg-[#e88b0c] text-[#102A43] font-bold text-sm transition-all"
                >
                  <span>Get Started</span>
                </Link>
                <Link
                  to={currentUser ? '/client/dashboard' : '/login'}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/25 hover:bg-white/10 text-white font-semibold text-sm transition-colors"
                >
                  <span>{currentUser ? 'Open Portal' : 'Login'}</span>
                </Link>
              </div>
            </div>

            {/* Workflow Preview Card (non-fabricated UI showcase) */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-white text-[#102A43] p-6 shadow-2xl border border-slate-200/80">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#3478F6]">
                      Client Portal Preview
                    </p>
                    <h2 className="text-base font-bold mt-0.5">
                      Structured 7-Milestone Delivery
                    </h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-[#3478F6]">
                    Live Tracking
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    { name: 'Requirements Collection', status: 'Completed', color: 'bg-emerald-500' },
                    { name: 'Planning & Architecture', status: 'Completed', color: 'bg-emerald-500' },
                    { name: 'UI/UX Design', status: 'In Progress', color: 'bg-[#3478F6]' },
                    { name: 'Development & Setup', status: 'Upcoming', color: 'bg-slate-200' },
                    { name: 'Review, Testing & Delivery', status: 'Upcoming', color: 'bg-slate-200' },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                        <span className="text-sm font-medium text-[#102A43]">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Custom packages • Enquiry-first workflow</span>
                  <Link
                    to="/login"
                    className="font-semibold text-[#3478F6] hover:underline"
                  >
                    Try Demo Portal →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#3478F6]">
                What We Do
              </p>
              <h2 className="mt-1 text-3xl font-bold text-[#102A43]">
                Focused Digital Services for Local Businesses
              </h2>
              <p className="mt-2 text-slate-600 max-w-2xl">
                Combine web development, social media, local search visibility, and onboarding assistance into a customized request.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3478F6] hover:text-blue-700"
            >
              <span>Build a custom package</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORY_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  to="/services"
                  className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-[#3478F6]/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${card.accent}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-[#102A43] group-hover:text-[#3478F6] transition-colors">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-[#3478F6]">
                    View services <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How LocalLift Works */}
      <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-[#3478F6]">
              Simple Process
            </p>
            <h2 className="mt-1 text-3xl font-bold text-[#102A43]">
              How LocalLift Works
            </h2>
            <p className="mt-2 text-slate-600">
              A clear, enquiry-led process from initial service selection to transparent milestone delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKFLOW_STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#102A43] text-[#FF9F1C] font-display font-bold text-sm">
                  {item.step}
                </span>
                <h3 className="mt-4 text-base font-bold text-[#102A43]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose LocalLift */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#FF9F1C]">
                Why LocalLift
              </p>
              <h2 className="mt-1 text-3xl font-bold text-[#102A43] leading-snug">
                Built Around the Real Needs of Neighborhood Businesses
              </h2>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Small businesses rarely need bloated agency retainers. They need clear digital foundations, responsive communication, and visibility into every stage of delivery.
              </p>
              <div className="mt-6 space-y-2.5">
                {[
                  'No upfront commitments — start with a tailored enquiry',
                  'Dedicated client dashboard for milestone visibility',
                  'Unified team execution across web, design & marketing',
                ].map((bullet) => (
                  <div key={bullet} className="flex items-center gap-2.5 text-sm font-medium text-[#102A43]">
                    <CheckCircle2 className="w-4 h-4 text-[#3478F6] shrink-0" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {WHY_POINTS.map((point) => {
                const Icon = point.icon;
                return (
                  <div
                    key={point.title}
                    className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3478F6] flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#102A43]">
                      {point.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-slate-50 border-t border-slate-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#102A43] text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Ready to Build Your Digital Presence?
              </h2>
              <p className="mt-2 text-slate-300 text-sm sm:text-base">
                Select your preferred services in our interactive package builder or reach out with questions about your business goals.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                to="/services"
                className="px-5 py-3 rounded-xl bg-[#FF9F1C] hover:bg-[#e88b0c] text-[#102A43] font-bold text-sm transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/contact"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/15 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
