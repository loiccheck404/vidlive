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
    try {
      // Call OUR backend server (which then calls D-ID)
      const response = await fetch(
        "http://localhost:3001/api/create-animation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageData: base64Image,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend Error:", errorData);
        throw new Error(
          `Backend error: ${errorData.error || response.statusText}`
        );
      }

      const data = await response.json();
      const talkId = data.id;

      console.log("Animation created! ID:", talkId);

      // Wait for D-ID to process the video
      return await pollForVideo(talkId);
    } catch (err) {
      console.error("Full error:", err);
      throw new Error(
        `API Error: ${err.message}. Make sure backend server is running!`
      );
    }
  };

  const pollForVideo = async (talkId) => {
    // Check every 3 seconds if video is ready
    for (let i = 0; i < 40; i++) {
      // Try for up to 2 minutes
      await sleep(3000);

      const response = await fetch(
        `http://localhost:3001/api/check-animation/${talkId}`
      );
      const data = await response.json();

      console.log(`Check ${i + 1}: Status = ${data.status}`);

      if (data.status === "done") {
        console.log("Video ready!", data.result_url);
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
