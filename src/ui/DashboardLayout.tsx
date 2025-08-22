import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { LogOut, Folder, Share2, Trash2 } from "lucide-react";

export default function DashboardLayout() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();

  if (!token) {
    navigate("/login");
  }

  return (
    <div className="min-h-dvh bg-base-50">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-base-200">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary-500" />
            <span className="font-semibold">Cloud Drive</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">{user?.email}</span>
            <button className="btn-soft" onClick={logout}><LogOut size={16} /> Logout</button>
          </div>
        </div>
        <nav className="border-t border-base-200">
          <div className="mx-auto max-w-6xl px-4 h-12 flex items-center gap-4 text-sm">
            <Link className={"hover:underline " + (loc.pathname === "/" ? "font-medium" : "") } to="/"><Folder size={16} className="inline mr-1"/>My Drive</Link>
            <Link className={"hover:underline " + (loc.pathname === "/shared" ? "font-medium" : "") } to="/shared"><Share2 size={16} className="inline mr-1"/>Shared</Link>
            <Link className={"hover:underline " + (loc.pathname === "/trash" ? "font-medium" : "") } to="/trash"><Trash2 size={16} className="inline mr-1"/>Trash</Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

