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
      ctx.rotate((animator.rotation * Math.PI) / 180);
      ctx.scale(animator.scale, animator.scale);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Draw image
      const imgRatio = img.width / img.height;
      const canvasRatio = canvas.width / canvas.height;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgRatio > canvasRatio) {
        drawHeight = canvas.height;
        drawWidth = img.width * (canvas.height / img.height);
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = canvas.width;
        drawHeight = img.height * (canvas.width / img.width);
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      // Draw blink
      const blinkAmount = animator.getBlinkAmount();
      if (blinkAmount > 0) {
        ctx.fillStyle = `rgba(0, 0, 0, ${blinkAmount * 0.8})`;
        // Cover eyes area (adjust these values based on your image)
        const eyeY = canvas.height * 0.35;
        const eyeHeight = canvas.height * 0.08;
        ctx.fillRect(0, eyeY, canvas.width, eyeHeight);
      }

      ctx.restore();
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
