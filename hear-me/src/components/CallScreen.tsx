// src/components/CallScreen.tsx
import { useEffect, useState } from "react";
import { Mic, MicOff, PhoneOff } from "lucide-react";

interface CallScreenProps {
  peerUser: string;
  onEnd: () => void;
  micOn: boolean;
  onToggleMic: () => void;
}

export default function CallScreen({ peerUser, onEnd, micOn, onToggleMic }: CallScreenProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-gray-200 to-gray-100 p-6">
      <div className="flex flex-col items-center gap-6 bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-green-400 to-green-600 flex items-center justify-center text-white text-5xl shadow-lg">
          {peerUser.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold">{peerUser}</h2>
        <p className="text-gray-500">Connected • {m}:{s < 10 ? "0" : ""}{s}</p>

        <div className="flex gap-6 mt-6">
          <button
            onClick={onToggleMic}
            className={`p-4 rounded-full shadow-md transition-transform hover:scale-110 ${
              micOn ? "bg-gray-200 text-black" : "bg-red-400 text-white"
            }`}
            aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
          >
            {micOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>

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
