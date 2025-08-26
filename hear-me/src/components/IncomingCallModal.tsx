import { PhoneIncoming, PhoneOff, Phone, Video } from "lucide-react";

interface IncomingCallProps {
  from: string;
  type?: "audio" | "video"; // 👈 add call type
  onAccept: () => void;
  onDecline: () => void;
}

export default function IncomingCallModal({
  from,
  type = "audio",
  onAccept,
  onDecline,
}: IncomingCallProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900/90 border border-gray-700 text-white rounded-3xl p-8 w-96 shadow-2xl flex flex-col items-center animate-fadeIn">
        {/* Caller Icon */}
        <div className="bg-green-500/20 p-6 rounded-full mb-5 animate-pulse">
          {type === "video" ? (
            <Video className="w-10 h-10 text-green-400" />
          ) : (
            <PhoneIncoming className="w-10 h-10 text-green-400" />
          )}
        </div>

        {/* Caller Info */}
        <h2 className="text-2xl font-bold mb-1">{from}</h2>
        <p className="text-gray-400 mb-8 tracking-wide">
          is {type === "video" ? "starting a video call…" : "calling…"}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-16">
          {/* Decline */}
          <button
            onClick={onDecline}
            className="bg-red-600 hover:bg-red-500 text-white p-5 rounded-full shadow-lg transition transform hover:scale-110 focus:ring-4 focus:ring-red-400/50"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          {/* Accept */}
          <button
            onClick={onAccept}
            className="bg-green-600 hover:bg-green-500 text-white p-5 rounded-full shadow-lg transition transform hover:scale-110 focus:ring-4 focus:ring-green-400/50"
          >
            {type === "video" ? (
              <Video className="w-6 h-6" />
            ) : (
              <Phone className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
