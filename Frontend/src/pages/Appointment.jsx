import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Stethoscope, FileText, Send, Loader2, ChevronDown } from "lucide-react";

const Appointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [doctorid, setDoctorid] = useState("");
  const [doctormail, setDoctormail] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

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
        console.error("Fetch Error:", err.response ? err.response.data : err.message);
        setMessage(err.response?.data?.message || "Error while fetching doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const sendAppointmentRequest = async () => {
    if (!doctorid || !description) {
      setMessage("Please fill all fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/appointrequest",
        { doctorid, description },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Cookies.get("token")}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setMessage("Appointment Request Sent Successfully");
        setDescription("");
      } else {
        setMessage(res.data.message || "Request Failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error while sending appointment request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top,_#f5f3ff,_#f8fafc)] font-sans overflow-hidden py-10">
      
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-purple-200/40 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-200/40 blur-[100px] rounded-full" />
      <div className="relative z-10 w-full max-w-[500px] p-10 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_30px_60px_-15px_rgba(147,51,234,0.1)] mx-4">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Book <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Appointment</span>
          </h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] mt-2">Consult with Specialists</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1">Select Doctor</label>
            <div className="relative group">
              <select
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 appearance-none focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                disabled={loading}
                onChange={(e) => {
                  const doc = doctors.find((d) => d._id === e.target.value);
                  if (doc) {
                    setDoctorid(doc._id);
                    setDoctormail(doc.email);
                  }
                }}
              >
                <option value="">Choose a Specialist</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>{doc.name}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-purple-500 transition-colors">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <ChevronDown size={18} />}
              </div>
              <Stethoscope size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 hidden md:block" />

            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1">Reason for Visit</label>
            <div className="relative">
              <textarea 
                placeholder="Describe your symptoms or health concern..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)} 
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all shadow-sm h-32 resize-none"
              />
              <FileText size={18} className="absolute right-4 top-4 text-slate-200" />
            </div>
          </div>

          <button 
            onClick={sendAppointmentRequest}
            disabled={submitting || loading}
            className="w-full py-4 mt-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 text-white font-bold rounded-2xl shadow-xl shadow-purple-200 transform transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send size={18} />
                Send Request
              </>
            )}
          </button>
        </div>

        {message && (
          <p className={`text-center text-xs mt-4 font-bold ${message.includes('Successfully') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center">
            <button 
              onClick={() => navigate('/Userdashboard')} 
              className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-purple-600 transition-colors"
            >
              Back to Dashboard
            </button>
        </div>
      </div>
    </div>
  );
};

export default Appointment;