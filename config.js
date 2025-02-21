import dotenv from "dotenv";
dotenv.config();

const config = {
//   baseUrl: "https://openrouter.ai/api/v1",
  geminiApiKey: process.env.OPENAI_API_KEY,  // Ensure it matches the `.env` file
};
console.log(config.baseUrl);

export default config;
