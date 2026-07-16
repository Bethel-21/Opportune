import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, LogOut, Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { getSession, logout } from "../utils/storage";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = getSession();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isAuth = location.pathname === "/login" || location.pathname === "/register";

  const navLinks = session
    ? [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      ]
    : [];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/30">
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            Opportunity<span className="text-emerald-400">Tracker</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {!isAuth && !session && (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98]"
              >
                Get started
              </Link>
            </>
          )}
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-slate-800/80 text-white"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
          {session && (
            <div className="ml-2 flex items-center gap-3">
              <span className="text-sm text-slate-400">{session.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-white md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-800/60 md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {!isAuth && !session && (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="rounded-lg bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-slate-950"
                  >
                    Get started
                  </Link>
                </>
              )}
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
              {session && (
                <button
                  onClick={() => { handleLogout(); setOpen(false); }}
                  className="flex items-center gap-2 rounded-lg px-4 py-3 text-left text-sm font-medium text-red-400 transition-colors hover:bg-slate-800/60"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
