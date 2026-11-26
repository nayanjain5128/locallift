import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, FolderKanban, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OurWorkPage: React.FC = () => {
  const { db } = useApp();
  const portfolio = db.portfolio;

  return (
    <div className="page-enter">
      <section className="bg-[#102A43] text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-wider text-[#FF9F1C]">
            Our Work
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Client Portfolio & Digital Launches
          </h1>
          <p className="mt-3 text-slate-200 max-w-2xl">
            Verified digital experiences crafted for local businesses—published only as client projects are completed and approved for showcase.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {portfolio.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-16 text-center max-w-3xl mx-auto">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-[#3478F6] mb-5">
                <FolderKanban className="w-8 h-8" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#3478F6] text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Portfolio Showcase
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#102A43] max-w-xl mx-auto leading-snug">
                Our portfolio is growing. We look forward to showcasing the digital experiences we create for businesses.
              </h2>
              <p className="mt-3 text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                We only publish verified, completed client work with business owner permission. Looking to launch your website or digital presence with LocalLift?
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#3478F6] text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  <span>Build Your Service Enquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-[#102A43] text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  <span>Talk With Us</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#3478F6]">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        {item.completedAt}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#102A43]">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      {item.businessName}
                    </p>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                      {item.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.servicesProvided.map((srv) => (
                        <span
                          key={srv}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                        >
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                  {item.liveUrl && (
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#3478F6] hover:underline"
                    >
                      <span>Visit Project</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
