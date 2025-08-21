import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import CallScreen from "../components/CallScreen";
import IncomingCallModal from "../components/IncomingCallModal";
import { socket, joinSocket } from "../socket";
import SimplePeer from "simple-peer";

export default function HomePage() {
  const [inCall, setInCall] = useState(false);
const [incomingCall, setIncomingCall] = useState<{ from: string; signal: SimplePeer.SignalData } | null>(null);
  const [peerUser, setPeerUser] = useState<string>("");
  const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);

  const userId = "Ahmad"; // Change for project 2

  // Connect to socket server
  useEffect(() => {
    joinSocket(userId);

    // Handle incoming call
    socket.on("incoming-call", ({ from, signal }) => {
      setIncomingCall({ from, signal });
    });

    // Caller receives answer
    socket.on("call-accepted", (signal) => {
      peer?.signal(signal);
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
    };
  }, [peer]);

  // Function to call another user
  const callUser = async (user: string) => {
    setInCall(true);
    setPeerUser(user);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const newPeer = new SimplePeer({ initiator: true, trickle: false, stream });

    newPeer.on("signal", (signalData) => {
      socket.emit("call-user", { userToCall: user, signalData, from: userId });
    });

    newPeer.on("stream", (remoteStream) => {
      const audio = document.createElement("audio");
      audio.srcObject = remoteStream;
      audio.play();
    });

    setPeer(newPeer);
  };

  // Accept incoming call
  const acceptCall = async () => {
    if (!incomingCall) return;

    const { from, signal } = incomingCall;

    setInCall(true);
    setPeerUser(from);
    setIncomingCall(null);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const newPeer = new SimplePeer({ initiator: false, trickle: false, stream });

    newPeer.on("signal", (signalData) => {
      socket.emit("answer-call", { to: from, signal: signalData });
    });

    newPeer.on("stream", (remoteStream) => {
      const audio = document.createElement("audio");
      audio.srcObject = remoteStream;
      audio.play();
    });

    newPeer.signal(signal);
    setPeer(newPeer);
  };

  // End call
  const endCall = () => {
    peer?.destroy();
    setPeer(null);
    setInCall(false);
    setPeerUser("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar onCall={(user) => callUser(user)} />

      {/* Call Screen */}
      {inCall && <CallScreen peerUser={peerUser} onEnd={endCall} />}

      {/* Incoming Call Modal */}
      {incomingCall && (
        <IncomingCallModal
          from={incomingCall.from}
          onAccept={acceptCall}
          onDecline={() => setIncomingCall(null)}
        />
      )}

      {/* Idle Screen */}
      {!inCall && !incomingCall && (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-xl">
          Select a contact to start a call
        </div>
      )}
    </div>
  );
}
