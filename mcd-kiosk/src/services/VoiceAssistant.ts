import axios from "axios";

const API_URL = "http://localhost:8000/voice-assistant/";

export const sendVoiceCommand = async (text:any) => {
  try {
    const response = await axios.post(API_URL, { text });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return { error: "Failed to get response" };
  }
};
