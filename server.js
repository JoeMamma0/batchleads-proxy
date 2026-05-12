const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;
const BATCHLEADS_API_KEY = process.env.BATCHLEADS_API_KEY;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "BatchLeads Proxy is running" });
});

app.post("/search", async (req, res) => {
  if (!BATCHLEADS_API_KEY) {
    return res.status(500).json({ error: "API key not configured on server" });
  }
  try {
    const response = await fetch("https://api.batchdata.com/api/v1/property/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${BATCHLEADS_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Proxy error: " + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
