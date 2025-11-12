import { useRef, useEffect } from "react";
import { Animator } from "../utils/animator";

function AnimatedCharacter() {
  const canvasRef = useRef(null);
  const animatorRef = useRef(null);
  const imageRef = useRef(null);
  const lastTimeRef = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    animatorRef.current = new Animator();

    img.onload = () => {
      imageRef.current = img;
      animate();
    };

    img.src = "/characters/character.jpg";

    function animate() {
      const now = Date.now();
      const deltaTime = now - lastTimeRef.current;
      lastTimeRef.current = now;

      animatorRef.current.update(deltaTime);
      draw(ctx, canvas);

      requestAnimationFrame(animate);
    }

    function draw(ctx, canvas) {
      const img = imageRef.current;
      if (!img) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const animator = animatorRef.current;

      // Apply transformations
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.translate(animator.positionX, animator.positionY); // Add position shifts!
      ctx.rotate((animator.rotation * Math.PI) / 180);
      ctx.scale(animator.scale, animator.scale);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Draw image (covers entire canvas)
      const imgRatio = img.width / img.height;
      const canvasRatio = canvas.width / canvas.height;

      let drawWidth, drawHeight, offsetX, offsetY;

      // Fill entire canvas (like object-fit: cover)
      if (imgRatio > canvasRatio) {
        // Image is wider - fit to height
        drawHeight = canvas.height;
        drawWidth = img.width * (canvas.height / img.height);
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      } else {
        // Image is taller - fit to width
        drawWidth = canvas.width;
        drawHeight = img.height * (canvas.width / img.width);
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      ctx.restore(); // End transformations

      // Draw blink overlay AFTER transformations (so it stays in place!)
      const blinkAmount = animator.getBlinkAmount();
      if (blinkAmount > 0) {
        ctx.fillStyle = `rgba(255, 0, 0, 0.8)`; // BRIGHT RED for testing!
        // Adjust these values to match YOUR character's eye position!
        const eyeY = canvas.height * 0.32; // Adjust this up/down
        const eyeHeight = canvas.height * 0.12; // Adjust this bigger/smaller
        ctx.fillRect(0, eyeY, canvas.width, eyeHeight);
      }
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={1920}
      height={1080}
      className="character-canvas"
    />
  );
}

export default AnimatedCharacter;
