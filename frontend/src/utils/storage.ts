export type OpportunityType = "Job" | "Scholarship" | "Grant" | "Internship" | "Fellowship" | "Competition";
export type OpportunityStatus = "In Review" | "Applied" | "Shortlisted" | "Accepted" | "Rejected";

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: OpportunityType;
  status: OpportunityStatus;
  deadline: string;
  location: string;
  eligibility: string;
  requirements: string[];
  description: string;
  applicationLink: string;
  notes: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

const USERS_KEY = "ot_users";
const SESSION_KEY = "ot_session";
const OPPS_KEY = "ot_opportunities";

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function seed(): Opportunity[] {
  const now = new Date();
  const d = (days: number) => {
    const dt = new Date(now);
    dt.setDate(dt.getDate() + days);
    return dt.toISOString().split("T")[0];
  };
  return [
    {
      id: uid(), title: "Software Engineer Intern", organization: "Google",
      type: "Internship", status: "In Review", deadline: d(3), location: "Mountain View, CA",
      eligibility: "Currently enrolled in BS/MS Computer Science", requirements: ["Python or Java", "GPA 3.5+", "Resume", "Cover Letter"],
      description: "Join Google's engineering team for a 12-week summer internship working on large-scale distributed systems.",
      applicationLink: "https://careers.google.com", notes: "", createdAt: d(-5),
    },
    {
      id: uid(), title: "Mastercard Foundation Scholars Program", organization: "Mastercard Foundation",
      type: "Scholarship", status: "Applied", deadline: d(14), location: "Multiple African Universities",
      eligibility: "Students from Sub-Saharan Africa with financial need", requirements: ["Academic transcripts", "Recommendation letters", "Personal essay", "Proof of financial need"],
      description: "Full scholarship covering tuition, accommodation, books, and a stipend for undergraduate studies at partner universities.",
      applicationLink: "https://mastercardfdn.org/scholars", notes: "", createdAt: d(-10),
    },
    {
      id: uid(), title: "NSF Research Grant", organization: "National Science Foundation",
      type: "Grant", status: "Shortlisted", deadline: d(30), location: "United States",
      eligibility: "US-based researchers at accredited institutions", requirements: ["Research proposal", "Budget justification", "Data management plan", "PI biosketch"],
      description: "Funding for innovative research in computer and information science and engineering.",
      applicationLink: "https://nsf.gov/grants", notes: "", createdAt: d(-20),
    },
    {
      id: uid(), title: "Frontend Developer", organization: "Stripe",
      type: "Job", status: "In Review", deadline: d(5), location: "Remote",
      eligibility: "3+ years of React/TypeScript experience", requirements: ["Portfolio", "System design skills", "Accessibility knowledge", "Team collaboration"],
      description: "Build and maintain Stripe's payment dashboard used by millions of businesses worldwide.",
      applicationLink: "https://stripe.com/jobs", notes: "", createdAt: d(-2),
    },
    {
      id: uid(), title: "Thiel Fellowship", organization: "Thiel Foundation",
      type: "Fellowship", status: "Accepted", deadline: d(-10), location: "San Francisco, CA",
      eligibility: "Young people aged 18-22 who want to build new things", requirements: ["Prototype or project", "Video application", "Two references", "Interview"],
      description: "$100,000 grant and two years of mentorship to build a company instead of going to college.",
      applicationLink: "https://thielfellowship.org", notes: "Amazing opportunity - already accepted!", createdAt: d(-45),
    },
    {
      id: uid(), title: "Hult Prize Regional Summit", organization: "Hult Prize Foundation",
      type: "Competition", status: "Rejected", deadline: d(-5), location: "London, UK",
      eligibility: "University students worldwide", requirements: ["Team of 3-5", "Business plan", "Pitch deck", "Social impact focus"],
      description: "$1 million seed capital for social enterprise ideas that address pressing global challenges.",
      applicationLink: "https://hultprize.org", notes: "", createdAt: d(-60),
    },
  ];
}

export function getUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): User | null {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setSession(user: User | null) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
}

export function register(name: string, email: string, password: string): { ok: boolean; error?: string; user?: User } {
  const users = getUsers();
  if (users.find((u) => u.email === email)) return { ok: false, error: "Email already registered" };
  const user: User = { id: uid(), name, email, password };
  users.push(user);
  saveUsers(users);
  setSession(user);
  if (!getOpportunities().length) saveOpportunities(seed());
  return { ok: true, user };
}

export function login(email: string, password: string): { ok: boolean; error?: string; user?: User } {
  const user = getUsers().find((u) => u.email === email && u.password === password);
  if (!user) return { ok: false, error: "Invalid email or password" };
  setSession(user);
  if (!getOpportunities().length) saveOpportunities(seed());
  return { ok: true, user };
}

export function logout() {
  setSession(null);
}

export function getOpportunities(): Opportunity[] {
  const raw = localStorage.getItem(OPPS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveOpportunities(opps: Opportunity[]) {
  localStorage.setItem(OPPS_KEY, JSON.stringify(opps));
}

export function addOpportunity(opp: Omit<Opportunity, "id" | "createdAt" | "notes">): Opportunity {
  const opps = getOpportunities();
  const newOpp: Opportunity = { ...opp, id: uid(), notes: "", createdAt: new Date().toISOString().split("T")[0] };
  opps.unshift(newOpp);
  saveOpportunities(opps);
  return newOpp;
}

export function updateOpportunity(id: string, updates: Partial<Opportunity>) {
  const opps = getOpportunities().map((o) => (o.id === id ? { ...o, ...updates } : o));
  saveOpportunities(opps);
}

export function deleteOpportunity(id: string) {
  saveOpportunities(getOpportunities().filter((o) => o.id !== id));
}

export function getOpportunity(id: string): Opportunity | undefined {
  return getOpportunities().find((o) => o.id === id);
}

export function isDeadlineApproaching(deadline: string, status: OpportunityStatus): boolean {
  if (status !== "In Review" && status !== "Applied") return false;
  const diff = (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 7;
}

export function isOverdue(deadline: string, status: OpportunityStatus): boolean {
  if (status === "Accepted" || status === "Rejected") return false;
  return new Date(deadline).getTime() < Date.now();
}
