import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search, X, Users, CheckCircle, XCircle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 8;

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const styles = {
    success: "bg-green-50 border-green-200 text-green-700",
    error:   "bg-rose-50 border-rose-200 text-rose-700",
  };
  const Icon = type === "success" ? CheckCircle : XCircle;

  return (
    <div className={`fixed top-6 right-6 z-200 flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-lg ${styles[type]}`}>
      <Icon size={15} />
      <span className="text-sm font-bold">{message}</span>
    </div>
  );
};

const Avatar = ({ name }) => {
  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";
  return (
    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">
      {initials}
    </div>
  );
};

const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={() => onChange(page - 1)} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 transition-all">
        <ChevronLeft size={15} />
      </button>
      {pages.map((p) => (
        <button key={p} onClick={() => onChange(p)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${p === page ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:bg-slate-100"}`}>
          {p}
        </button>
      ))}
      <button onClick={() => onChange(page + 1)} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 transition-all">
        <ChevronRight size={15} />
      </button>
    </div>
  );
};

const Viewusers = () => {
  const navigate = useNavigate();
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [searchTerm, setSearch] = useState("");
  const [page, setPage]         = useState(1);
  const [toast, setToast]       = useState(null);
  const [blocking, setBlocking] = useState(null);

  useEffect(() => { fetchUsers(); }, []);
  useEffect(() => { setPage(1); }, [searchTerm]);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/viewusers");
      setUsers(res.data.users || []);
    } catch {
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (user) => {
    setBlocking(user._id);
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + "/blockuser", { id: user._id });
      if (res.data.success) {
        const newStatus = res.data.data.userstatus;
        setUsers((prev) => prev.map((u) => u._id === user._id ? { ...u, userstatus: newStatus } : u));
        showToast(`${user.name} ${newStatus === "block" ? "blocked" : "unblocked"}`);
      }
    } catch {
      showToast("Failed to update status", "error");
    } finally {
      setBlocking(null);
    }
  };

  const filtered = useMemo(() =>
    users.filter((u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.contact?.toString().includes(searchTerm)
    ),
    [users, searchTerm]
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const start      = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end        = Math.min(page * PAGE_SIZE, filtered.length);

  return (
    <div className="h-full overflow-y-auto bg-slate-50 font-sans px-6 py-8 md:px-10">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="max-w-6xl mx-auto">
        <div className="motion-safe:animate-[fadeInUp_0.4s_ease-out_both] flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search name, email or contact…"
              value={searchTerm}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 shadow-sm transition-all"
            />
            {searchTerm && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                <X size={13} />
              </button>
            )}
          </div>
          {!loading && (
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest shrink-0">
              {filtered.length} user{filtered.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="motion-safe:animate-[fadeInUp_0.4s_ease-out_both] bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden" style={{ animationDelay: '60ms' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">User</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">Contact</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">Address</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading && [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-100 rounded-xl shrink-0" />
                        <div className="space-y-1.5">
                          <div className="h-3 bg-slate-100 rounded w-28" />
                          <div className="h-2.5 bg-slate-100 rounded w-36" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-3 bg-slate-100 rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-3 bg-slate-100 rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-100 rounded-full w-16" /></td>
                    <td className="px-6 py-4"><div className="flex gap-2 justify-center"><div className="h-7 bg-slate-100 rounded-lg w-14" /><div className="h-7 bg-slate-100 rounded-lg w-14" /></div></td>
                  </tr>
                ))}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan="5">
                      <div className="py-20 flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                          <Users size={20} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-bold text-sm">
                          {searchTerm ? `No results for "${searchTerm}"` : "No users registered yet"}
                        </p>
                        {searchTerm && (
                          <button onClick={() => setSearch("")} className="text-xs font-bold text-indigo-500 hover:text-indigo-700">
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

                {!loading && paginated.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{user.name}</p>
                          <p className="text-[10px] text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{user.contact || "—"}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-45 truncate">{user.address || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full border ${
                        user.userstatus === "block"
                          ? "bg-rose-50 text-rose-500 border-rose-100"
                          : "bg-green-50 text-green-500 border-green-100"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.userstatus === "block" ? "bg-rose-400" : "bg-green-400"}`} />
                        {user.userstatus === "block" ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/userbyid/${user._id}`)}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100"
                        >
                          PROFILE
                        </button>
                        <button
                          onClick={() => handleBlock(user)}
                          disabled={blocking === user._id}
                          className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all border disabled:opacity-50 flex items-center gap-1 ${
                            user.userstatus === "block"
                              ? "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-500 hover:text-white"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-600 hover:text-white"
                          }`}
                        >
                          {blocking === user._id
                            ? <Loader2 size={11} className="animate-spin" />
                            : user.userstatus === "block" ? "UNBLOCK" : "BLOCK"
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && filtered.length > 0 && (
            <div className="flex items-center justify-between px-6 border-t border-slate-50">
              <p className="text-[11px] text-slate-400 font-medium py-4">
                Showing <span className="font-bold text-slate-600">{start}–{end}</span> of{" "}
                <span className="font-bold text-slate-600">{filtered.length}</span> results
              </p>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Viewusers;
