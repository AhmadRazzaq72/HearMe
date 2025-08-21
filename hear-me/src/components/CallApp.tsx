import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import CallScreen from "./CallScreen";
import { socket, joinSocket } from "../socket";
import SimplePeer from "simple-peer";

export default function CallApp() {
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
  const userId = "Ahmad"; // Change in project 2

  useEffect(() => {
    joinSocket(userId);

    // Receive incoming call
    socket.on("incoming-call", async ({ from, signal }) => {
      setActiveCall(from);
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

  const callUser = async (userToCall: string) => {
    setActiveCall(userToCall);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const newPeer = new SimplePeer({ initiator: true, trickle: false, stream });

    newPeer.on("signal", (signalData) => {
      socket.emit("call-user", { userToCall, signalData, from: userId });
    });

    newPeer.on("stream", (remoteStream) => {
      const audio = document.createElement("audio");
      audio.srcObject = remoteStream;
      audio.play();
    });

    setPeer(newPeer);
  };

  const endCall = () => {
    peer?.destroy();
    setPeer(null);
    setActiveCall(null);
  };

  return (
    <div className="flex h-screen">
      <Sidebar onCall={callUser} />
      <div className="flex-1">
        {activeCall ? (
          <CallScreen peerUser={activeCall} onEnd={endCall} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-black-500 text-xl">
            Select a contact to start a call
          </div>
        )}
      </div>
    </div>
  );
}
