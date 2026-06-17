import axios from 'axios';
import { useEffect, useState, useMemo } from 'react';
import DoctorCard from '../components/DoctorCard';
import { Search, X } from 'lucide-react';

const ViewDoctorss = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchdoctor = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/viewdoctors`);
                setDoctors(response.data.doctors || []);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchdoctor();
    }, []);

    const filtered = useMemo(() => {
        return doctors.filter(doc =>
            doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [doctors, searchTerm]);

    return (
        <div className="h-full overflow-y-auto bg-[#FDFBFF] w-full px-4 md:px-10 py-10">

            {/* Header */}
            <div className="w-full flex flex-col md:flex-row justify-between items-end mb-8 pb-6 border-b border-purple-50">
                <h2 className="text-5xl font-black text-gray-900 leading-tight">
                    Find &amp; Book <br/>
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-indigo-500">
                        Specialists
                    </span>
                </h2>

                {!loading && (
                    <div className="mt-4 md:mt-0 px-5 py-3 bg-indigo-50 rounded-2xl text-right shrink-0">
                        <p className="text-2xl font-black text-indigo-600">{filtered.length}</p>
                        <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">
                            {filtered.length === 1 ? 'Doctor' : 'Doctors'}
                        </p>
                    </div>
                )}
            </div>

            {/* Search */}
            {!loading && doctors.length > 0 && (
                <div className="relative max-w-md mb-8">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by name, specialty, hospital..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="h-96 bg-gray-100 animate-pulse rounded-3xl w-full" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center py-40 gap-4">
                    {searchTerm ? (
                        <>
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                                <Search size={24} className="text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-400">No doctors match your search</h3>
                            <button
                                onClick={() => setSearchTerm('')}
                                className="px-5 py-2.5 rounded-2xl bg-indigo-50 text-indigo-600 text-sm font-bold hover:bg-indigo-100 transition-all"
                            >
                                Clear search
                            </button>
                        </>
                    ) : (
                        <h3 className="text-2xl font-bold text-gray-400">No doctors currently active.</h3>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {filtered.map((doc) => {
                        let fullImageUrl = null;
                        if (doc.image) {
                            const filename = doc.image.split(/[\\/]/).pop();
                            fullImageUrl = `${import.meta.env.VITE_API_URL}/images/${filename}`;
                        }
                        return (
                            <DoctorCard
                                key={doc._id}
                                doctor={doc}
                                image={fullImageUrl}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ViewDoctorss;
