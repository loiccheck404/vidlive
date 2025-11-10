function VideoWindow({ children }) {
  return (
    <div className="video-window">
      <div className="video-display">{children}</div>
      <div className="participant-name">Demo User</div>
    </div>
  );
}

export default VideoWindow;
