import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, Sparkles, Briefcase, GraduationCap, Trophy,
  Rocket, DollarSign, Target, Clock, CheckCircle2, XCircle, AlertCircle,
  Loader2, ExternalLink, MapPin, Calendar,
} from "lucide-react";
import {
  getOpportunities, addOpportunity, type Opportunity, type OpportunityType, type OpportunityStatus,
  isDeadlineApproaching, isOverdue,
} from "../utils/storage";
import { toast } from "sonner";

const typeIcons: Record<OpportunityType, typeof Briefcase> = {
  Job: Briefcase, Scholarship: GraduationCap, Grant: DollarSign,
  Internship: Target, Fellowship: Rocket, Competition: Trophy,
};

const statusColors: Record<OpportunityStatus, string> = {
  "In Review": "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Applied: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  Shortlisted: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  Accepted: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Rejected: "bg-red-500/15 text-red-300 border-red-500/30",
};

const allTypes: OpportunityType[] = ["Job", "Scholarship", "Grant", "Internship", "Fellowship", "Competition"];
const allStatuses: OpportunityStatus[] = ["In Review", "Applied", "Shortlisted", "Accepted", "Rejected"];

function daysUntil(deadline: string): number {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function formatDeadline(deadline: string): string {
  const d = daysUntil(deadline);
  if (d < 0) return `${Math.abs(d)}d overdue`;
  if (d === 0) return "Today";
  if (d === 1) return "Tomorrow";
  return `${d} days`;
}

export default function Dashboard() {
  const [opps, setOpps] = useState<Opportunity[]>(getOpportunities());
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<OpportunityType | "All">("All");
  const [statusFilter, setStatusFilter] = useState<OpportunityStatus | "All">("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAIParser, setShowAIParser] = useState(false);

  const filtered = useMemo(() => {
    return opps.filter((o) => {
      const matchSearch = !search || o.title.toLowerCase().includes(search.toLowerCase()) || o.organization.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "All" || o.type === typeFilter;
      const matchStatus = statusFilter === "All" || o.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [opps, search, typeFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: opps.length,
    inReview: opps.filter((o) => o.status === "In Review").length,
    applied: opps.filter((o) => o.status === "Applied").length,
    accepted: opps.filter((o) => o.status === "Accepted").length,
    urgent: opps.filter((o) => isDeadlineApproaching(o.deadline, o.status) || isOverdue(o.deadline, o.status)).length,
  }), [opps]);

  const refresh = () => setOpps(getOpportunities());

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">Track and manage your opportunities</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAIParser(true)}
              className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/10"
            >
              <Sparkles className="h-4 w-4" />
              AI Parse
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Add Manual
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { label: "Total", value: stats.total, icon: Target, color: "text-slate-300" },
            { label: "In Review", value: stats.inReview, icon: Clock, color: "text-amber-400" },
            { label: "Applied", value: stats.applied, icon: CheckCircle2, color: "text-blue-400" },
            { label: "Accepted", value: stats.accepted, icon: CheckCircle2, color: "text-emerald-400" },
            { label: "Urgent", value: stats.urgent, icon: AlertCircle, color: "text-red-400" },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{s.label}</span>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className={`mt-2 text-2xl font-bold ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search opportunities..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as OpportunityType | "All")}
                className="appearance-none rounded-lg border border-slate-700 bg-slate-800/50 py-2.5 pl-10 pr-8 text-sm text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="All">All Types</option>
                {allTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OpportunityStatus | "All")}
              className="appearance-none rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="All">All Status</option>
              {allStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Cards Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 py-20">
            <Target className="mb-4 h-12 w-12 text-slate-600" />
            <p className="text-lg font-medium text-slate-400">No opportunities found</p>
            <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or add a new one</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((opp, i) => {
                const TypeIcon = typeIcons[opp.type];
                const approaching = isDeadlineApproaching(opp.deadline, opp.status);
                const overdue = isOverdue(opp.deadline, opp.status);
                return (
                  <motion.div
                    key={opp.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                  >
                    <Link
                      to={`/opportunity/${opp.id}`}
                      className="group block h-full rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition-all hover:border-slate-700 hover:bg-slate-900/80 hover:shadow-lg"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800">
                          <TypeIcon className="h-4 w-4 text-emerald-400" />
                        </div>
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[opp.status]}`}>
                          {opp.status}
                        </span>
                      </div>
                      <h3 className="mb-1 text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                        {opp.title}
                      </h3>
                      <p className="mb-3 text-xs text-slate-400 line-clamp-1">{opp.organization}</p>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <MapPin className="h-3 w-3" />
                          <span className="line-clamp-1">{opp.location}</span>
                        </div>
                        <div className={`flex items-center gap-1 ${overdue ? "text-red-400" : approaching ? "text-amber-400" : "text-slate-500"}`}>
                          <Calendar className="h-3 w-3" />
                          <span>{formatDeadline(opp.deadline)}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && <AddModal onClose={() => setShowAddModal(false)} onAdd={refresh} />}
      </AnimatePresence>

      {/* AI Parser Modal */}
      <AnimatePresence>
        {showAIParser && <AIParserModal onClose={() => setShowAIParser(false)} onAdd={refresh} />}
      </AnimatePresence>
    </main>
  );
}

function AddModal({ onClose, onAdd }: { onClose: () => void; onAdd: () => void }) {
  const [form, setForm] = useState({
    title: "", organization: "", type: "Job" as OpportunityType,
    status: "In Review" as OpportunityStatus, deadline: "", location: "",
    eligibility: "", requirements: "", description: "", applicationLink: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.organization || !form.deadline) {
      toast.error("Please fill in required fields");
      return;
    }
    addOpportunity({
      ...form,
      requirements: form.requirements.split(",").map((r) => r.trim()).filter(Boolean),
    });
    toast.success("Opportunity added!");
    onAdd();
    onClose();
  };

  const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-xl font-bold text-white">Add Opportunity</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Software Engineer" className={inputClass} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Organization *</label>
              <input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="e.g. Google" className={inputClass} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as OpportunityType })} className={inputClass}>
                {allTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as OpportunityStatus })} className={inputClass}>
                {allStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Deadline *</label>
              <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className={inputClass} required />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Location</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Remote, New York" className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Eligibility</label>
            <textarea value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} rows={2} className={inputClass} placeholder="Who can apply?" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Requirements (comma-separated)</label>
            <input value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder="Resume, Cover Letter, GPA 3.5+" className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Application Link</label>
            <input value={form.applicationLink} onChange={(e) => setForm({ ...form, applicationLink: e.target.value })} placeholder="https://..." className={inputClass} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-slate-700 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800">Cancel</button>
            <button type="submit" className="flex-1 rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400">Add Opportunity</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function AIParserModal({ onClose, onAdd }: { onClose: () => void; onAdd: () => void }) {
  const [input, setInput] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState<Opportunity | null>(null);
  const [step, setStep] = useState(0);

  const steps = ["Analyzing text...", "Extracting details...", "Identifying requirements...", "Structuring data..."];

  const simulateParse = () => {
    if (!input.trim()) { toast.error("Please paste some text or a URL"); return; }
    setParsing(true);
    setStep(0);

    const interval = setInterval(() => {
      setStep((s) => {
        if (s >= 3) {
          clearInterval(interval);
          setParsing(false);
          const mockResult: Opportunity = {
            id: "ai-" + Date.now(),
            title: input.length > 50 ? input.slice(0, 50) + "..." : input.slice(0, 30) + " Opportunity",
            organization: "Extracted Organization",
            type: "Scholarship",
            status: "In Review",
            deadline: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
            location: "Remote / Global",
            eligibility: "Open to all qualified applicants",
            requirements: ["Valid ID", "Application form", "Recommendation letter", "Personal statement"],
            description: "AI-extracted opportunity details from the provided text. Review and edit before saving.",
            applicationLink: "https://example.com/apply",
            notes: "",
            createdAt: new Date().toISOString().split("T")[0],
          };
          setParsed(mockResult);
          return 3;
        }
        return s + 1;
      });
    }, 800);
  };

  const handleSave = () => {
    if (parsed) {
      addOpportunity(parsed);
      toast.success("Opportunity added from AI parse!");
      onAdd();
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/30">
            <Sparkles className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Opportunity Parser</h2>
            <p className="text-xs text-slate-400">Paste text or a URL to extract opportunity details</p>
          </div>
        </div>

        {!parsed ? (
          <>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste opportunity text, job description, scholarship details, or a URL here..."
              rows={6}
              className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            {parsing ? (
              <div className="mb-4 space-y-2">
                {steps.map((s, i) => (
                  <motion.div
                    key={s}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: i <= step ? 1 : 0.3 }}
                    className="flex items-center gap-2 text-sm"
                  >
                    {i < step ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : i === step ? (
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-slate-600" />
                    )}
                    <span className={i <= step ? "text-white" : "text-slate-500"}>{s}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <button
                onClick={simulateParse}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                <Sparkles className="h-4 w-4" />
                Parse with AI
              </button>
            )}
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
              <p className="text-xs font-medium text-emerald-400">✓ Parsed successfully</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 space-y-2">
              <p className="text-sm font-semibold text-white">{parsed.title}</p>
              <p className="text-xs text-slate-400">{parsed.organization} • {parsed.type}</p>
              <p className="text-xs text-slate-500">Deadline: {parsed.deadline} • {parsed.location}</p>
              <p className="text-xs text-slate-400 line-clamp-2">{parsed.description}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {parsed.requirements.map((r) => (
                  <span key={r} className="rounded-full bg-slate-700/50 px-2 py-0.5 text-xs text-slate-300">{r}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 rounded-lg border border-slate-700 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800">Discard</button>
              <button onClick={handleSave} className="flex-1 rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400">Save Opportunity</button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
