// src/pages/HomePage.tsx
import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import CallScreen from "../components/CallScreen";
import IncomingCallModal from "../components/IncomingCallModal";
import { socket, joinSocket } from "../socket";
import SimplePeer from "simple-peer";
import { useSearchParams } from "react-router-dom";

const pcConfig: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:relay.metered.ca:443",
      username: "openai",
      credential: "openai123"
    }

  ], 
};

export default function HomePage() {
  const [inCall, setInCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{
    from: string;
    signal: SimplePeer.SignalData;
  } | null>(null);
  const [peerUser, setPeerUser] = useState("");
  const [micOn, setMicOn] = useState(true);

  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

const [searchParams] = useSearchParams();
const userId = searchParams.get("user") || "Guest";
  // const userId = "Ahmad"; // IMPORTANT: change to a different value in your 2nd tab/device

  useEffect(() => {
    joinSocket(userId);

    // ---- socket listeners (register ONCE) ----
    const onIncomingCall = ({ from, signal }: { from: string; signal: SimplePeer.SignalData }) => {
        console.log("📥 Incoming call from", from);
      setIncomingCall({ from, signal });
    };

    const onCallAccepted = (signal: SimplePeer.SignalData) => {
      peerRef.current?.signal(signal);
    };

    const onCallDeclined = () => {
      cleanupCall();
    };

    const onCallEnded = () => {
      cleanupCall();
    };

    socket.on("incoming-call", onIncomingCall);
    socket.on("call-accepted", onCallAccepted);
    socket.on("call-declined", onCallDeclined);
    socket.on("call-ended", onCallEnded);

    return () => {
      socket.off("incoming-call", onIncomingCall);
      socket.off("call-accepted", onCallAccepted);
      socket.off("call-declined", onCallDeclined);
      socket.off("call-ended", onCallEnded);
      cleanupCall();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- helpers -----
  async function getMic() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;
    if (localAudioRef.current) {
      localAudioRef.current.srcObject = stream;
      localAudioRef.current.muted = true; // avoid echo
      localAudioRef.current.play().catch(() => {});
    }
    return stream;
  }

  function attachRemote(remoteStream: MediaStream) {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStream;
      remoteAudioRef.current.play().catch(() => {});
    }
  }

 function makePeer(initiator: boolean, stream: MediaStream, targetUser: string) {
  const p = new SimplePeer({
    initiator,
    trickle: false,
    stream,
    config: pcConfig,
  });

  p.on("signal", (signalData: SimplePeer.SignalData) => {
    if (initiator) {
      socket.emit("call-user", { userToCall: targetUser, signalData, from: userId });
    } else {
      socket.emit("answer-call", { to: targetUser, signal: signalData });
    }
  });

  p.on("stream", (remoteStream: MediaStream) => attachRemote(remoteStream));
  p.on("error", () => cleanupCall());
  p.on("close", () => cleanupCall());

  peerRef.current = p;
  return p;
}

  function cleanupCall() {
    peerRef.current?.destroy();
    peerRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    setInCall(false);
    setPeerUser("");
    setIncomingCall(null);
    setMicOn(true);
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
    if (localAudioRef.current) localAudioRef.current.srcObject = null;
  }

  // ----- actions -----
 const callUser = async (user: string) => {
  if (peerRef.current) return;
  setPeerUser(user);
  setInCall(true);

  const stream = await getMic();
  makePeer(true, stream, user); // 👈 pass user here
};

const acceptCall = async () => {
  if (!incomingCall) return;
  const { from, signal } = incomingCall;

  setPeerUser(from);
  setInCall(true);
  setIncomingCall(null);

  const stream = await getMic();
  const p = makePeer(false, stream, from); // 👈 pass from here
  p.signal(signal);
};


  const declineCall = () => {
    if (!incomingCall) return;
    socket.emit("decline-call", { to: incomingCall.from });
    setIncomingCall(null);
  };

  const endCall = () => {
    if (peerUser) socket.emit("end-call", { to: peerUser });
    cleanupCall();
  };

  const toggleMic = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar onCall={callUser} />

      {/* Hidden audio elements */}
      <audio ref={localAudioRef} autoPlay playsInline />
      <audio ref={remoteAudioRef} autoPlay playsInline />

      {/* Call Screen */}
      {inCall && (
        <CallScreen
          peerUser={peerUser}
          onEnd={endCall}
          micOn={micOn}
          onToggleMic={toggleMic}
        />
      )}

      {/* Incoming Call Modal */}
      {incomingCall && (
        <IncomingCallModal
          from={incomingCall.from}
          onAccept={acceptCall}
          onDecline={declineCall}
        />
      )}

      {/* Idle */}
      {!inCall && !incomingCall && (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-xl">
          Select a contact to start a call
        </div>
      )}
    </div>
  );
}
