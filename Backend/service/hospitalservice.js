const Doctor = require("../model/doctor");
const axios = require("axios");
const { inferSpecialization } = require("./triageservice");

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getInternalDoctors(lat, lng, radiusKm, specialization) {
  const pipeline = [
    {
      $geoNear: {
        near: { type: "Point", coordinates: [lng, lat] },
        distanceField: "distanceMeters",
        maxDistance: radiusKm * 1000,
        spherical: true,
        query: { doctorstatus: "unblock" },
      },
    },
  ];

  if (specialization) {
    pipeline.push({ $match: { specialization: new RegExp(escapeRegex(specialization), "i") } });
  }

  pipeline.push(
    { $limit: 20 },
    { $project: { name: 1, specialization: 1, hospitalName: 1, HospitalAddress: 1, location: 1, distanceMeters: 1 } }
  );

  return Doctor.aggregate(pipeline);
}

async function getExternalHospitals(lat, lng, radiusKm) {
  const radiusMeters = radiusKm * 1000;
  const query = `[out:json][timeout:15];(node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});way["amenity"="hospital"](around:${radiusMeters},${lat},${lng}););out center 15;`;

  try {
    const response = await axios.get("https://overpass-api.de/api/interpreter", {
      params: { data: query },
      timeout: 10000,
    });

    return (response.data.elements || [])
      .map((el) => {
        const tags = el.tags || {};
        const point = el.type === "node" ? { lat: el.lat, lon: el.lon } : el.center;
        if (!point || !tags.name) return null;
        const addressParts = [tags["addr:housenumber"], tags["addr:street"], tags["addr:city"]].filter(Boolean);
        return { name: tags.name, lat: point.lat, lon: point.lon, address: addressParts.join(", ") || null };
      })
      .filter(Boolean)
      .slice(0, 15);
  } catch (err) {
    console.log("Overpass API error:", err.message);
    return [];
  }
}

exports.nearbyHospitals = async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);
  const radiusKm = parseFloat(req.query.radiusKm) || 10;
  const issue = req.query.issue;

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({ success: false, message: "lat and lng are required" });
  }

  let inferredSpecialization = null;
  if (issue) {
    try {
      const triageResult = await inferSpecialization(issue);
      inferredSpecialization = triageResult.specialization;
    } catch (err) {
      console.log("Triage lookup failed for hospital search:", err.message);
    }
  }

  const [internal, external] = await Promise.all([
    getInternalDoctors(lat, lng, radiusKm, inferredSpecialization),
    getExternalHospitals(lat, lng, radiusKm),
  ]);

  res.status(200).json({ success: true, inferredSpecialization, internal, external });
};
