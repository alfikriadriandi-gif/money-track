import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/process-voice", async (req, res) => {
    try {
        const { transcript, kategoriList } = req.body;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            Kamu adalah asisten keuangan pribadi. Ekstrak data dari kalimat ini: "${transcript}"
            Daftar kategori yang tersedia: [${kategoriList.join(", ")}]
            
            Kembalikan HANYA JSON murni (tanpa markdown):
            {"kategori": "nama_kategori_yang_cocok", "nominal": angka_saja}
            
            Aturan:
            1. Pilih kategori paling relevan dari daftar di atas.
            2. Ubah kata seperti "ceban" jadi 10000, "goceng" jadi 5000, "dua puluh ribu" jadi 20000.
            3. Jika tidak ada nominal, set nominal ke 0.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Membersihkan string jika Gemini iseng kasih backticks ```json
        const cleanJson = responseText.replace(/```json|```/g, "").trim();
        const data = JSON.parse(cleanJson);

        res.json(data);
    } catch (error) {
        console.error("Error Gemini:", error);
        res.status(500).json({ error: "Gagal memproses AI" });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend AI jalan di http://localhost:${PORT}`);
});