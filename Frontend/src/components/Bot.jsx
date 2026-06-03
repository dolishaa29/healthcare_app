import React, { useState } from "react";
import axios from "axios";

const Bot = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!prompt.trim()) return;

    const userMessage = {
      text: prompt,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:7000/chat", {
        prompt,
      });
       console.log("API Response:", res.data.text);


      setMessages((prev) => [
        ...prev,
        {
          text: res.data.text,
          sender: "bot",
        },
      ]);
    } 
    catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Something went wrong",
          sender: "bot",
        },
      ]);
    }

    setPrompt("");
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto border rounded p-4">
      <h2 className="text-xl font-bold mb-4">Health Bot </h2>

      <div className="h-80 overflow-y-auto border p-2 mb-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-3 py-2 rounded ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}

        {loading && <p>Typing...</p>}
      </div>

      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask health question..."
          className="flex-1 border px-3 py-2 rounded"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Bot;