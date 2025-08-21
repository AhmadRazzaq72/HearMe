import { PhoneIncoming, PhoneOff, Phone } from "lucide-react";

interface IncomingCallProps {
  from: string;
  onAccept: () => void;
  onDecline: () => void;
}

export default function IncomingCallModal({
  from,
  onAccept,
  onDecline,
}: IncomingCallProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-2xl p-6 w-80 shadow-2xl flex flex-col items-center">
        {/* Caller info */}
        <PhoneIncoming className="w-12 h-12 text-green-400 mb-3 animate-bounce" />
        <h2 className="text-xl font-semibold mb-1">{from}</h2>
        <p className="text-gray-400 mb-6">is calling…</p>

        {/* Action buttons */}
        <div className="flex gap-10">
          <button
            onClick={onDecline}
            className="bg-red-600 hover:bg-red-500 text-white p-4 rounded-full shadow-lg transition transform hover:scale-110"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
          <button
            onClick={onAccept}
            className="bg-green-600 hover:bg-green-500 text-white p-4 rounded-full shadow-lg transition transform hover:scale-110"
          >
            <Phone className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
