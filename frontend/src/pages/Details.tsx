import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, ExternalLink, MapPin, Calendar, Edit3, Trash2,
  Briefcase, GraduationCap, Trophy, Rocket, DollarSign, Target,
  CheckCircle2, Clock, XCircle, AlertCircle, FileText, Users,
} from "lucide-react";
import {
  getOpportunity, updateOpportunity, deleteOpportunity,
  type OpportunityType, type OpportunityStatus, isDeadlineApproaching, isOverdue,
} from "../utils/storage";
import { toast } from "sonner";

const typeIcons: Record<OpportunityType, typeof Briefcase> = {
  Job: Briefcase, Scholarship: GraduationCap, Grant: DollarSign,
  Internship: Target, Fellowship: Rocket, Competition: Trophy,
};

const statusConfig: Record<OpportunityStatus, { color: string; icon: typeof CheckCircle2 }> = {
  "In Review": { color: "bg-amber-500/15 text-amber-300 border-amber-500/30", icon: Clock },
  Applied: { color: "bg-blue-500/15 text-blue-300 border-blue-500/30", icon: CheckCircle2 },
  Shortlisted: { color: "bg-violet-500/15 text-violet-300 border-violet-500/30", icon: Target },
  Accepted: { color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", icon: CheckCircle2 },
  Rejected: { color: "bg-red-500/15 text-red-300 border-red-500/30", icon: XCircle },
};

const allStatuses: OpportunityStatus[] = ["In Review", "Applied", "Shortlisted", "Accepted", "Rejected"];

function daysUntil(deadline: string): number {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export default function Details() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [opp, setOpp] = useState(getOpportunity(id || ""));
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState(opp?.notes || "");
  const [status, setStatus] = useState<OpportunityStatus>(opp?.status || "In Review");

  if (!opp) {
    return (
      <main className="flex min-h-screen items-center justify-center pt-16">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-slate-600" />
          <h2 className="text-xl font-semibold text-white">Opportunity not found</h2>
          <p className="mt-2 text-sm text-slate-400">This opportunity may have been deleted</p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const TypeIcon = typeIcons[opp.type];
  const statusInfo = statusConfig[status];
  const StatusIcon = statusInfo.icon;
  const approaching = isDeadlineApproaching(opp.deadline, status);
  const overdue = isOverdue(opp.deadline, status);
  const days = daysUntil(opp.deadline);

  const handleSave = () => {
    updateOpportunity(opp.id, { notes, status });
    setOpp({ ...opp, notes, status });
    setEditing(false);
    toast.success("Changes saved");
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this opportunity?")) {
      deleteOpportunity(opp.id);
      toast.success("Opportunity deleted");
      navigate("/dashboard");
    }
  };

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Back button */}
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8"
        >
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 ring-1 ring-slate-700">
                <TypeIcon className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white sm:text-2xl">{opp.title}</h1>
                <p className="mt-1 text-sm text-slate-400">{opp.organization}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(!editing)}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <Edit3 className="h-4 w-4" />
                {editing ? "Cancel" : "Edit"}
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>

          {/* Status & Deadline */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            {editing ? (
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OpportunityStatus)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
              >
                {allStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${statusInfo.color}`}>
                <StatusIcon className="h-3.5 w-3.5" />
                {status}
              </span>
            )}
            <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${
              overdue ? "border-red-500/30 bg-red-500/15 text-red-300" :
              approaching ? "border-amber-500/30 bg-amber-500/15 text-amber-300" :
              "border-slate-700 bg-slate-800/50 text-slate-300"
            }`}>
              <Calendar className="h-3.5 w-3.5" />
              {overdue ? `${Math.abs(days)} days overdue` : days === 0 ? "Due today" : `${days} days remaining`}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-800/30 p-4">
              <MapPin className="mt-0.5 h-4 w-4 text-slate-500" />
              <div>
                <p className="text-xs font-medium text-slate-500">Location</p>
                <p className="text-sm text-white">{opp.location || "Not specified"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-800/30 p-4">
              <Calendar className="mt-0.5 h-4 w-4 text-slate-500" />
              <div>
                <p className="text-xs font-medium text-slate-500">Deadline</p>
                <p className="text-sm text-white">{new Date(opp.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-800/30 p-4">
              <FileText className="mt-0.5 h-4 w-4 text-slate-500" />
              <div>
                <p className="text-xs font-medium text-slate-500">Type</p>
                <p className="text-sm text-white">{opp.type}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-800/30 p-4">
              <Users className="mt-0.5 h-4 w-4 text-slate-500" />
              <div>
                <p className="text-xs font-medium text-slate-500">Created</p>
                <p className="text-sm text-white">{new Date(opp.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
              </div>
            </div>
          </div>

          {/* Application Link */}
          {opp.applicationLink && (
            <a
              href={opp.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/20"
            >
              <ExternalLink className="h-4 w-4" />
              Apply Now
            </a>
          )}
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
        >
          <h2 className="mb-3 text-lg font-semibold text-white">Description</h2>
          <p className="text-sm leading-relaxed text-slate-300">{opp.description || "No description provided."}</p>
        </motion.div>

        {/* Eligibility */}
        {opp.eligibility && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
          >
            <h2 className="mb-3 text-lg font-semibold text-white">Eligibility</h2>
            <p className="text-sm leading-relaxed text-slate-300">{opp.eligibility}</p>
          </motion.div>
        )}

        {/* Requirements */}
        {opp.requirements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
          >
            <h2 className="mb-3 text-lg font-semibold text-white">Requirements</h2>
            <ul className="space-y-2">
              {opp.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                  {req}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
        >
          <h2 className="mb-3 text-lg font-semibold text-white">Notes</h2>
          {editing ? (
            <>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Add your personal notes here..."
                className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={handleSave}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Save Changes
              </button>
            </>
          ) : (
            <p className="text-sm text-slate-400">{opp.notes || "No notes yet. Click Edit to add notes."}</p>
          )}
        </motion.div>
      </div>
    </main>
  );
}
