import React from "react";
import { Search, Building2 } from "lucide-react";

const DoctorSearchStep = ({ search, onSearchChange, loadingDoctors, filtered, getImageUrl, onSelectDoctor }) => (
  <>
    <div className="relative mb-6 max-w-md">
      <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
      <input
        type="text"
        placeholder="Search by name or specialization..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all shadow-sm"
      />
    </div>

    {loadingDoctors ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)}
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((doc, i) => (
          <div
            key={doc._id}
            className="motion-safe:animate-[fadeInUp_0.35s_ease-out_both]"
            style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
          >
            <DoctorCard
              doctor={doc}
              imageUrl={getImageUrl(doc.image)}
              onSelect={() => onSelectDoctor(doc)}
            />
          </div>
        ))}
      </div>
    )}
  </>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden animate-pulse">
    <div className="h-44 bg-slate-100" />
    <div className="p-5 space-y-3">
      <div className="h-2 bg-slate-100 rounded-full w-1/3" />
      <div className="h-4 bg-slate-100 rounded-full w-2/3" />
      <div className="h-10 bg-slate-100 rounded-2xl mt-2" />
    </div>
  </div>
);

const DoctorCard = ({ doctor, imageUrl, onSelect }) => (
  <div
    onClick={onSelect}
    className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50 hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
  >
    <div className="relative h-44 overflow-hidden shrink-0">
      {imageUrl
        ? <img src={imageUrl} alt={doctor.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        : <div className="w-full h-full bg-indigo-50 flex items-center justify-center"><span className="text-6xl font-bold text-indigo-200">{doctor.name?.[0]}</span></div>}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      {doctor.experienceYears && (
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1.5 rounded-xl shadow-sm">
          <p className="text-[10px] font-bold text-slate-800 leading-none">{doctor.experienceYears}Y+</p>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Exp</p>
        </div>
      )}
      <div className="absolute bottom-3 left-3">
        <span className="text-[10px] font-bold text-white/90 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-lg uppercase tracking-wider">
          {doctor.specialization || "General"}
        </span>
      </div>
    </div>
    <div className="p-5 flex flex-col flex-1">
      <h3 className="font-bold text-slate-900 tracking-tight text-base">Dr. {doctor.name}</h3>
      {doctor.hospitalName && (
        <div className="flex items-center gap-1.5 mt-1.5 text-slate-400">
          <Building2 size={11} /><span className="text-[11px] truncate">{doctor.hospitalName}</span>
        </div>
      )}
      <div className="mt-auto pt-4">
        <button className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-bold text-[11px] uppercase tracking-widest group-hover:bg-indigo-700 transition-all duration-300">
          Select Doctor
        </button>
      </div>
    </div>
  </div>
);

export default DoctorSearchStep;
