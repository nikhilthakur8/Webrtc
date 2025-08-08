## PeerJS Video Calling App

A minimal multi-peer video calling demo built with React 19, Vite, TailwindCSS v4 and PeerJS.

### Features

-   Unique peer ID on load
-   Call any peer by their ID
-   Auto-answer incoming calls
-   Multiple remote stream tiles
-   Toggle audio & video
-   Screen sharing (replaces video track until stopped)
-   Responsive layout using Tailwind

### Install

```bash
npm install
```

### Run Dev

```bash
npm run dev
```

Open the dev URL in two browsers / devices. Copy one ID into the other and press Call.

### Production Build

```bash
npm run build
npm run preview
```

### Screen Share

Click Share Screen. When you stop sharing the camera feed resumes automatically.

### Optional: Self-host PeerServer

```bash
npx peerjs --port 9000
```

Then edit `PeerContext.jsx` Peer constructor:

```js
const peer = new Peer(id, { host: "localhost", port: 9000, path: "/" });
```

### Future Enhancements

-   Data channel chat
-   Better reconnection logic
-   Mute / speaking indicators
-   Room codes & lobby

MIT License
