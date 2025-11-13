// Simple Express server to proxy D-ID API requests
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = 3001;

// Your D-ID API key
const D_ID_API_KEY = "bWlzdGVyZ2FyYXdhcmFAZ21haWwuY29t:ITBDqzaojtTSSrkLHnN3Z";

app.use(cors()); // Allow requests from your React app
app.use(express.json({ limit: "50mb" })); // Handle large base64 images

// Create animation endpoint
app.post("/api/create-animation", async (req, res) => {
  try {
    const { imageData } = req.body;

    console.log("Step 1: Uploading image to D-ID...");

    // First, upload the image to D-ID
    const uploadResponse = await fetch("https://api.d-id.com/images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${D_ID_API_KEY}`,
      },
      body: JSON.stringify({
        image: imageData,
      }),
    });

    const uploadData = await uploadResponse.json();

    if (!uploadResponse.ok) {
      console.error("D-ID Upload Error:", uploadData);
      return res.status(uploadResponse.status).json(uploadData);
    }

    const imageUrl = uploadData.url;
    console.log("Step 2: Image uploaded! URL:", imageUrl);

    // Now create the animation using the uploaded image URL
    console.log("Step 3: Creating animation...");

    const response = await fetch("https://api.d-id.com/talks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${D_ID_API_KEY}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        source_url: imageUrl,
        script: {
          type: "text",
          input: "Hello! I am alive now!",
          provider: {
            type: "microsoft",
            voice_id: "en-US-JennyNeural",
          },
        },
        config: {
          fluent: true,
          pad_audio: 0,
          stitch: true,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("D-ID Error:", data);
      return res.status(response.status).json(data);
    }

    console.log("Step 4: Animation started! ID:", data.id);
    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Check animation status endpoint
app.get("/api/check-animation/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await fetch(`https://api.d-id.com/talks/${id}`, {
      headers: {
        Authorization: `Basic ${D_ID_API_KEY}`,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log("React app can now make API calls through this server!");
});
