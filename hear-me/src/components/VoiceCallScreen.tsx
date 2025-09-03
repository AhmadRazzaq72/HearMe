import { Mic, MicOff, PhoneOff } from "lucide-react";

interface VoiceCallScreenProps {
  peerUser: string;
  micOn: boolean;
  onToggleMic: () => void;
  onEnd: () => void;
}
export default function VoiceCallScreen({
  peerUser,
  micOn,
  onToggleMic,
  onEnd,
}: VoiceCallScreenProps) {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white relative">
      {/* Peer Info */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold">{peerUser}</h2>
        <p className="text-gray-400 mt-2">Voice call in progress…</p>
      </div>

      {/* Controls */}
      <div className="flex gap-6">
        {/* Mic Toggle */}
        <button
          onClick={onToggleMic}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-800 hover:bg-gray-700"
        >
          {micOn ? <Mic size={28} /> : <MicOff size={28} className="text-red-500" />}
        </button>

        {/* End Call */}
        <button
          onClick={onEnd}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700"
        >
          <PhoneOff size={28} />
        </button>
      </div>
    </div>
  );
}
