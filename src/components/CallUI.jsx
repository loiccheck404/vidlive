import { useState, useRef, useEffect } from "react";
import VideoWindow from "./VideoWindow";
import CallControls from "./CallControls";
import AnimatedCharacter from "./AnimatedCharacter";
import ImageUploader from "./ImageUploader";

function CallUI() {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(true);
  const [animatedVideoUrl, setAnimatedVideoUrl] = useState(null);
  const videoRef = useRef(null);

  const handleMuteToggle = () => setIsMuted(!isMuted);
  const handleCameraToggle = () => setIsCameraOn(!isCameraOn);
  const handleEndCall = () => setIsCallActive(false);

  const handleAnimationReady = (videoUrl) => {
    setAnimatedVideoUrl(videoUrl);
    console.log("Animated video ready:", videoUrl);
  };

  // Control video mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  if (!isCallActive) {
    return <div className="call-ended">Call Ended</div>;
  }

  return (
    <div className="call-ui">
      {/* Left sidebar - small video preview */}
      <div className="sidebar">
        <VideoWindow />
        <CallControls
          isMuted={isMuted}
          isCameraOn={isCameraOn}
          onMuteToggle={handleMuteToggle}
          onCameraToggle={handleCameraToggle}
          onEndCall={handleEndCall}
        />
        <ImageUploader onAnimationReady={handleAnimationReady} />
      </div>

      {/* Right main area - BIG animated character */}
      <div className="main-character-area">
        {isCameraOn && !animatedVideoUrl && <AnimatedCharacter />}
        {isCameraOn && animatedVideoUrl && (
          <video
            ref={videoRef}
            src={animatedVideoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="animated-video"
          />
        )}
      </div>
    </div>
  );
}

export default CallUI;
