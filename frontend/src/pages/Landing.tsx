import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Briefcase, GraduationCap, Trophy, Rocket,
  Sparkles, Target, Clock, Shield, Zap, Globe, Layers,
} from "lucide-react";

const features = [
  { icon: Sparkles, title: "AI-Powered Extraction", desc: "Paste any link or text and watch as our AI parses opportunities into structured, actionable data instantly.", span: "md:col-span-2", bg: "from-emerald-500/10 to-emerald-500/5" },
  { icon: Clock, title: "Smart Deadlines", desc: "Never miss a deadline with intelligent reminders and countdown badges.", span: "md:col-span-1", bg: "from-blue-500/10 to-blue-500/5" },
  { icon: Layers, title: "Multi-Type Support", desc: "Jobs, scholarships, grants, fellowships, internships, and competitions all in one place.", span: "md:col-span-1", bg: "from-violet-500/10 to-violet-500/5" },
  { icon: Target, title: "Status Tracking", desc: "Track every opportunity from discovery to acceptance with visual status pipelines.", span: "md:col-span-1", bg: "from-amber-500/10 to-amber-500/5" },
  { icon: Globe, title: "Personal Notes", desc: "Add notes, requirements, and eligibility criteria to every opportunity you track.", span: "md:col-span-2", bg: "from-rose-500/10 to-rose-500/5" },
];

const types = [
  { icon: Briefcase, label: "Jobs" },
  { icon: GraduationCap, label: "Scholarships" },
  { icon: Trophy, label: "Competitions" },
  { icon: Rocket, label: "Fellowships" },
];

export default function Landing() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNDgsIDE2MywgMTg0LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
                <Zap className="h-3.5 w-3.5" />
                AI-Powered Opportunity Tracking
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Never miss an{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                  opportunity
                </span>{" "}
                again
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-400">
                Track jobs, scholarships, grants, and fellowships in one place. Let AI extract the details while you focus on what matters - applying.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="group flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-slate-950 transition-all hover:bg-emerald-400 hover:shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98]"
                >
                  Start tracking free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-800 active:scale-[0.98]"
                >
                  <Shield className="h-4 w-4" />
                  Sign in
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur">
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs text-slate-500">opportunity-tracker.app</span>
                </div>
                <div className="space-y-3">
                  {[
                    { title: "Software Engineer Intern", org: "Google", status: "In Review", color: "bg-amber-500/20 text-amber-300", deadline: "3 days" },
                    { title: "Mastercard Scholars", org: "Mastercard Foundation", status: "Applied", color: "bg-blue-500/20 text-blue-300", deadline: "14 days" },
                    { title: "Thiel Fellowship", org: "Thiel Foundation", status: "Accepted", color: "bg-emerald-500/20 text-emerald-300", deadline: "Closed" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.15 }}
                      className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/50 p-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{item.title}</p>
                        <p className="text-xs text-slate-400">{item.org}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.color}`}>
                          {item.status}
                        </span>
                        <span className="text-xs text-slate-500">{item.deadline}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />
              <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-blue-500/20 blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Types strip */}
      <section className="border-y border-slate-800/60 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {types.map((t) => (
              <div key={t.label} className="flex items-center gap-2.5 text-slate-400">
                <t.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to{" "}
            <span className="text-emerald-400">land your next opportunity</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            From discovery to acceptance, track every detail with intelligent tools designed for ambitious people.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br ${f.bg} p-6 transition-all hover:border-slate-700 ${f.span}`}
            >
              <f.icon className="mb-4 h-8 w-8 text-emerald-400" />
              <h3 className="mb-2 text-lg font-semibold text-white">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800/60">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/50 p-10 text-center sm:p-16"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to take control of your future?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-400">
                Join thousands of ambitious individuals who never let an opportunity slip through the cracks.
              </p>
              <Link
                to="/register"
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-sm font-semibold text-slate-950 transition-all hover:bg-emerald-400 hover:shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98]"
              >
                Get started for free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-500 sm:px-6">
          Opportunity Tracker. Built for ambitious minds.
        </div>
      </footer>
    </main>
  );
}
