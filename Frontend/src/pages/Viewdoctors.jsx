import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handledelete = async (id) => {
    try {
      await axios.post(import.meta.env.VITE_API_URL + "/deletedoctor", { id });
      setDoctors(doctors.filter((doc) => doc._id !== id));
    } catch (err) {
      setMessage("Error while deleting doctor");
    }
  };

  const handleblock = async (id) => {
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + '/blockdoctor', { id });
      if (response.data.success) {
        setDoctors((prevDoctors) =>
          prevDoctors.map((doc) =>
            doc._id === id ? { ...doc, doctorstatus: response.data.data.doctorstatus } : doc
          )
        );
      }
    } catch (err) {
      setMessage("Error while toggling block status");
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/viewdoctors");
        if (response.status === 200) {
          setDoctors(response.data.doctors);
        } else {
          setMessage("Failed to fetch doctors");
        }
      } catch (err) {
        setMessage(err.response?.data?.message || "Error while fetching doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-[#FDFBFF] font-sans px-6 py-10 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-1">Admin Portal</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            View{" "}
            <span className="bg-linear-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">Doctors</span>
          </h1>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-center font-bold text-sm">
            {message}
          </div>
        )}

        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100/50">
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Doctor Detail</th>
                  <th className="px-6 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Specialization</th>
                  <th className="px-6 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Contact Info</th>
                  <th className="px-6 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Location</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">Action</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-8 py-6"><div className="h-10 bg-slate-100 rounded-xl w-48"></div></td>
                      <td className="px-6 py-6"><div className="h-6 bg-slate-100 rounded-lg w-24"></div></td>
                      <td className="px-6 py-6"><div className="h-6 bg-slate-100 rounded-lg w-32"></div></td>
                      <td className="px-6 py-6"><div className="h-6 bg-slate-100 rounded-lg w-40"></div></td>
                      <td className="px-8 py-6"><div className="h-10 bg-slate-100 rounded-xl w-24 mx-auto"></div></td>
                    </tr>
                  ))
                ) : (
                  doctors.map((doctor) => (
                    <tr key={doctor._id} className="hover:bg-white/50">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm font-bold text-slate-800">Dr. {doctor.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{doctor.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                          {doctor.specialization}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-medium text-slate-600 text-sm">
                        {doctor.contact}
                      </td>
                      <td className="px-6 py-5 text-slate-500 text-sm">
                        {doctor.address}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-5">
                          <button className="px-3 py-1.5 bg-purple-100 text-purple-600 text-[10px] font-bold rounded-lg hover:bg-purple-600 hover:text-white transition-all duration-300 border border-slate-200/50"
                           onClick={() => navigate(`/doctorprofileview/${doctor._id}`)} >
                            PROFILE
                          </button>
                          
                          <button 
                            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all duration-300 border ${
                              doctor.doctorstatus === "block" 
                              ? "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-500 hover:text-white" 
                              : "bg-green-50 text-green-600 border-green-100 hover:bg-green-500 hover:text-white"
                            }`}
                            onClick={() => handleblock(doctor._id)}
                          >
                            {doctor.doctorstatus === "block" ? "UNBLOCK" : "BLOCK"}
                          </button>

                          <button 
                            className="px-3 py-1.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-lg hover:bg-rose-600 hover:text-white transition-all duration-300 border border-rose-100" 
                            onClick={() => handledelete(doctor._id)}
                          >
                            DELETE
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {!loading && doctors.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No doctors currently registered</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewDoctors;
