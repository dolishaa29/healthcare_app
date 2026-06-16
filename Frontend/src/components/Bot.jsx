import React, { useState } from "react";
import axios from "axios";

const Bot = () => {
  const [isOpen, setIsOpen] = useState(false);
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
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/chat`, {
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 w-80 border rounded-xl shadow-lg bg-white p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Health Bot</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
            </button>
          </div>

          <div className="h-64 overflow-y-auto border p-2 mb-3 rounded">
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
            {loading && <p className="text-sm text-gray-400">Typing...</p>}
          </div>

          <div className="flex gap-2">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask health question..."
              className="flex-1 border px-3 py-2 rounded text-sm"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 rounded text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl"
        title="Health Bot"
      >
        💬
      </button>
    </div>
  );
};

export default Bot;