# 🚀 Distribution Innovation — Frontend Recruitment Case

**Case assignment: Build a UI using the DI Address Helper API**

This project demonstrates a address search interface powered by the DI Address Helper API. It’s built using Vite, React, and PandaCSS — a utility-first design system generator.

## 🛠 Setup

Clone the repo:

```bash
git clone https://github.com/gnimmelf/di-interview-case.git
cd di-interview-case
```

Install dependencies:

```bash
pnpm install
# or
npm install
```

> ⚠️ If you're using `pnpm`, you may need to grant the `esbuild` binary execution permissions. Do that if prompted.

Build the PandaCSS design system:

```bash
pnpm run prepare
# or
npx panda codegen
```

> 🐼 This should happen automatically after install, but hey — now you know.

Start the development server:

```bash
pnpm run dev
```

## 🤔 Project Notes

I may have slightly missed the intended focus of the assignment — validating full addresses. Instead, I implemented a solution that allows users to drill down from street search to specific address candidates. This decision was influenced by how the DI API documentation itself is structured.

### 🎯 My Goals

1. **Integrate PandaCSS**
   I'm currently learning PandaCSS and wanted to integrate it as a foundation for a scalable design system.

2. **Create a Cascading Fetch Flow**
   I focused on building a clean, DRY architecture for sequential API calls — from street name → house number → full address. This was abandoned when I added the map view, and I had to stack the components sequentially to have be able to apply styling in a better way.

3. **Reacquaint Myself with React**
   Having had a few years away from fulltime React development (and a few years with SolidJs), I wanted to try and hit as many snags as possible.

4. **Stretch Goal: Map Integration**
   Implement som map-view. I went with vis.gl's react-google-map on a whim. A bit rushed.

## 🧪 Known Issues

- API calls in tests aren’t mocked or isolated yet, and fail with a 400 towards the stage env. Needs more time and setup.

## 🔍 Notes to self

React's `StrictMode` is a development-only tool that helps identify side effects and potential bugs by intentionally double-invoking key lifecycle behaviors. It:

- Double-renders components to test for unintended side effects.
- Warns about deprecated APIs and unsafe lifecycles.
- Simulates mount/unmount to ensure proper effect cleanup.
- Does **not** affect production builds.

You can disable it by removing `<React.StrictMode>` from `index.tsx`, but keeping it is encouraged for catching issues early in development.
