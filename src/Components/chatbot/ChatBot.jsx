import React, { useState } from "react";

const ChatBot = ({ steps }) => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! Ask me anything about how it works." }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    const response = getBotResponse(input);

    // Use functional update to avoid stale closure
    setMessages(prev => [...prev, userMessage, { sender: "bot", text: response }]);
    setInput("");
  };

  const getBotResponse = (question) => {
    question = question.toLowerCase();

    for (const step of steps) {
      if (
        question.includes(step.title.toLowerCase()) ||
        question.includes("how") ||
        question.includes("step")
      ) {
        return `${step.title}: ${step.desc}`;
      }
    }

    return "Sorry, I couldn't find an answer for that. Try asking about a specific step.";
  };

  return (
    <div
      className="chatbot bg-light p-3 shadow rounded"
      style={{ width: "300px", position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}
    >
      <h5 className="fw-bold mb-2">Ask Me!</h5>
      <div className="chat-window mb-2" style={{ height: "200px", overflowY: "auto" }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-1 text-${msg.sender === "bot" ? "primary" : "dark"}`}>
            <strong>{msg.sender === "bot" ? "Bot" : "You"}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="d-flex">
        <input
          type="text"
          className="form-control me-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask something..."
        />
        <button className="btn btn-primary" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default React.memo(ChatBot);
