import { useState } from "react";
import VideoWindow from "./VideoWindow";
import CallControls from "./CallControls";
import AnimatedCharacter from "./AnimatedCharacter";

function CallUI() {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(true);

  const handleMuteToggle = () => setIsMuted(!isMuted);
  const handleCameraToggle = () => setIsCameraOn(!isCameraOn);
  const handleEndCall = () => setIsCallActive(false);

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
      </div>

      {/* Right main area - BIG animated character */}
      <div className="main-character-area">
        {isCameraOn && <AnimatedCharacter />}
      </div>
    </div>
  );
}

export default CallUI;
