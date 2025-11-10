import { useRef, useEffect } from "react";

function AnimatedCharacter() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Simple placeholder for now
    ctx.fillStyle = "#4A5568";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFF";
    ctx.font = "20px Arial";
    ctx.fillText("Character will appear here", 50, 150);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={640}
      height={480}
      className="character-canvas"
    />
  );
}

export default AnimatedCharacter;
