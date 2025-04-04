import OpenAI from "openai";
import dotenv from 'dotenv';


dotenv.config();

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey:  process.env.OPEN_AI_KEY,
});


export default openai;