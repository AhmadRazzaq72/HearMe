import { useState, useEffect } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

interface CallScreenProps {
  peerUser: string;
  onEnd: () => void;
}

export default function CallScreen({ peerUser, onEnd }: CallScreenProps) {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const remainingSeconds = sec % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-gray-200 to-gray-100 p-6">
      <div className="flex flex-col items-center gap-6 bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm">
        {/* Avatar */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-green-400 to-green-600 flex items-center justify-center text-white text-5xl shadow-lg">
          {peerUser.charAt(0).toUpperCase()}
        </div>

        {/* Call info */}
        <h2 className="text-2xl font-bold">{peerUser}</h2>
        <p className="text-gray-500">Connected • {formatTime(seconds)}</p>

        {/* Controls */}
        <div className="flex gap-6 mt-6">
          {/* Mic */}
          <button
            onClick={() => setMicOn(!micOn)}
            className={`p-4 rounded-full shadow-md transition-transform hover:scale-110 ${
              micOn ? "bg-gray-200 text-black" : "bg-red-400 text-white"
            }`}
            aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
          >
            {micOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>

          {/* Video */}
          <button
            onClick={() => setVideoOn(!videoOn)}
            className={`p-4 rounded-full shadow-md transition-transform hover:scale-110 ${
              videoOn ? "bg-gray-200 text-black" : "bg-red-400 text-white"
            }`}
            aria-label={videoOn ? "Turn off video" : "Turn on video"}
          >
            {videoOn ? <Video size={24} /> : <VideoOff size={24} />}
          </button>

          {/* End Call */}
          <button
            onClick={onEnd}
            className="p-4 rounded-full bg-red-500 text-white shadow-md transition-transform hover:scale-110"
            aria-label="End call"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
