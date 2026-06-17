import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ArrowLeft, Star, Send } from "lucide-react";

const Rating = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();

    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [description, setDescription] = useState("");
    const [data, setData] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const averageRating = data.length > 0
        ? (data.reduce((acc, r) => acc + r.rating, 0) / data.length).toFixed(1)
        : null;

    const fetchRatings = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/viewrating/${doctorId}`);
            setData(response.data.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (doctorId) fetchRatings();
    }, [doctorId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (rating < 1 || rating > 5) {
            setError("Please select a rating between 1 and 5.");
            return;
        }

        setSubmitting(true);
        try {
            const token = Cookies.get("token");
            await axios.post(
                `${import.meta.env.VITE_API_URL}/getrating`,
                { doctorId, rating, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess(true);
            setRating(0);
            setDescription("");
            fetchRatings();
            setTimeout(() => setSuccess(false), 4000);
        } catch (error) {
            setError("Error submitting rating. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBFF] px-6 py-10 md:px-10">

            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
                <div>
                    <p className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-1">Feedback</p>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                        Rate{" "}
                        <span className="bg-linear-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
                            Doctor
                        </span>
                    </h1>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl transition-all"
                >
                    <ArrowLeft size={14} />
                    Back
                </button>
            </div>

            <div className="max-w-3xl space-y-5">

                {/* Stats bar */}
                {averageRating && (
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center gap-6">
                        <div className="text-center shrink-0">
                            <p className="text-5xl font-black text-slate-900">{averageRating}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">out of 5</p>
                        </div>
                        <div className="h-12 w-px bg-slate-100" />
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star
                                        key={s}
                                        size={20}
                                        className={s <= Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-100"}
                                    />
                                ))}
                            </div>
                            <p className="text-sm font-medium text-slate-500">
                                Based on <span className="font-bold text-slate-700">{data.length}</span> {data.length === 1 ? "review" : "reviews"}
                            </p>
                        </div>
                    </div>
                )}

                {/* Submit form */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-5">
                        <div className="p-1.5 rounded-xl bg-amber-50 text-amber-500">
                            <Star size={15} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800">Leave a Review</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Star picker */}
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                                Your Rating (1–5)
                            </label>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setRating(s)}
                                        onMouseEnter={() => setHovered(s)}
                                        onMouseLeave={() => setHovered(0)}
                                        className="transition-transform hover:scale-110 active:scale-95"
                                    >
                                        <Star
                                            size={36}
                                            className={
                                                s <= (hovered || rating)
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "text-slate-200 fill-slate-100"
                                            }
                                        />
                                    </button>
                                ))}
                                {rating > 0 && (
                                    <span className="ml-2 text-sm font-black text-slate-700">
                                        {rating} / 5
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                                Comment <span className="text-slate-300 normal-case font-medium">(optional)</span>
                            </label>
                            <textarea
                                placeholder="Share your experience with this doctor..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all resize-none h-28"
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-xs font-bold flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                {error}
                            </p>
                        )}

                        {success && (
                            <p className="text-green-600 text-xs font-bold flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                Review submitted successfully!
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting || rating === 0}
                            className="flex items-center gap-2 px-8 py-3.5 bg-linear-to-r from-purple-600 to-indigo-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-100 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Send size={15} />
                            {submitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </form>
                </div>

                {/* Reviews list */}
                {data.length > 0 && (
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600">
                                <Star size={15} />
                            </div>
                            <h3 className="text-sm font-bold text-slate-800">All Reviews</h3>
                            <span className="ml-auto px-2.5 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-xl border border-slate-100">
                                {data.length}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {data.map((r, i) => (
                                <div key={r._id || i} className="flex gap-4 items-start bg-slate-50 border border-slate-100 rounded-2xl p-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                                        <span className="text-sm font-black text-amber-600">{r.rating}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star
                                                    key={s}
                                                    size={12}
                                                    className={s <= r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-100"}
                                                />
                                            ))}
                                            <span className="text-[10px] font-bold text-slate-400 ml-1">{r.rating} / 5</span>
                                        </div>
                                        {r.description && (
                                            <p className="text-sm text-slate-600 leading-relaxed">"{r.description}"</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rating;
