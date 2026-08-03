import api from "./api";

export const analyzeDataset = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/eda", formData);

  return response.data;
};