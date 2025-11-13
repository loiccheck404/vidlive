import { useState } from "react";

function ImageUploader({ onAnimationReady }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [speechText, setSpeechText] = useState(""); // What character should say
  const [showInput, setShowInput] = useState(false);

  const handleCreateAnimation = async () => {
    if (!imageUrl.trim()) {
      setError("Please enter an image URL");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const videoUrl = await createAnimatedVideo(imageUrl, speechText);
      onAnimationReady(videoUrl);
      setShowInput(false);
      setImageUrl("");
      setSpeechText("");
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createAnimatedVideo = async (imageUrl, speechText) => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/create-animation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageData: imageUrl,
            speechText: speechText || "", // Send empty string if no text
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

      return await pollForVideo(talkId);
    } catch (err) {
      console.error("Full error:", err);
      throw new Error(`API Error: ${err.message}`);
    }
  };

  const pollForVideo = async (talkId) => {
    for (let i = 0; i < 40; i++) {
      await sleep(3000);

      const response = await fetch(
        `http://localhost:3001/api/check-animation/${talkId}`
      );
      const data = await response.json();

      console.log(`Check ${i + 1}: Status = ${data.status}`);

      if (data.status === "done") {
        console.log("Video ready!", data.result_url);
        return data.result_url;
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
      {!showInput ? (
        <button className="upload-btn" onClick={() => setShowInput(true)}>
          Upload New Character
        </button>
      ) : (
        <div className="url-input-container">
          <input
            type="text"
            placeholder="Paste image URL (from postimages.org)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="url-input"
            disabled={isLoading}
          />
          <input
            type="text"
            placeholder="What should the character say? (leave empty for silent)"
            value={speechText}
            onChange={(e) => setSpeechText(e.target.value)}
            className="url-input"
            disabled={isLoading}
          />
          <button
            className="upload-btn"
            onClick={handleCreateAnimation}
            disabled={isLoading || !imageUrl.trim()}
          >
            {isLoading ? "Creating..." : "Animate!"}
          </button>
          <button
            className="cancel-btn"
            onClick={() => {
              setShowInput(false);
              setImageUrl("");
              setSpeechText("");
              setError(null);
            }}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      )}

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
