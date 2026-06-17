require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function smartParse(text) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // bac
const prompt = `
  Anda adalah asisten pengelola keuangan yang cerdas. 
  Tugas Anda adalah mengekstraksi data dari teks input yang berasal dari Speech-to-Text. 
  Input ini mungkin mengandung kesalahan pendengaran (misal: 'duaribu' menjadi 'dua ribu' atau 'kpi' menjadi 'kopi').

  Aturan Ekstraksi:
  1. Koreksi kata yang salah secara kontekstual (misal: 'mkn' -> 'makan').
  2. Identifikasi NOMINAL (angka), KATEGORI (makanan, transportasi, dll), dan CATATAN.
  3. Jika nominal tidak disebutkan, berikan nilai null.
  4. Balas HANYA dalam format JSON mentah seperti ini: 
     {"amount": 20000, "category": "makanan", "note": "makan siang nasi padang"}

  Teks Input: "${userInput}"
`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const cleanJson = response.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("AI Error:", error);
        return { amount: 0, category: 'lainnya', note: text };
    }
}

module.exports = { smartParse };