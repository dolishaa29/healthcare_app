const { getModel, GEMINI_API_KEY } = require("../config/gemini");

exports.chat = async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(400).json({
        success: false,
        message: "GEMINI_API_KEY is not configured",
      });
    }

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const model = getModel();

    const result = await model.generateContent(prompt);

    res.status(200).json({
      success: true,
      text: result.response.text(),
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.chatStream = async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(400).json({
      success: false,
      message: "GEMINI_API_KEY is not configured",
    });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: "Prompt is required",
    });
  }

  res.status(200);
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  let clientClosed = false;
  res.on("close", () => {
    clientClosed = true;
  });

  try {
    const model = getModel();
    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      if (clientClosed) break;
      const chunkText = chunk.text();
      if (!chunkText) continue;
      res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
    }

    if (!clientClosed) {
      await result.response;
      res.write(`event: done\ndata: {}\n\n`);
    }
  } catch (error) {
    console.error("Gemini Stream Error:", error);
    if (!clientClosed) {
      res.write(`event: error\ndata: ${JSON.stringify({ message: error.message })}\n\n`);
    }
  } finally {
    if (!clientClosed) res.end();
  }
};
