import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Search, X, Stethoscope, CheckCircle, XCircle,
  AlertTriangle, Loader2, ChevronLeft, ChevronRight,
} from "lucide-react";

const PAGE_SIZE = 8;

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const styles = {
    success: "bg-green-50 border-green-200 text-green-700",
    error:   "bg-rose-50   border-rose-200   text-rose-700",
  };
  const Icon = type === "success" ? CheckCircle : XCircle;

  return (
    <div className={`fixed top-6 right-6 z-200 flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-lg ${styles[type]}`}>
      <Icon size={15} />
      <span className="text-sm font-bold">{message}</span>
    </div>
  );
};


const DeleteModal = ({ doctor, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-100 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm">
    <div className="bg-white p-8 w-full max-w-sm rounded-[2.5rem] shadow-2xl">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle size={22} className="text-rose-500" />
      </div>
      <h3 className="text-lg font-black text-slate-900 text-center mb-1">Delete Doctor?</h3>
      <p className="text-slate-400 text-xs text-center mb-1">
        <span className="font-bold text-slate-600">Dr. {doctor.name}</span> will be permanently removed.
      </p>
      <p className="text-[10px] text-slate-300 text-center uppercase tracking-widest mb-6">This action cannot be undone</p>
      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Delete
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
    <div className="flex items-center justify-center gap-1.5 px-8 py-4 border-t border-slate-50">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 transition-all"
      >
        <ChevronLeft size={15} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
            p === page
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-400 hover:bg-slate-100"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 transition-all"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
};

const ViewDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [searchTerm, setSearchTerm]     = useState("");
  const [page, setPage]                 = useState(1);
  const [toast, setToast]               = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const [blocking, setBlocking]         = useState(null);

  useEffect(() => { fetchDoctors(); }, []);

  useEffect(() => { setPage(1); }, [searchTerm]);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/viewdoctors");
      setDoctors(res.data.doctors || []);
    } catch {
      showToast("Failed to load doctors", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.post(import.meta.env.VITE_API_URL + "/deletedoctor", { id: deleteTarget._id });
      setDoctors((prev) => prev.filter((d) => d._id !== deleteTarget._id));
      showToast(`Dr. ${deleteTarget.name} removed`);
      setDeleteTarget(null);
    } catch {
      showToast("Failed to delete doctor", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleBlock = async (doctor) => {
    setBlocking(doctor._id);
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + "/blockdoctor", { id: doctor._id });
      if (res.data.success) {
        const newStatus = res.data.data.doctorstatus;
        setDoctors((prev) =>
          prev.map((d) => d._id === doctor._id ? { ...d, doctorstatus: newStatus } : d)
        );
        showToast(`Dr. ${doctor.name} ${newStatus === "block" ? "blocked" : "unblocked"}`);
      }
    } catch {
      showToast("Failed to update status", "error");
    } finally {
      setBlocking(null);
    }
  };

  const filtered = useMemo(() =>
    doctors.filter((d) =>
      d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [doctors, searchTerm]
  );

  const totalPages  = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const start       = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end         = Math.min(page * PAGE_SIZE, filtered.length);

  return (
    <div className="h-full overflow-y-auto bg-[#FDFBFF] font-sans px-6 py-8 md:px-10">
      {toast        && <Toast {...toast} onClose={() => setToast(null)} />}
      {deleteTarget && <DeleteModal doctor={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />}

      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="relative w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search name, specialty or email…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 shadow-sm transition-all"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                <X size={13} />
              </button>
            )}
          </div>

          {!loading && (
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest shrink-0">
              {filtered.length} doctor{filtered.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">Doctor</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">Specialization</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">Contact</th>
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
                          <div className="h-3 bg-slate-100 rounded w-32" />
                          <div className="h-2.5 bg-slate-100 rounded w-24" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-100 rounded-lg w-24" /></td>
                    <td className="px-6 py-4"><div className="h-3 bg-slate-100 rounded w-20" /></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-100 rounded-full w-16" /></td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        {[1, 2, 3].map((j) => <div key={j} className="h-7 bg-slate-100 rounded-lg w-14" />)}
                      </div>
                    </td>
                  </tr>
                ))}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan="5">
                      <div className="py-20 flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                          <Stethoscope size={20} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-bold text-sm">
                          {searchTerm ? `No results for "${searchTerm}"` : "No doctors registered yet"}
                        </p>
                        {searchTerm && (
                          <button onClick={() => setSearchTerm("")} className="text-xs font-bold text-indigo-500 hover:text-indigo-700">
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

                {!loading && paginated.map((doctor) => (
                  <tr key={doctor._id} className="hover:bg-slate-50/60 transition-colors">

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={doctor.name} />
                        <div>
                          <p className="text-sm font-bold text-slate-800">Dr. {doctor.name}</p>
                          <p className="text-[10px] text-slate-400">{doctor.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                        {doctor.specialization || "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {doctor.contact || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full border ${
                        doctor.doctorstatus === "block"
                          ? "bg-rose-50 text-rose-500 border-rose-100"
                          : "bg-green-50 text-green-500 border-green-100"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          doctor.doctorstatus === "block" ? "bg-rose-400" : "bg-green-400"
                        }`} />
                        {doctor.doctorstatus === "block" ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/doctorprofileview/${doctor._id}`)}
                          className="px-3 py-1.5 bg-purple-50 text-purple-600 text-[10px] font-black rounded-lg hover:bg-purple-600 hover:text-white transition-all border border-purple-100"
                        >
                          PROFILE
                        </button>

                        <button
                          onClick={() => handleBlock(doctor)}
                          disabled={blocking === doctor._id}
                          className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all border disabled:opacity-50 flex items-center gap-1 ${
                            doctor.doctorstatus === "block"
                              ? "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-500 hover:text-white"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-600 hover:text-white"
                          }`}
                        >
                          {blocking === doctor._id
                            ? <Loader2 size={11} className="animate-spin" />
                            : doctor.doctorstatus === "block" ? "UNBLOCK" : "BLOCK"
                          }
                        </button>

                        <button
                          onClick={() => setDeleteTarget(doctor)}
                          className="px-3 py-1.5 bg-rose-50 text-rose-500 text-[10px] font-black rounded-lg hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
                        >
                          DELETE
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

export default ViewDoctors;
