import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  Eye,
  HeartHandshake,
  Layers,
  Target,
  Zap,
} from 'lucide-react';

const PROBLEMS_WE_SOLVE = [
  {
    title: 'Invisible on Local Search & Maps',
    description:
      'Many great neighborhood businesses rely purely on word-of-mouth because their Google Business Profile or website is incomplete or outdated.',
  },
  {
    title: 'Fragmented Vendors & Unclear Progress',
    description:
      'Hiring separate freelancers for logos, websites, and social media often leads to inconsistent branding and zero visibility into deadlines.',
  },
  {
    title: 'Generic Templates That Don’t Fit Local Commerce',
    description:
      'Small businesses—from cafés needing QR menus & delivery onboarding to coaching centers needing enquiry forms—need practical, goal-driven solutions.',
  },
];

const GROWTH_APPROACH = [
  {
    icon: Target,
    title: 'Discovery & Practical Scope',
    description:
      'We start by listening to your business category, neighborhood audience, and immediate priorities—no unnecessary complexity.',
  },
  {
    icon: Layers,
    title: 'Cohesive Visual & Web Foundations',
    description:
      'Your logo, website, social media templates, and map listings work together with one clear, trustworthy brand identity.',
  },
  {
    icon: Zap,
    title: 'Milestone-Based Transparency',
    description:
      'Every project follows seven clear milestones inside the LocalLift client portal so you always know what is completed and what comes next.',
  },
  {
    icon: HeartHandshake,
    title: 'Guided Handover & Ongoing Support',
    description:
      'Once launched, we ensure your team can confidently manage listings, enquiries, and ongoing digital campaigns.',
  },
];

export const AboutPage: React.FC = () => {
  return (
    <div className="page-enter">
      {/* Header */}
      <section className="bg-[#102A43] text-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-wider text-[#FF9F1C]">
            About LocalLift
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Helping Small Businesses Build Credible Digital Momentum
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-3xl leading-relaxed">
            LocalLift is a digital agency platform purpose-built to connect small and local businesses with structured website development, social media management, local marketing, and brand setup—managed transparently from enquiry to delivery.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-slate-200 p-8 bg-slate-50/50">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#3478F6] flex items-center justify-center mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#102A43]">Our Mission</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              To make modern digital infrastructure—websites, local search presence, social storytelling, and online platform onboarding—accessible, organized, and stress-free for small business owners.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-8 bg-slate-50/50">
            <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#FF9F1C] flex items-center justify-center mb-4">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#102A43]">Our Vision</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              A digital ecosystem where every neighborhood café, salon, clinic, coaching center, and independent store can compete confidently online with clear processes and reliable creative execution.
            </p>
          </div>
        </div>
      </section>

      {/* Problems We Solve */}
      <section className="py-16 bg-slate-50 border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-[#3478F6]">
              The Challenge
            </p>
            <h2 className="mt-1 text-3xl font-bold text-[#102A43]">
              Problems We Solve for Local Businesses
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROBLEMS_WE_SOLVE.map((item, idx) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs"
              >
                <span className="text-xs font-bold text-[#3478F6] bg-blue-50 px-2.5 py-1 rounded-full">
                  Challenge 0{idx + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold text-[#102A43]">
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

      {/* Digital Growth Approach */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-[#FF9F1C]">
              Methodology
            </p>
            <h2 className="mt-1 text-3xl font-bold text-[#102A43]">
              Our Digital Growth Approach
            </h2>
            <p className="mt-2 text-slate-600">
              How LocalLift turns a custom service enquiry into measurable, organized progress.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {GROWTH_APPROACH.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="rounded-2xl border border-slate-200 p-6 flex items-start gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#102A43] text-white flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#FF9F1C]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#102A43]">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 rounded-2xl bg-blue-50/70 border border-blue-100 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#102A43]">
                Explore Services Tailored to Your Business
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Combine web, social, marketing, and onboarding services using our interactive package builder.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#3478F6] text-white text-sm font-semibold hover:bg-blue-700 transition-colors shrink-0"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
