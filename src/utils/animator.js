export class Animator {
  constructor() {
    // Blink system
    this.blinkTimer = 0;
    this.nextBlinkTime = this.getRandomBlinkDelay();
    this.isBlinking = false;
    this.blinkProgress = 0;

    // Movement layers - multiple things happening at once!
    this.breathingPhase = Math.random() * Math.PI * 2; // Start random
    this.microMovementPhase = Math.random() * Math.PI * 2;
    this.slowDriftPhase = Math.random() * Math.PI * 2;

    // Random adjustments (like shifting in your seat)
    this.nextAdjustmentTime = this.getRandomAdjustmentDelay();
    this.adjustmentTimer = 0;
    this.targetRotationOffset = 0;
    this.currentRotationOffset = 0;
    this.targetPositionX = 0;
    this.currentPositionX = 0;

    // Final values
    this.rotation = 0;
    this.scale = 1;
    this.positionX = 0;
    this.positionY = 0;
  }

  getRandomBlinkDelay() {
    return 500; // Blink every half second for testing!
  }

  getRandomAdjustmentDelay() {
    return 3000 + Math.random() * 5000; // 3-8 seconds
  }

  update(deltaTime) {
    // === BLINK LOGIC ===
    this.blinkTimer += deltaTime;

    if (this.isBlinking) {
      this.blinkProgress += deltaTime / 400; // Slower blink = easier to see
      if (this.blinkProgress >= 1) {
        this.isBlinking = false;
        this.blinkProgress = 0;
      }
    } else if (this.blinkTimer >= this.nextBlinkTime) {
      this.isBlinking = true;
      this.blinkTimer = 0;
      this.nextBlinkTime = this.getRandomBlinkDelay();
    }

    // === RANDOM ADJUSTMENTS (like shifting position) ===
    this.adjustmentTimer += deltaTime;
    if (this.adjustmentTimer >= this.nextAdjustmentTime) {
      // Pick new random target
      this.targetRotationOffset = (Math.random() - 0.5) * 3; // -1.5° to +1.5°
      this.targetPositionX = (Math.random() - 0.5) * 10; // -5 to +5 pixels
      this.adjustmentTimer = 0;
      this.nextAdjustmentTime = this.getRandomAdjustmentDelay();
    }

    // Smoothly move toward target
    this.currentRotationOffset +=
      (this.targetRotationOffset - this.currentRotationOffset) * 0.02;
    this.currentPositionX +=
      (this.targetPositionX - this.currentPositionX) * 0.02;

    // === LAYERED MOVEMENTS (multiple waves) ===

    // Breathing - slow, steady
    this.breathingPhase += deltaTime / 3000;
    const breathing = Math.sin(this.breathingPhase) * 2; // -2° to +2°

    // Micro movements - fast, subtle (like tiny head adjustments)
    this.microMovementPhase += deltaTime / 800;
    const microMovement = Math.sin(this.microMovementPhase) * 0.8; // Small jitters

    // Slow drift - very slow, larger movement
    this.slowDriftPhase += deltaTime / 5000;
    const slowDrift = Math.sin(this.slowDriftPhase) * 1.5;

    // === COMBINE EVERYTHING ===
    this.rotation =
      breathing + microMovement + slowDrift + this.currentRotationOffset;

    // Scale for breathing (chest rising/falling)
    this.scale = 1 + Math.sin(this.breathingPhase * 0.8) * 0.015; // Subtle 1.5%

    // Position shifts
    this.positionX = this.currentPositionX;
    this.positionY = Math.sin(this.breathingPhase) * 2; // Slight up/down
  }

  getBlinkAmount() {
    return 1; // ALWAYS VISIBLE for testing!
    // if (!this.isBlinking) return 0;
    // return Math.sin(this.blinkProgress * Math.PI);
  }
}
