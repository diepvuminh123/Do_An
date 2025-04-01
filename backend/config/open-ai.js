import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey:  'sk-f8bfa7ec7d274f47b2fa7a71cb1d4858',
});


export default openai;