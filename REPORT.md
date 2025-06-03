# Report 📝

## AI usage 🤖

No agentic AI was used in the development of this codebase 🐰👍

Non-premium ChatGPT and Grok have been consultet with extensisvely to discuss tech choices, and to provide code snippet and suggestions. - This especially for containerization and 3D board.

## Architecture 🏛️

Codebase is spit into three `client`, `server` and `shared`. No workspace solution is used because this makes either server subsidient to client or vice-versa, something that restricts architectural re-evaluations at an early stage, and is not advisable unless it is required or given.

### Codebase 🛠️

**Backend**: Chose Bun for lean APIs and Hono for lightweight, versatile runtime support. Used [this Medium article](https://dev.to/yutakusuno/hono-simple-messaging-app-using-bun-and-websocket-mnk) as a starting point for messaging system structure.

**Frontend**: Built on a prior React, Vite, TS, Panda-CSS case.

Split codebase into `client`, `server`, and `shared` (symlinked for types/constants). Both `client` and `server` read `.env` from the first common ancestor folder. This reduces coupling while sharing common elements. —This may not be final solution but simplifies spinning up a solution for development.

Npm vs pnpm: Pnpm has a much better DX than npm, but is not the idiomatic container Node pkg-manager.

### Board 🎲

For the board, my options were:

- use some existing OS project
- code it using CSS/SVG+Markup
- use a 2D/3D graphics library

I went with a 3d lib. I initially chose Lume.io, but I was not able to set up adequate type support, so I switched to R3F (React Three Fiber). I am familiar with Three.js from my map hobby; R3F has solid docs and AI support. AI coded most board logic per my detailed requests.

Initial approach: instanced tiles with SVG texture for board crosses, raising/coloring on hover. I found this to be severely limited by instanced mesh material constraints (no arbitrary recoloring without custom shaders). AI shader attempts were too complex. As a solution I settled on white board, black/red player colors.

## Afterthoughts 🤔

For the board, I should’ve used one board with instanced meshes (white/black stones) for simpler hover/click/state management.

I decided to add containerization instead of implementing more of the go game rules, because containerizarion is more relevant to my skill set, and I want to learn more. 📚🚀

A db (PG) container was asked for, but as the repo is split into two distinct codebases, server and client, I get two containers anyway. I hope this is satisfactory.

