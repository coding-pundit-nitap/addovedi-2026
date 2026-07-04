# Tech Fest Website

Production-ready MERN website scaffold for the Tech Fest project.

## 📂 Project Structure

- `client/`: React + Vite frontend (Initialized with Three.js frameworks)
- `server/`: Node.js + Express backend (To Be Set Up)
- `docs/`: Documentation and planning assets

---

## 🚀 Welcome Teammates! (Frontend Onboarding)

Welcome to the Tech Fest frontend! We are building an immersive 3D experience leveraging the power of **React**, **Three.js** (via React Three Fiber), and **GSAP**. 

Because of the bleeding-edge nature of modern 3D libraries (specifically strict `peerDependency` requirements between `@react-three/fiber` and `@react-three/drei`), **you must follow these setup instructions exactly.**

### Step-by-Step Installation

#### 1. Requirements
Ensure you have Node.js and NPM installed on your machine. You can verify this by running:
```bash
node -v
npm -v
```

#### 2. Navigate to the Frontend Directory
From the root of this repository, navigate strictly into the `client` directory:
```bash
cd client
```

#### 3. Install Dependencies (⚠️ CRITICAL STEP)
You **MUST** run the installation using the `--legacy-peer-deps` flag. If you try to run a standard `npm install`, npm will throw an `ERESOLVE` error due to peer dependency version mismatching and fail entirely.

Run exactly this:
```bash
npm install --legacy-peer-deps
```

**For context, this securely installs:**
*   **Routing & State:** `react-router-dom`, `zustand`
*   **3D Engine Pipeline:** `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
*   **Animation & UI Interactions:** `gsap`, `framer-motion`
*   **Debugging Tools:** `leva`
*   **Code Quality (Linting):** `eslint`, `prettier`, and respective react plugins.

#### 4. Run the Development Server
Once installation completes without errors, boot up the blazing-fast Vite local environment:
```bash
npm run dev
```

Visit the local link provided in your terminal (typically `http://localhost:5173/`).

---

## 🎨 File System Architecture

To avoid massive merge conflicts and spaghetti code, please adhere to this strict structure inside `client/src`:
- `assets/`: Static directories for `images/`, `models/` (GLTFs/GLBs), `textures/`, `fonts/`, and `videos/`.
- `components/`: Standard 2D UI React components separated by domain (e.g., `hero/`, `events/`, `navbar/`).
- `pages/`: Parent components that mount layouts (e.g., `Home.jsx`, `Events.jsx`).
- `routes/`: Centralized routing mapping handled safely inside `AppRoutes.jsx`. 
- `three/`: All `<Canvas />`, `<Scene />`, `<Lights />`, and `<Effects />` components for Three.js stay heavily quarantined here so we do not tangle 3D runtime code inside standard 2D DOM code. 
- `constants/`: Global definitions, such as thematic variables, live in `theme.js`. Use this file for standardizing colors and fonts across UI. 

Happy coding, let's build something amazing!
