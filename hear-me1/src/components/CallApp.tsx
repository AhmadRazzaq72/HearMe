import { useState } from "react";
import Sidebar from "./Sidebar";
import CallScreen from "./CallScreen";

export default function CallApp() {
  const [activeCall, setActiveCall] = useState<string | null>(null);

  const handleCall = (user: string) => {
    setActiveCall(user); // Start the call
  };

  const handleEndCall = () => {
    setActiveCall(null); // End the call
  };

  return (
    <div className="flex h-screen">
      <Sidebar onCall={handleCall} />
      <div className="flex-1">
        {activeCall ? (
          <CallScreen peerUser={activeCall} onEnd={handleEndCall} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-xl">
            Select a contact to start a call
          </div>
        )}
      </div>
    </div>
  );
}
