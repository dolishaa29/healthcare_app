import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Loader2, Calendar, Clock, Mail, Stethoscope, CheckCircle, XCircle, AlertCircle, Search, X, ChevronLeft, ChevronRight } from "lucide-react";

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
      <Icon size={16} />
      <span className="text-sm font-bold">{message}</span>
    </div>
  );
};

const Initials = ({ name }) => {
  const letters = name ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() : "?";
  return (
    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-100 to-purple-100 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs shrink-0">
      {letters}
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

const ViewAppointment = () => {
  const [appointments, setAppointments]       = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [showModal, setShowModal]             = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedAppointment, setSelected]    = useState(null);
  const [type, setType]                       = useState("pending");
  const [searchTerm, setSearch]               = useState("");
  const [page, setPage]                       = useState(1);
  const [date, setDate]                       = useState("");
  const [time, setTime]                       = useState("");
  const [submitting, setSubmitting]           = useState(false);
  const [toast, setToast]                     = useState(null);

  useEffect(() => { fetchAppointments(); }, []);
  useEffect(() => { setPage(1); }, [type, searchTerm]);

  const showToast = (message, t = "success") => setToast({ message, type: t });

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/viewappointment", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${Cookies.get("emtoken")}` },
        withCredentials: true,
      });
      setAppointments(res.data.appointments);
    } catch {
      showToast("Failed to load appointments", "error");
    } finally {
      setLoading(false);
    }
  };

  const openApproveModal = (app) => { setSelected(app); setDate(""); setTime(""); setShowModal(true); };
  const openRejectModal  = (app) => { setSelected(app); setShowRejectModal(true); };

  const confirmAppointment = async () => {
    if (!date || !time) return showToast("Please select both date and time", "error");
    setSubmitting(true);
    try {
      await axios.post(import.meta.env.VITE_API_URL + "/approveappointment", { ...selectedAppointment, date, time });
      await axios.put(import.meta.env.VITE_API_URL + "/appointmentstatus", { id: selectedAppointment._id, status: "approved" });
      showToast("Appointment approved successfully");
      setShowModal(false);
      fetchAppointments();
    } catch {
      showToast("Failed to approve appointment", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const rejectAppointment = async () => {
    setSubmitting(true);
    try {
      await axios.put(import.meta.env.VITE_API_URL + "/appointmentstatus", { id: selectedAppointment._id, status: "rejected" });
      showToast("Appointment rejected");
      setShowRejectModal(false);
      fetchAppointments();
    } catch {
      showToast("Failed to reject appointment", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const counts = {
    pending:  appointments.filter((a) => a.status === "pending").length,
    approved: appointments.filter((a) => a.status === "approved").length,
    rejected: appointments.filter((a) => a.status === "rejected").length,
  };

  const filtered = useMemo(() =>
    appointments
      .filter((a) => a.status === type)
      .filter((a) =>
        a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.doctormail?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [appointments, type, searchTerm]
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const start      = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end        = Math.min(page * PAGE_SIZE, filtered.length);

  if (loading) return (
    <div className="h-full w-full flex items-center justify-center bg-[#FDFBFF]">
      <Loader2 className="animate-spin text-indigo-600" size={32} />
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-[#FDFBFF] font-sans px-6 py-8 md:px-10">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

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
              placeholder="Search patient, email or doctor…"
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
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">Patient</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">Doctor</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">Description</th>
                  {type === "approved" && (
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">Scheduled</th>
                  )}
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em] text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={type === "approved" ? 5 : 4}>
                      <div className="py-20 flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                          <Calendar size={20} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-bold text-sm">
                          {searchTerm ? `No results for "${searchTerm}"` : `No ${type} appointments`}
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

                {paginated.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Initials name={app.name} />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{app.name}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Mail size={9} />{app.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <Stethoscope size={13} className="text-indigo-300 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-700">ID: {app.doctorid}</p>
                          <p className="text-[10px] text-slate-400">{app.doctormail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-500 max-w-45 truncate" title={app.description}>
                        {app.description}
                      </p>
                    </td>
                    {type === "approved" && (
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {app.date && (
                            <p className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                              <Calendar size={11} className="text-indigo-400" />{app.date}
                            </p>
                          )}
                          {app.time && (
                            <p className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                              <Clock size={11} className="text-indigo-400" />{app.time}
                            </p>
                          )}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {type === "pending" ? (
                          <>
                            <button onClick={() => openApproveModal(app)} className="px-3 py-1.5 bg-green-50 text-green-600 text-[10px] font-black rounded-lg hover:bg-green-600 hover:text-white transition-all border border-green-100">
                              APPROVE
                            </button>
                            <button onClick={() => openRejectModal(app)} className="px-3 py-1.5 bg-rose-50 text-rose-600 text-[10px] font-black rounded-lg hover:bg-rose-600 hover:text-white transition-all border border-rose-100">
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

          {filtered.length > 0 && (
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

      {showModal && selectedAppointment && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white p-8 w-full max-w-md rounded-[2.5rem] shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-1">Schedule Appointment</h3>
            <p className="text-slate-400 text-xs mb-6 uppercase tracking-widest font-bold">Assign Date & Time</p>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
              <Initials name={selectedAppointment.name} />
              <div>
                <p className="text-sm font-bold text-slate-800">{selectedAppointment.name}</p>
                <p className="text-[10px] text-slate-400">{selectedAppointment.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <Calendar size={10} /> Appointment Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full mt-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <Clock size={10} /> Slot Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full mt-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={confirmAppointment}
                  disabled={submitting}
                  className="flex-1 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-purple-100 hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 size={15} className="animate-spin" />}
                  Confirm Slot
                </button>
                <button onClick={() => setShowModal(false)} disabled={submitting} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all disabled:opacity-60">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && selectedAppointment && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white p-8 w-full max-w-sm rounded-[2.5rem] shadow-2xl">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 mx-auto mb-4">
              <AlertCircle size={22} className="text-rose-500" />
            </div>
            <h3 className="text-lg font-black text-slate-900 text-center mb-1">Reject Appointment?</h3>
            <p className="text-slate-400 text-xs text-center mb-2">
              This will notify <span className="font-bold text-slate-600">{selectedAppointment.name}</span> that their request was declined.
            </p>
            <p className="text-[10px] text-slate-300 text-center uppercase tracking-widest mb-6">This action cannot be undone</p>
            <div className="flex gap-3">
              <button
                onClick={rejectAppointment}
                disabled={submitting}
                className="flex-1 py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={15} className="animate-spin" />}
                Reject
              </button>
              <button onClick={() => setShowRejectModal(false)} disabled={submitting} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all disabled:opacity-60">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAppointment;
