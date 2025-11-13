import { useState } from "react";

function ImageUploader({ onAnimationReady }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Convert image to base64
      const base64Image = await fileToBase64(file);

      // Step 2: Send to D-ID to create animated video
      const videoUrl = await createAnimatedVideo(base64Image);

      // Step 3: Tell parent component we have the video!
      onAnimationReady(videoUrl);
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const createAnimatedVideo = async (base64Image) => {
    const API_KEY = "bWlzdGVyZ2FyYXdhcmFAZ21haWwuY29t:OuFaVbq3xCwP8yNEQEfC6"; // Your D-ID key

    // Create the animation request
    const response = await fetch("https://api.d-id.com/talks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${API_KEY}`,
      },
      body: JSON.stringify({
        source_url: base64Image,
        script: {
          type: "text",
          input: "Hello! I'm alive now!", // The character will say this
        },
        config: {
          fluent: true,
          pad_audio: 0,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create animation");
    }

    const data = await response.json();
    const talkId = data.id;

    // Wait for D-ID to process the video
    return await pollForVideo(talkId, API_KEY);
  };

  const pollForVideo = async (talkId, apiKey) => {
    // Check every 3 seconds if video is ready
    for (let i = 0; i < 40; i++) {
      // Try for up to 2 minutes
      await sleep(3000);

      const response = await fetch(`https://api.d-id.com/talks/${talkId}`, {
        headers: {
          Authorization: `Basic ${apiKey}`,
        },
      });

      const data = await response.json();

      if (data.status === "done") {
        return data.result_url; // Video is ready!
      }

      if (data.status === "error") {
        throw new Error("Video generation failed");
      }
    }

    throw new Error("Timeout waiting for video");
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return (
    <div className="image-uploader">
      <label className="upload-btn">
        {isLoading ? "Creating animation..." : "Upload New Character"}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isLoading}
          style={{ display: "none" }}
        />
      </label>

      {isLoading && (
        <div className="loading-message">
          ⚡ AI is bringing your image to life... This takes 30-60 seconds!
        </div>
      )}

      {error && <div className="error-message">Error: {error}</div>}
    </div>
  );
}

export default ImageUploader;
