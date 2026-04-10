import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DoctorRequest = () => {
  const [doctors, setDoctors] = useState([]);
  const [type, setType] = useState("pending"); 
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/doctorrequest");
      setDoctors(res.data.doctors || res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleApprove = async (doc) => {
    try {
      await axios.post(import.meta.env.VITE_API_URL + "/doctorregister", {
        name: doc.name,
        email: doc.email,
        contact: doc.contact,
        specialization: doc.specialization,
        address: doc.address,
      });

      await axios.put(import.meta.env.VITE_API_URL + "/doctorpermissionupdate", {
        id: doc._id,
        permission: "approved",
      });

      alert("Doctor Approved");
      fetchDoctors();
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async (doc) => {
    try {
      await axios.put(import.meta.env.VITE_API_URL + "/doctorpermissionupdate", {
        id: doc._id,
        permission: "rejected",
      });

      alert("Doctor Rejected");
      fetchDoctors();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top,_#f5f3ff,_#f8fafc)] font-sans px-6 py-12">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] right-[-2%] w-72 h-72 bg-purple-200/30 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-2%] w-72 h-72 bg-blue-200/30 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Doctor <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Requests</span>
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

        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_20px_50px_-15px_rgba(147,51,234,0.1)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100/50">
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Doctor Detail</th>
                  <th className="px-6 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Specialization</th>
                  <th className="px-6 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Credentials</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {doctors && doctors.filter((doc) => doc.permission === type).length > 0 ? (
                  doctors
                    .filter((doc) => doc.permission === type)
                    .map((doc) => (
                      <tr key={doc._id} className="hover:bg-white/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-sm font-bold text-slate-800">{doc.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold">{doc.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                            {doc.specialization}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <a 
                            href={`${import.meta.env.VITE_API_URL}/images/${doc.certificate}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-[10px] font-black text-blue-500 hover:text-blue-700 underline tracking-tighter"
                          >
                            VIEW CERTIFICATE PDF
                          </a>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center justify-center gap-2">
                            {type === "pending" ? (
                              <>
                                <button
                                  onClick={() => handleApprove(doc)}
                                  className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-black rounded-lg hover:bg-green-600 hover:text-white transition-all border border-green-100"
                                >
                                  APPROVE
                                </button>
                                <button
                                  onClick={() => handleReject(doc)}
                                  className="px-4 py-1.5 bg-rose-50 text-rose-600 text-[10px] font-black rounded-lg hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                                >
                                  REJECT
                                </button>
                              </>
                            ) : (
                              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase border ${
                                type === "approved" 
                                ? "text-green-500 border-green-100 bg-green-50" 
                                : "text-rose-500 border-rose-100 bg-rose-50"
                              }`}>
                                {type}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-20 text-center">
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                        No {type} requests found
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorRequest;