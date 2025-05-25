# Report 📝

## AI usage 🤖

No agentic AI was used in the development of this codebase 🐰👍

Non-premium ChatGPT and Grok have been consultet with extensisvely to discuss tech choices, and to provide code snippet and suggestions. - This especially for containerization and 3d board.

## Architecture 🏛️

Codebase is spit into three `client`, `server` and `shared`. No workspace solution is used because this makes either server subsidient to client or vice-versa, something that restricts architectural re-evaluations at an early stage, and is not advisable unless it is required or given.

### Codebase 🛠️

**Backend**: Chose Bun for lean APIs and Hono for lightweight, versatile runtime support. Used [this Medium article](https://dev.to/yutakusuno/hono-simple-messaging-app-using-bun-and-websocket-mnk) as a starting point for messaging system structure.

**Frontend**: Built on a prior React, Vite, TS, Panda-CSS case.

Split codebase into `client`, `server`, and `shared` (symlinked for types/constants). Both read `.env` from the first common ancestor folder. This reduces coupling while sharing common elements—may not be final solution but simplifies dev.

Npm vs pnpm: Pnpm has a much better DX than npm, but is not the defacto container pkg-manager.

### Board 🎲

Options: OS project, CSS/SVG+Markup, or 2D/3D graphics lib. Chose Lume.io, but it lacked types, so switched to R3F (React Three Fiber).
Familiar with Three.js from map hobby; R3F has solid docs and AI support. AI coded most board logic per my requests.
Initial approach: instanced tiles with SVG texture for board crosses, raising/coloring on hover. Limited by instanced mesh material constraints (no arbitrary recoloring without custom shaders). AI shader attempts were too complex.
Settled on white board, black/red player colors.

**Retrospect**: I should’ve used one board with four instanced meshes (white/black stones, white/black hover markers) for simpler hover/click/state management.

## Afterthoughts 🤔

I decided to add containerization instead of implementing more of the go game rules, because containerizarion is more relevant to my skill set, and I want to learn more. 📚🚀

A db (PG) container was asked for, but as the repo is split into two distinct codebases, server and client, I get two containers anyway.

