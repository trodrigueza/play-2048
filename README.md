# 2048

A modern React implementation of the classic **[2048 game](https://play2048.co/)** originally created by [Gabriele Cirulli](https://github.com/gabrielecirulli).  
This version is built with **React + Vite**, supports keyboard & swipe controls, and integrates with **Firebase** to store scores and show a live leaderboard.

---

## Installation and Setup

Clone the repo and install dependencies:

```bash
git clone https://github.com/trodrigueza/play-2048.git
cd play-2048
npm install
````

### Development server

```bash
npm run dev
```

Runs the app locally at [http://localhost:5173](http://localhost:5173).

### Build

```bash
npm run build
```

### Preview build
```bash
npm run preview
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

(Uses `gh-pages` to publish the `dist/` folder)

## Firebase Setup

1. Create a Firebase project.
2. Enable **Cloud Firestore**.
3. Add your Firebase config in `src/firebase.js` (not included in repo).

   ```js
   import { initializeApp } from "firebase/app";
   import { getFirestore } from "firebase/firestore";

   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };

   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   ```
4. The app will now save and load scores.

## How to Play

* Use **Arrow Keys** (desktop) or **Swipe** (mobile) to move tiles.
* When two tiles with the same number collide, they merge into one.
* Reach **2048** (or keep going :).
