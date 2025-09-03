// CallScreen.tsx
import type { RefObject } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";


interface CallScreenProps {
  onEnd: () => void;
  micOn: boolean;
  onToggleMic: () => void;
  videoOn: boolean;
  onToggleVideo: () => void;
  localVideoRef: RefObject<HTMLVideoElement>;
  remoteVideoRef: RefObject<HTMLVideoElement>;
}

export default function CallScreen({
  onEnd,
  micOn,
  onToggleMic,
  videoOn,
  onToggleVideo,
  localVideoRef,
  remoteVideoRef,
}: CallScreenProps) {
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
      <div className="absolute bottom-6 flex gap-6 bg-black/40 px-6 py-3 rounded-full">
        {/* Mic Toggle */}
        <button
          onClick={onToggleMic}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white"
        >
          {micOn ? <Mic size={24} /> : <MicOff size={24} className="text-red-500" />}
        </button>

        {/* Video Toggle */}
        <button
          onClick={onToggleVideo}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white"
        >
          {videoOn ? (
            <Video size={24} />
          ) : (
            <VideoOff size={24} className="text-red-500" />
          )}
        </button>

        {/* End Call */}
        <button
          onClick={onEnd}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white"
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
}
