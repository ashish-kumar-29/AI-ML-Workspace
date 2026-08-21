import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

// ============================================================
// AI CHATBOT
// ============================================================

export const sendChatMessage = async (query, conversationId = "default") => {
  const response = await api.post("/chat", {
    query,
    conversation_id: conversationId,
  });

  return response.data;
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default api;
