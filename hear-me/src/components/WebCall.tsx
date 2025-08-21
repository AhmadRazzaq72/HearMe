import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function WebCall() {
  const [inCall, setInCall] = useState(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
const pcRef = useRef<RTCPeerConnection | null>(null);
const audioRef = useRef<HTMLAudioElement | null>(null);

useEffect(() => {
  if (audioRef.current && remoteStream) {
    audioRef.current.srcObject = remoteStream;
  }
}, [remoteStream]);

  useEffect(() => {
    pcRef.current = new RTCPeerConnection();
    pcRef.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    

    socket.on("incoming-call", async ({ from, offer }) => {
      await pcRef.current?.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pcRef.current?.createAnswer();
      await pcRef.current?.setLocalDescription(answer!);

      socket.emit("answer-call", { to: from, answer });
    });

    socket.on("call-answered", async ({ answer }) => {
      await pcRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", ({ candidate }) => {
      pcRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
    });

    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { to: "target-user-id", candidate: event.candidate });
      }
    };
  }, []);

  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => pcRef.current?.addTrack(track, stream));

    const offer = await pcRef.current?.createOffer();
    await pcRef.current?.setLocalDescription(offer!);

    socket.emit("call-user", { to: "target-user-id", offer });
    setInCall(true);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-4">Web Voice Call</h2>
      {inCall ? (
        <div>
          <p>On Call...</p>
{remoteStream && <audio ref={audioRef} autoPlay controls />}
          <button className="bg-red-500 text-white px-4 py-2 rounded">End Call</button>
        </div>
      ) : (
        <button
          onClick={startCall}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Start Call
        </button>
      )}
    </div>
  );
}
