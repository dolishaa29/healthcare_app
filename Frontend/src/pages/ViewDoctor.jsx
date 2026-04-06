import axios from 'axios';
import { useEffect, useState } from 'react';
import DoctorCard from '../components/DoctorCard';

const ViewDoctorss = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchdoctor();
    }, []);

    return (
        <div className="min-h-screen bg-[#FDFBFF] w-full px-4 md:px-10 py-10">
            {/* Header Section */}
            <div className="w-full flex flex-col md:flex-row justify-between items-end mb-12 pb-6 border-b border-purple-50">
                <div className="space-y-2">
                    <h2 className="text-5xl font-black text-gray-900 leading-tight">
                        Our Expert <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">
                            Specialists
                        </span>
                    </h2>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 w-full">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="h-96 bg-gray-100 animate-pulse rounded-3xl w-full"></div>
                    ))}
                </div>
            ) : doctors.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center py-40">
                    <h3 className="text-2xl font-bold text-gray-400">No doctors currently active.</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 w-full items-stretch">
                    {doctors.map((doc) => {
                        let fullImageUrl = null;
                        if (doc.image) {
                            const filename = doc.image.split(/[\\/]/).pop();
                            fullImageUrl = `${import.meta.env.VITE_API_URL}/images/${filename}`;
                        }

                        return (
                            <div key={doc._id} className="w-full flex justify-center">
                                <DoctorCard 
                                    doctor={doc} 
                                    image={fullImageUrl} 
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ViewDoctorss;
