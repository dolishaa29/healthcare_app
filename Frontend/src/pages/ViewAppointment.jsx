import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const ViewAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [type, setType] = useState("pending");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/viewappointment", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("emtoken")}`,
        },
        withCredentials: true,
      });
      setAppointments(res.data.appointments);
    } catch (error) {
      console.log(error);
    }
  };

  const openApproveModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const confirmAppointment = async () => {
    try {
      const sendData = {
        ...selectedAppointment,
        date: date,
        time: time
      };
      await axios.post(import.meta.env.VITE_API_URL + "/approveappointment", sendData);
      await axios.put(import.meta.env.VITE_API_URL + "/appointmentstatus", {
        id: selectedAppointment._id,
        status: "approved"
      });
      alert("Appointment Approved");
      setShowModal(false);
      setDate("");
      setTime("");
      fetchAppointments();
    } catch (error) {
      console.log(error);
    }
  };

  const rejectRequests = async (id) => {
    try {
      await axios.put(import.meta.env.VITE_API_URL + "/appointmentstatus", {
        id: id,
        status: "rejected"
      });
      alert("Appointment Rejected");
      fetchAppointments();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-[#FDFBFF] font-sans px-6 py-10 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <p className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-1">Admin Portal</p>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              View{" "}
              <span className="bg-linear-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">Appointments</span>
            </h1>
          </div>

          <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-white shadow-sm">
            {["pending", "approved", "rejected"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                  type === t 
                  ? "bg-white text-purple-600 shadow-sm border border-purple-100" 
                  : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100/50">
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Patient Details</th>
                  <th className="px-6 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Doctor Info</th>
                  <th className="px-6 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Description</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {appointments && appointments.filter((app) => app.status === type).length > 0 ? (
                  appointments.filter((app) => app.status === type).map((app) => (
                    <tr key={app._id} className="hover:bg-white/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm font-bold text-slate-800">{app.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{app.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-xs font-bold text-slate-700">ID: {app.doctorid}</p>
                        <p className="text-[10px] text-slate-400">{app.doctormail}</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-xs text-slate-500 max-w-50 truncate">{app.description}</p>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-center gap-2">
                          {type === "pending" ? (
                            <>
                              <button
                                onClick={() => openApproveModal(app)}
                                className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-black rounded-lg hover:bg-green-600 hover:text-white transition-all border border-green-100"
                              >
                                APPROVE
                              </button>
                              <button
                                onClick={() => rejectRequests(app._id)}
                                className="px-4 py-1.5 bg-rose-50 text-rose-600 text-[10px] font-black rounded-lg hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                              >
                                REJECT
                              </button>
                            </>
                          ) : (
                            <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border ${
                              type === "approved" ? "text-green-500 border-green-100 bg-green-50" : "text-rose-500 border-rose-100 bg-rose-50"
                            }`}>
                              {type.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                      No {type} appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-xl p-8 w-full max-w-100 rounded-[2.5rem] border border-white shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-2">Schedule Appointment</h3>
            <p className="text-slate-500 text-xs mb-6 uppercase tracking-widest font-bold">Assign Date & Time</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Appointment Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full mt-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slot Time</label>
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
                  className="flex-1 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-purple-100 hover:opacity-90 active:scale-95 transition-all"
                >
                  Confirm Slot
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAppointment;