# Multiplayer Pong – Full‑Stack TypeScript Project

Welcome to **Multiplayer Pong** – a real‑time, two‑player arcade game built with a modern TypeScript stack:

* **Backend**   Node + Express + Socket.IO + ts‑node‑dev
* **Frontend**  Vite + React 18 + Socket.IO client
* **Live Sync**  60 FPS game loop, authoritative server

---

## ⚡ Quick Start

```bash
# 1  Clone
$ git clone <your‑fork‑url>
$ cd pong-multiplayer

# 2  Install deps
$ cd server && npm install
$ cd ../client && npm install

# 3  Run   (two terminals)
# Terminal ① – backend
$ cd server && npm run dev

# Terminal ② – frontend
$ cd client && npm run dev
```

Visit **[http://localhost:5173](http://localhost:5173)** in **two browser tabs** – the first tab plays **LEFT**, the second **RIGHT**.

---

## 🕹 Controls

| Key            | Action               |
| -------------- | -------------------- |
| **W** or **↑** | Move paddle **up**   |
| **S** or **↓** | Move paddle **down** |

Hold the key for smooth, fast motion.

---

## 📁 Project Structure

```
.
├─ client/   # React + Vite frontend
│  ├─ src/
│  │   ├─ App.tsx         # socket logic + controls
│  │   ├─ GameCanvas.tsx  # canvas renderer
│  │   └─ ...
│  └─ vite.config.ts
└─ server/   # Node backend (TypeScript)
   ├─ index.ts   # game server + Socket.IO
   └─ ...
```

---

## 🔑 Key Concepts

1. **Room pairing** – First socket waits, second joins → two players per room.
2. **Authoritative server** – Ball physics, scoring and collision live on the backend.
3. **Smooth controls** – Client loops `requestAnimationFrame` to emit incremental moves.
4. **Side ownership** – Server tags each player `left` or `right`; canvas renders by tag.

---

## 🚀 Deployment Hints

| Layer          | Command                                                                       |
| -------------- | ----------------------------------------------------------------------------- |
| Frontend build | `cd client && npm run build` → static files in *client/dist*                  |
| Backend        | Use **pm2** or **docker** to run `node dist/index.js` after compiling (`tsc`) |

---

