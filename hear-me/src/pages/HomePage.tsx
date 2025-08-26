// src/pages/HomePage.tsx
import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import CallScreen from "../components/CallScreen";
import IncomingCallModal from "../components/IncomingCallModal";
import { socket, joinSocket } from "../socket";
import SimplePeer from "simple-peer";
import { useSearchParams } from "react-router-dom";
import OutgoingCallScreen from "../components/OutgoingCallScreen";

const pcConfig: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
  ],
};

export default function HomePage() {
  const [inCall, setInCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{
    from: string;
    signal: SimplePeer.SignalData;
    type: "audio" | "video";
  } | null>(null);
  const [peerUser, setPeerUser] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(false);

  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // video refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [outgoingCall, setOutgoingCall] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user") || "Guest";

  // ---- socket listeners ----
  useEffect(() => {
    joinSocket(userId);

    const onIncomingCall = ({
      from,
      signal,
      type,
    }: {
      from: string;
      signal: SimplePeer.SignalData;
      type: "audio" | "video";
    }) => {
      console.log("📥 Incoming", type, "call from", from);
      setIncomingCall({ from, signal, type });
    };

    const onCallAccepted = (signal: SimplePeer.SignalData) => {
      peerRef.current?.signal(signal);
      setOutgoingCall(null);
      setInCall(true);
    };

    const onCallDeclined = () => {
      cleanupCall();
      setOutgoingCall(null);
    };

    const onCallEnded = () => {
      cleanupCall();
      setOutgoingCall(null);
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
  }, [userId]);

  // ----- helpers -----
  function attachRemote(remoteStream: MediaStream) {
    console.log("📺 Remote tracks:", remoteStream.getTracks());

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.onloadedmetadata = () => {
        remoteVideoRef.current?.play().catch((err) =>
          console.warn("Remote video play blocked:", err)
        );
      };
    }
  }

  function makePeer(
    initiator: boolean,
    stream: MediaStream,
    targetUser: string,
    type: "audio" | "video"
  ) {
    const p = new SimplePeer({
      initiator,
      trickle: false,
      stream, // 👈 ensures both audio + video tracks are forwarded
      config: pcConfig,
    });

    p.on("signal", (signalData: SimplePeer.SignalData) => {
      if (initiator) {
        socket.emit("call-user", {
          userToCall: targetUser,
          signalData,
          from: userId,
          type,
        });
      } else {
        socket.emit("answer-call", { to: targetUser, signal: signalData });
      }
    });

    p.on("stream", (remoteStream: MediaStream) => {
      console.log("📺 Remote stream received", remoteStream);
      attachRemote(remoteStream);
    });

    p.on("error", (err) => {
      console.error("Peer error:", err);
      cleanupCall();
    });
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
    setVideoOn(false);
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  }

  // ----- actions -----
  const callUser = async (user: string, isVideo: boolean = false) => {
    if (peerRef.current) return;
    setPeerUser(user);
    setOutgoingCall(user);

    const stream = await getMedia(isVideo);
    makePeer(true, stream, user, isVideo ? "video" : "audio");
    setVideoOn(isVideo);
  };

  async function getMedia(withVideo = false) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: withVideo,
    });

    stream.getTracks().forEach(t => console.log("🔎 Track:", t.kind, t));


    console.log("🎥 Local tracks:", stream.getTracks());

    localStreamRef.current = stream;

 if (localVideoRef.current) {
  localVideoRef.current.srcObject = stream;
  localVideoRef.current.muted = true; // important for self preview
  localVideoRef.current.autoplay = true;
  localVideoRef.current.playsInline = true;

  const playPromise = localVideoRef.current.play();
  if (playPromise !== undefined) {
    playPromise.catch(err =>
      console.warn("▶️ Local video autoplay blocked:", err)
    );
  }
}

    return stream;
  }

  const acceptCall = async () => {
    if (!incomingCall) return;
    const { from, signal, type } = incomingCall;

    setPeerUser(from);
    setInCall(true);
    setIncomingCall(null);
    setVideoOn(type === "video");

    const stream = await getMedia(type === "video");
    const p = makePeer(false, stream, from, type);
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
    setOutgoingCall(null);
  };

  const toggleMic = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    }
  };

  const toggleVideo = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setVideoOn(track.enabled);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        onVoiceCall={(user) => callUser(user, false)}
        onVideoCall={(user) => callUser(user, true)}
      />

      {/* Call Screen */}
      {inCall && (
        <CallScreen
          peerUser={peerUser}
          onEnd={endCall}
          micOn={micOn}
          onToggleMic={toggleMic}
          videoOn={videoOn}
          onToggleVideo={toggleVideo}
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
        />
      )}

      {/* Outgoing Call Screen */}
      {outgoingCall && !inCall && (
        <OutgoingCallScreen toUser={outgoingCall} onCancel={endCall} />
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
      {!inCall && !incomingCall && !outgoingCall && (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-xl">
          Select a contact to start a call
        </div>
      )}
    </div>
  );
}
