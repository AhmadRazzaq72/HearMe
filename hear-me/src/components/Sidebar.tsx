import { Phone, Users, Video } from "lucide-react";

interface SidebarProps {
  onVoiceCall: (user: string) => void;
  onVideoCall: (user: string) => void;
}

export default function Sidebar({ onVoiceCall, onVideoCall }: SidebarProps) {
  const contacts = ["Ali", "Rehman"];

  return (
    <div className="w-80 bg-gray-900 text-white flex flex-col shadow-2xl rounded-r-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-700 flex items-center gap-3 bg-gradient-to-r from-gray-800 to-gray-900">
        <Users className="w-6 h-6 text-green-400" />
        <span className="font-bold text-xl tracking-wide">HearMe</span>
      </div>

      {/* Contacts */}
      <div className="flex-1 overflow-y-auto p-2">
        {contacts.map((user) => (
          <div
            key={user}
            className="flex items-center justify-between p-4 mb-2 bg-gray-800 rounded-2xl shadow-md hover:bg-gray-700 hover:shadow-lg transition-all cursor-pointer"
          >
            <div>
              <div className="font-semibold text-white text-lg">{user}</div>
              <div className="text-sm text-gray-400">Tap to call</div>
            </div>
            <div className="flex gap-2">
              {/* Voice Call Button */}
              <button
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-xl shadow-md transition-transform transform hover:scale-105"
                onClick={() => onVoiceCall(user)}
              >
                <Phone className="w-5 h-5" />
              </button>

              {/* Video Call Button */}
              <button
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl shadow-md transition-transform transform hover:scale-105"
                onClick={() => onVideoCall(user)}
              >
                <Video className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
