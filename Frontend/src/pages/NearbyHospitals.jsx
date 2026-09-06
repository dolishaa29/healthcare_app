import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, Loader2, Navigation } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const makeDotIcon = (color) =>
  L.divIcon({
    className: "",
    html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

const USER_ICON = makeDotIcon("#4f46e5");
const INTERNAL_ICON = makeDotIcon("#059669");
const EXTERNAL_ICON = makeDotIcon("#ea580c");

const NearbyHospitals = () => {
  const [position, setPosition] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocationError("Location access denied. Enable it to find hospitals near you.")
    );
  }, []);

  const search = async (coords) => {
    const point = coords || position;
    if (!point || loading) return;
    setLoading(true);
    setSearchError("");
    try {
      const res = await axios.get(`${API}/nearby-hospitals`, {
        params: { lat: point.lat, lng: point.lng, issue: issue.trim() || undefined, radiusKm: 15 },
      });
      if (res.data.success) setResults(res.data);
    } catch {
      setSearchError("Couldn't fetch nearby hospitals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (position) search(position);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  return (
    <div className="h-full overflow-y-auto bg-slate-50 px-6 py-10 md:px-10">
      <div className="mb-6">
        <p className="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase mb-1">Emergency & Care</p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Nearby <span className="text-indigo-600">Hospitals</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">Find hospitals and doctors near you, matched to your issue</p>
      </div>

      <div className="max-w-xl bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6 flex gap-2">
        <input
          type="text"
          placeholder="What's the issue? (optional, e.g. chest pain)"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
        />
        <button
          onClick={() => search()}
          disabled={!position || loading}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider disabled:opacity-30 hover:bg-indigo-700 transition-all shrink-0 flex items-center gap-1.5"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
          Search
        </button>
      </div>

      {locationError && <p className="text-sm text-red-500 font-medium mb-4">{locationError}</p>}
      {searchError && <p className="text-sm text-red-500 font-medium mb-4">{searchError}</p>}
      {results?.inferredSpecialization && (
        <p className="text-xs text-slate-500 mb-4">
          Suggested specialization: <span className="font-bold text-indigo-600">{results.inferredSpecialization}</span>
        </p>
      )}

      {!position && !locationError && (
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
          <Loader2 size={16} className="animate-spin" /> Getting your location…
        </div>
      )}

      {position && (
        <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm" style={{ height: "480px" }}>
          <MapContainer center={[position.lat, position.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[position.lat, position.lng]} icon={USER_ICON}>
              <Popup>You are here</Popup>
            </Marker>

            {results?.internal?.map((doc) => {
              const [lng, lat] = doc.location?.coordinates || [];
              if (lat == null || lng == null) return null;
              return (
                <Marker key={doc._id} position={[lat, lng]} icon={INTERNAL_ICON}>
                  <Popup>
                    <div className="text-xs space-y-1">
                      <p className="font-bold">Dr. {doc.name}</p>
                      <p className="text-slate-500">{doc.specialization}</p>
                      {doc.hospitalName && <p className="text-slate-500">{doc.hospitalName}</p>}
                      {doc.distanceMeters != null && (
                        <p className="text-slate-400">{(doc.distanceMeters / 1000).toFixed(1)} km away</p>
                      )}
                      <a href="/SlotBooking" className="text-indigo-600 font-bold block mt-1">
                        Book Appointment &rarr;
                      </a>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {results?.external?.map((h, i) => (
              <Marker key={i} position={[h.lat, h.lon]} icon={EXTERNAL_ICON}>
                <Popup>
                  <div className="text-xs space-y-1">
                    <p className="font-bold">{h.name}</p>
                    {h.address && <p className="text-slate-500">{h.address}</p>}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lon}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 font-bold flex items-center gap-1 mt-1"
                    >
                      <Navigation size={11} /> Get Directions
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" /> You
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> AuraHealth doctors
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-600 inline-block" /> Other hospitals
        </span>
      </div>
    </div>
  );
};

export default NearbyHospitals;
