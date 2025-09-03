# Hear-Me (WebRTC Voice/Video Call App)

A real-time peer-to-peer Audio and Video calling web app built with React, TypeScript, WebRTC, and Socket.IO, featuring STUN/TURN support, call management, microphone controls, outgoing call screen, and incoming call modal.

---

## 🚀 Features
- Real-time voice and video calling between users
- Socket.IO-based signaling server
- Call accept/decline modal
- Local and remote video preview
- Mute/unmute microphone
- Toggle video on/off
- End call option
- Simple UI with TailwindCSS and shadcn components

---

## ⚙️ Installation

### 1. Clone the repository
```sh
git clone https://github.com/AhmadRazzaq72/HearMe.git
cd HearMe
```

### 2. Setup Server
```sh
cd voice-call-server
npm install
```

### 3. Setup Client
```sh
cd..
cd hear-me
npm install
```

---

## 🔑 Environment Variables
Create a `.env` file inside both **hear-me/** and **voice-call-server/** directories.

### hear-me `.env`
```env
VITE_SOCKET_SERVER=http://localhost:5000
```

### voice-call-server `.env`
```env
PORT=5000
```

---

## ▶️ Running the App

### Start the Server
```sh
cd server
npm run dev
```

### Start the Client
```sh
cd client
npm run dev
```

The client will run on `http://localhost:5173`  
The server will run on `http://localhost:5000`

---

## 📞 Usage
1. Open `http://localhost:5173/?user=Ahmad` in one browser tab.  
2. Open `http://localhost:5173/?user=Ali` in another tab.  
3. Initiate a voice/video call from one user to the other.  
4. Accept/Decline the call using the modal.  

---

## 🛠️ Tech Stack
- React 19 + TypeScript
- Vite
- TailwindCSS + shadcn/ui
- Socket.IO
- SimplePeer (WebRTC wrapper)
- Express.js (backend signaling server)

---

## 📌 Notes
- Both users must connect to the same signaling server.  
- Works best when tested in different browsers or incognito mode.  
- STUN/TURN servers may be required for connections across different networks.  
