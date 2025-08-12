import express from "express";
import { Client } from "@gradio/client";

const app = express();
app.use(express.json());

let client;
(async () => {
  client = await Client.connect("amd/gpt-oss-120b-chatbot");
})();

app.post("/chat", async (req, res) => {
  const { message, system_prompt = "You are a helpful assistant.", temperature = 0.7 } = req.body;

  if (!client) {
    return res.status(503).json({ error: "Chat client is not ready yet" });
  }

  try {
    const result = await client.predict("/chat", {
      message,
      system_prompt,
      temperature,
    });

    // result.data contains the chatbot response
    res.json({ response: result.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to contact chatbot" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
