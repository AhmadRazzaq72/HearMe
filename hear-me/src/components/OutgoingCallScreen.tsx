import { PhoneOff, PhoneOutgoing } from "lucide-react";

interface OutgoingCallScreenProps {
  toUser: string;
  onCancel: () => void;
}

export default function OutgoingCallScreen({ toUser, onCancel }: OutgoingCallScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-gray-200 to-gray-100 p-6">
      <div className="flex flex-col items-center gap-6 bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-green-400 to-green-600 flex items-center justify-center text-white text-5xl shadow-lg">
          {toUser.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold">{toUser}</h2>
        <p className="text-gray-500 flex items-center gap-2">
          <PhoneOutgoing className="w-5 h-5 text-green-500 animate-pulse" />
          Calling…
        </p>

        <button
          onClick={onCancel}
          className="p-4 rounded-full bg-red-500 text-white shadow-md transition-transform hover:scale-110 mt-6"
          aria-label="Cancel call"
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
}
