"use client";

import { useState, useRef, useEffect } from "react";

  export default function AIChat({
  dataset,
  eda,
  healthScore,
}) {

  console.log("AI DATA:", dataset, eda, healthScore);

  const [message, setMessage] = useState("");

  const quickQuestions = [
  {
    label: "📊 Dataset Summary",
    question: "Tell me about my dataset"
  },
  {
    label: "⚠ Missing Values",
    question: "Which columns have missing values?"
  },
  {
    label: "🤖 Best Algorithm",
    question: "Which algorithm should I use?"
  },
  {
    label: "🧹 Preprocessing",
    question: "What preprocessing is required?"
  },
  {
    label: "❤️ Data Quality",
    question: "Is my dataset good?"
  }
];

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hello! I'm your AI Dataset Assistant.\nAsk me anything about your uploaded dataset.",
    },
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const getAIResponse = (question) => {
    const q = question.toLowerCase();

    if (q.includes("row")) {
      return dataset
        ? `Your uploaded dataset contains ${dataset.rows} rows.`
        : "Please upload a dataset first.";
    }

    if (q.includes("column")) {
      return dataset
        ? `Your dataset contains ${dataset.columns} columns.`
        : "Please upload a dataset first.";
    }

    if (q.includes("numeric")) {
      return eda
        ? `Your dataset contains ${eda.basic_info.numeric_columns} numeric columns.`
        : "Please upload a dataset first.";
    }

    if (q.includes("categorical")) {
      return eda
        ? `Your dataset contains ${eda.basic_info.categorical_columns} categorical columns.`
        : "Please upload a dataset first.";
    }

    if (q.includes("memory")) {
      return eda
        ? `Memory usage is ${eda.basic_info.memory_usage_mb} MB.`
        : "Please upload a dataset first.";
    }

    if (q.includes("health")) {
      return dataset
        ? `Dataset Health Score is ${healthScore}%.`
        : "Please upload a dataset first.";
    }

    if (q.includes("missing")) {
      if (!eda) {
        return "Please upload a dataset first.";
      }

      const totalMissing = Object.values(eda.missing_values).reduce(
        (sum, value) => sum + value,
        0
      );

      return `Your dataset contains ${totalMissing} missing values.`;
    }

    if (q.includes("algorithm")) {
      if (!dataset) {
        return "Please upload a dataset first.";
      }

      if (dataset.rows > 5000) {
        return "Random Forest or XGBoost are recommended for this dataset.";
      }

      return "Decision Tree or Logistic Regression are good starting models.";
    }

    return "That's a great question! Once the backend AI is connected, I'll provide intelligent answers based on your uploaded dataset.";
  };

  const handleSend = (customMessage = message) => {

  if (!customMessage.trim()) return;


  const userMessage = {
    sender: "user",
    text: customMessage,
  };


  const aiMessage = {
    sender: "ai",
    text: getAIResponse(customMessage),
  };


  setMessages((prev) => [
    ...prev,
    userMessage,
    aiMessage
  ]);


  setMessage("");

};

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">

      <h2 className="text-3xl font-bold text-blue-600 mb-6">
        🤖 AI Dataset Assistant
      </h2>

      <div className="bg-gray-50 border rounded-2xl p-6 h-96 overflow-y-auto space-y-5">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-5 py-3 shadow ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
            >
              <p className="whitespace-pre-line">
                {msg.text}
              </p>
            </div>
          </div>
        ))}

        <div ref={bottomRef}></div>

      </div>

      <div className="flex flex-wrap gap-3 mb-6">

  {quickQuestions.map((item,index)=>(

    <button

      key={index}

      onClick={() => handleSend(item.question)}

      className="
      px-4 py-2
      rounded-full
      bg-blue-50
      text-blue-700
      hover:bg-blue-600
      hover:text-white
      transition
      text-sm
      font-semibold
      "

    >

      {item.label}

    </button>

  ))}

</div>

      <div className="flex flex-col sm:flex-row gap-4 mt-6">

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend(message);
            }
          }}
          placeholder="Ask AI about your dataset..."
          className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSend}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 rounded-xl hover:scale-105 transition"
        >
          Send
        </button>

      </div>

    </div>
  );
}