// server.js
import fetch from 'node-fetch';
const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
    const { message, system_prompt = "You are a helpful assistant.", temperature = 0.7 } = req.body;

    try {
        // Call the Hugging Face Space API
        const response = await fetch("https://amd-gpt-oss-120b-chatbot.hf.space/run/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                data: [message, system_prompt, temperature]
            })
        });

        const result = await response.json();

        // Hugging Face returns something like { data: ["response text"] }
        res.json({ response: result.data[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to contact chatbot" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
