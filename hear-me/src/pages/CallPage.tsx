// import { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import SimplePeer from "simple-peer";
// import io from "socket.io-client";

// const socket = io("http://localhost:5000"); // backend server

// export default function CallPage() {
//   const { roomId } = useParams();
//   const myAudio = useRef<HTMLAudioElement>(null);
//   const peerAudio = useRef<HTMLAudioElement>(null);
//   const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);

//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
//       if (myAudio.current) myAudio.current.srcObject = stream;

//       socket.emit("join-room", roomId);

//       socket.on("user-joined", (id) => {
//         const newPeer = new SimplePeer({ initiator: true, trickle: false, stream });
//         newPeer.on("signal", (data) => {
//           socket.emit("signal", { to: id, data });
//         });
//         newPeer.on("stream", (peerStream) => {
//           if (peerAudio.current) peerAudio.current.srcObject = peerStream;
//         });
//         setPeer(newPeer);
//       });

//       socket.on("signal", ({ from, data }) => {
//         if (!peer) {
//           const newPeer = new SimplePeer({ initiator: false, trickle: false, stream });
//           newPeer.on("signal", (answerData) => {
//             socket.emit("signal", { to: from, data: answerData });
//           });
//           newPeer.on("stream", (peerStream) => {
//             if (peerAudio.current) peerAudio.current.srcObject = peerStream;
//           });
//           newPeer.signal(data);
//           setPeer(newPeer);
//         } else {
//           peer.signal(data);
//         }
//       });
//     });
//   }, [roomId]);

//   return (
//     <div className="flex flex-col items-center justify-center h-screen gap-4">
//       <h2 className="text-xl font-bold">Room: {roomId}</h2>
//       <audio ref={myAudio} autoPlay muted />
//       <audio ref={peerAudio} autoPlay />
//       <button className="bg-red-500 text-white px-4 py-2 rounded">
//         Leave Call
//       </button>
//     </div>
//   );
// }
