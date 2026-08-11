import api from "./api";

export const analyzeDataset = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/eda", formData);

  return response.data;
};

export const getAIInsights = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/ai-insights", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};