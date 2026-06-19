import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Search, X, UserPlus, CheckCircle, XCircle, AlertTriangle, Loader2, ChevronLeft, ChevronRight, FileText } from "lucide-react";

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

const RejectModal = ({ doctor, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-100 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm">
    <div className="bg-white p-8 w-full max-w-sm rounded-[2.5rem] shadow-2xl">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle size={22} className="text-rose-500" />
      </div>
      <h3 className="text-lg font-black text-slate-900 text-center mb-1">Reject Request?</h3>
      <p className="text-slate-400 text-xs text-center mb-1">
        <span className="font-bold text-slate-600">{doctor.name}</span>'s application will be declined.
      </p>
      <p className="text-[10px] text-slate-300 text-center uppercase tracking-widest mb-6">This action cannot be undone</p>
      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Reject
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

const Avatar = ({ name }) => {
  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";
  return (
    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-100 to-purple-100 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs shrink-0">
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

const TAB_COLORS = {
  pending:  "text-amber-500 border-amber-100 bg-amber-50",
  approved: "text-green-500 border-green-100 bg-green-50",
  rejected: "text-rose-500 border-rose-100 bg-rose-50",
};

const DoctorRequest = () => {
  const [doctors, setDoctors]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [type, setType]               = useState("pending");
  const [searchTerm, setSearch]       = useState("");
  const [page, setPage]               = useState(1);
  const [toast, setToast]             = useState(null);
  const [rejectTarget, setReject]     = useState(null);
  const [approving, setApproving]     = useState(null);
  const [rejecting, setRejecting]     = useState(false);

  useEffect(() => { fetchDoctors(); }, []);
  useEffect(() => { setPage(1); }, [type, searchTerm]);

  const showToast = (message, t = "success") => setToast({ message, type: t });

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/doctorrequest");
      setDoctors(res.data.doctors || res.data || []);
    } catch {
      showToast("Failed to load requests", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (doc) => {
    setApproving(doc._id);
    try {
      await axios.post(import.meta.env.VITE_API_URL + "/doctorregister", {
        name: doc.name, email: doc.email, contact: doc.contact,
        specialization: doc.specialization, address: doc.address,
      });
      await axios.put(import.meta.env.VITE_API_URL + "/doctorpermissionupdate", { id: doc._id, permission: "approved" });
      setDoctors((prev) => prev.map((d) => d._id === doc._id ? { ...d, permission: "approved" } : d));
      showToast(`${doc.name} approved`);
    } catch {
      showToast("Failed to approve request", "error");
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async () => {
    setRejecting(true);
    try {
      await axios.put(import.meta.env.VITE_API_URL + "/doctorpermissionupdate", { id: rejectTarget._id, permission: "rejected" });
      setDoctors((prev) => prev.map((d) => d._id === rejectTarget._id ? { ...d, permission: "rejected" } : d));
      showToast(`${rejectTarget.name} rejected`);
      setReject(null);
    } catch {
      showToast("Failed to reject request", "error");
    } finally {
      setRejecting(false);
    }
  };

  const counts = {
    pending:  doctors.filter((d) => d.permission === "pending").length,
    approved: doctors.filter((d) => d.permission === "approved").length,
    rejected: doctors.filter((d) => d.permission === "rejected").length,
  };

  const filtered = useMemo(() =>
    doctors
      .filter((d) => d.permission === type)
      .filter((d) =>
        d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [doctors, type, searchTerm]
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const start      = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end        = Math.min(page * PAGE_SIZE, filtered.length);

  return (
    <div className="h-full overflow-y-auto bg-[#FDFBFF] font-sans px-6 py-8 md:px-10">
      {toast        && <Toast {...toast} onClose={() => setToast(null)} />}
      {rejectTarget && <RejectModal doctor={rejectTarget} onConfirm={handleReject} onCancel={() => setReject(null)} loading={rejecting} />}

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex bg-white/60 backdrop-blur-md p-1 rounded-2xl border border-slate-100 shadow-sm">
            {["pending", "approved", "rejected"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`relative px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                  type === t ? "bg-white text-purple-600 shadow-sm border border-purple-100" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {t}
                {counts[t] > 0 && (
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full border ${
                    type === t ? TAB_COLORS[t] : "bg-slate-100 text-slate-400 border-slate-200"
                  }`}>
                    {counts[t]}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search name, specialty or email…"
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
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">Doctor</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">Specialization</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">Credentials</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em] text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading && [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-100 rounded-xl shrink-0" />
                        <div className="space-y-1.5">
                          <div className="h-3 bg-slate-100 rounded w-32" />
                          <div className="h-2.5 bg-slate-100 rounded w-44" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-100 rounded-lg w-24" /></td>
                    <td className="px-6 py-4"><div className="h-3 bg-slate-100 rounded w-28" /></td>
                    <td className="px-6 py-4"><div className="flex gap-2 justify-center"><div className="h-7 bg-slate-100 rounded-lg w-16" /><div className="h-7 bg-slate-100 rounded-lg w-16" /></div></td>
                  </tr>
                ))}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan="4">
                      <div className="py-20 flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                          <UserPlus size={20} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-bold text-sm">
                          {searchTerm ? `No results for "${searchTerm}"` : `No ${type} requests`}
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

                {!loading && paginated.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={doc.name} />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{doc.name}</p>
                          <p className="text-[10px] text-slate-400">{doc.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                        {doc.specialization || "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {doc.certificate ? (
                        <a href={doc.certificate} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[10px] font-black text-indigo-500 hover:text-indigo-700 transition-colors">
                          <FileText size={12} />
                          View PDF
                        </a>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-300">No certificate</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {type === "pending" ? (
                          <>
                            <button
                              onClick={() => handleApprove(doc)}
                              disabled={approving === doc._id}
                              className="px-3 py-1.5 bg-green-50 text-green-600 text-[10px] font-black rounded-lg hover:bg-green-600 hover:text-white transition-all border border-green-100 disabled:opacity-50 flex items-center gap-1"
                            >
                              {approving === doc._id ? <Loader2 size={11} className="animate-spin" /> : null}
                              APPROVE
                            </button>
                            <button
                              onClick={() => setReject(doc)}
                              className="px-3 py-1.5 bg-rose-50 text-rose-600 text-[10px] font-black rounded-lg hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                            >
                              REJECT
                            </button>
                          </>
                        ) : (
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${TAB_COLORS[type]}`}>
                            {type.toUpperCase()}
                          </span>
                        )}
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

export default DoctorRequest;
