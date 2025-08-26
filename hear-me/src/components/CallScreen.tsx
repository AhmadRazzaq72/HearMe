// CallScreen.tsx
import React from "react";

export default function CallScreen({
  peerUser,
  onEnd,
  micOn,
  onToggleMic,
  videoOn,
  onToggleVideo,
  localVideoRef,
  remoteVideoRef,
}: any) {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center bg-black relative">
      {/* Remote Video */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Local Preview (small box) */}
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="w-40 h-40 object-cover absolute bottom-4 right-4 rounded-lg shadow-lg border-2 border-white"
      />

      {/* Controls */}
      <div className="absolute bottom-4 flex gap-4">
        <button onClick={onToggleMic}>{micOn ? "Mute" : "Unmute"}</button>
        <button onClick={onToggleVideo}>
          {videoOn ? "Video Off" : "Video On"}
        </button>
        <button onClick={onEnd}>End</button>
      </div>
    </div>
  );
}
