function CallControls({
  isMuted,
  isCameraOn,
  onMuteToggle,
  onCameraToggle,
  onEndCall,
}) {
  return (
    <div className="call-controls">
      <button onClick={onMuteToggle} className="control-btn">
        {isMuted ? "🔇" : "🎤"}
      </button>

      <button onClick={onCameraToggle} className="control-btn">
        {isCameraOn ? "📹" : "📷"}
      </button>

      <button onClick={onEndCall} className="control-btn end-call">
        📞
      </button>
    </div>
  );
}

export default CallControls;
