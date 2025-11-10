import { useRef, useEffect, useState } from "react";

function AnimatedCharacter() {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      console.log("✅ Image loaded!", img.width, img.height);
      setStatus(`Image loaded: ${img.width}x${img.height}`);

      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    img.onerror = () => {
      console.error("❌ Failed to load image");
      setStatus("Failed to load image");
    };

    console.log("🔄 Attempting to load:", "/characters/character.jpg");
    img.src = "/characters/character.jpg";
  }, []);

  return (
    <div>
      <div style={{ color: "yellow", padding: "10px" }}>{status}</div>
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="character-canvas"
      />
    </div>
  );
}

export default AnimatedCharacter;
