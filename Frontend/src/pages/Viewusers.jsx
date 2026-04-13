import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Viewusers = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleblock = async (id) => {
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + '/blockuser', { id });
      if (response.data.success) {
        setUsers((prevusers) =>
          prevusers.map((user) =>
            user._id === id ? { ...user, userstatus: response.data.data.userstatus } : user
          )
        );
      }
    } catch (err) {
      setMessage("Error while toggling block status");
    }
  };


  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/viewusers");
        if (response.status === 200) {
          setUsers(response.data.users);
        } else {
          setMessage("Failed to fetch users");
        }
      } catch (err) {
        setMessage(err.response?.data?.message || "Error while fetching users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top,_#f5f3ff,_#f8fafc)] font-sans px-6 py-12">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-2%] w-72 h-72 bg-blue-200/30 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-2%] w-72 h-72 bg-purple-200/30 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              View <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Users</span>
            </h1>
            </div>
          
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 shadow-sm transition-all"
          >
            ← Dashboard
          </button>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-center font-bold text-sm">
            {message}
          </div>
        )}

        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_20px_50px_-15px_rgba(59,130,246,0.1)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100/50">
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">User Detail</th>
                  <th className='px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]'>User Email</th>
                  <th className="px-6 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Contact No.</th>
                  <th className="px-6 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Home Address</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">Actions</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-8 py-6"><div className="h-10 bg-slate-100 rounded-xl w-48"></div></td>
                      <td className="px-6 py-6"><div className="h-6 bg-slate-100 rounded-lg w-32"></div></td>
                      <td className="px-6 py-6"><div className="h-6 bg-slate-100 rounded-lg w-48"></div></td>
                      <td className="px-8 py-6"><div className="h-10 bg-slate-100 rounded-xl w-32 mx-auto"></div></td>
                    </tr>
                  ))
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-white/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm font-medium text-slate-800">{user.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-600 font-medium">{user.email}</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-600 font-medium">{user.contact}</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-500 max-w-[250px] truncate">{user.address}</p>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                          className="px-4 py-1.5 bg-purple-100 text-purple-600 text-[10px] font-black rounded-lg hover:bg-purple-600 hover:text-white transition-all border border-slate-200/50"
                          onClick={() => navigate(`/userbyid/${user._id}`)}
                          >
                          PROFILE
                          </button>
                          <button 
                            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all duration-300 border ${
                              user.userstatus === "block" 
                              ? "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-500 hover:text-white" 
                              : "bg-green-50 text-green-600 border-green-100 hover:bg-green-500 hover:text-white"
                            }`}
                            onClick={() => handleblock(user._id)}
                          >
                            {user.userstatus === "block" ? "UNBLOCK" : "BLOCK"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {!loading && users.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No users found in database</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Viewusers;