export class Animator {
  constructor() {
    this.blinkTimer = 0;
    this.nextBlinkTime = this.getRandomBlinkDelay();
    this.isBlinking = false;
    this.blinkProgress = 0;
    this.rotation = 0;
    this.scale = 1;
    this.breathingPhase = 0;
  }

  getRandomBlinkDelay() {
    return 2000 + Math.random() * 3000; // 2-5 seconds
  }

  update(deltaTime) {
    // Blink logic
    this.blinkTimer += deltaTime;

    if (this.isBlinking) {
      this.blinkProgress += deltaTime / 200; // 200ms blink duration
      if (this.blinkProgress >= 1) {
        this.isBlinking = false;
        this.blinkProgress = 0;
      }
    } else if (this.blinkTimer >= this.nextBlinkTime) {
      this.isBlinking = true;
      this.blinkTimer = 0;
      this.nextBlinkTime = this.getRandomBlinkDelay();
    }

    // Breathing/idle movement
    this.breathingPhase += deltaTime / 2000;
    this.rotation = Math.sin(this.breathingPhase) * 2; // -2° to +2°
    this.scale = 1 + Math.sin(this.breathingPhase * 0.5) * 0.02; // 0.98 to 1.02
  }

  getBlinkAmount() {
    if (!this.isBlinking) return 0;
    // Smooth blink curve (open -> closed -> open)
    return Math.sin(this.blinkProgress * Math.PI);
  }
}
