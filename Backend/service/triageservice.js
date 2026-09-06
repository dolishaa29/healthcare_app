const { getModel, GEMINI_API_KEY } = require("../config/gemini");
const Doctor = require("../model/doctor");

async function inferSpecialization(symptomsText) {
  const specializations = (await Doctor.distinct("specialization")).filter(Boolean);

  const model = getModel({ generationConfig: { responseMimeType: "application/json" } });

  const prompt = `You are a medical triage assistant. A patient describes their symptoms below. Based on them, recommend which specialization they should see and how urgent it is.

Available specializations on this platform: ${specializations.length ? specializations.join(", ") : "General Physician"}

Respond with strict JSON only, in this exact shape:
{"specialization": "<one of the available specializations, or \\"General Physician\\" if none fit>", "urgency": "low" | "medium" | "high", "reasoning": "<one short sentence>"}

If the symptoms describe a medical emergency (e.g. chest pain, severe bleeding, difficulty breathing, stroke signs), set urgency to "high" and say so in the reasoning.

Patient symptoms: ${symptomsText}`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text();

  try {
    const parsed = JSON.parse(raw);
    return {
      specialization: parsed.specialization || null,
      urgency: parsed.urgency || "low",
      reasoning: parsed.reasoning || "",
    };
  } catch (err) {
    console.error("Triage JSON parse error:", err, raw);
    return { specialization: null, urgency: "low", reasoning: "" };
  }
}

exports.inferSpecialization = inferSpecialization;

exports.triage = async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(400).json({ success: false, message: "GEMINI_API_KEY is not configured" });
    }

    const { symptoms } = req.body;
    if (!symptoms) {
      return res.status(400).json({ success: false, message: "symptoms is required" });
    }

    const triageResult = await inferSpecialization(symptoms);
    res.status(200).json({ success: true, ...triageResult });
  } catch (error) {
    console.error("Triage error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
