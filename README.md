# Interview case NIBIO

# Usage

Set up `./.env`:

```
FRONTEND_HOST=http://localhost
BACKEND_HOST=http://localhost
FRONTEND_PORT=5173
BACKEND_PORT=3001
SECRET_KEY='super-secret-key'
```

Env vars is propagated through for Client in `vite.config::define`, and Server in `app.ts`.

For containers, env vars are propagated with `docker compose` automatically including the `.env` file, then and propagating it through to dockerfile and container, both during build time and runtime.

## Run in containers (Prod)

Run `docker-compose up` from project root dir.

## Local install

### Server

Cd into `./server/`, then:

1. [Install `bun` golbally](https://bun.sh/docs/installation)

2. Install dependencies: `bun install`

3. Run server app:

  - Dev: `(p)npm run dev`

  - Prod: `(p)npm run start`

### Client

Cd into `./client/`, then:

1. Install dependencies `(p)npm i`

2. Run client app:

  - Dev: `(p)npm run dev`

  - Prod: `(p)npm run start`

## Reasonings

Had a look at the case description and though, wow, this is a heavy case.

Started research on go/baduk games written in JS/TS

- Lots of older projects

- Lots of engines and rules

Figured out this is actually a very good case, given the premise that I was to implement what I could as relevant to my resume and by extension the position.

Decided to start with a Chat client.

***Codebase**

For backend tech I wanted to use Bun and Hono; Bun because I like it for smaller projects due to it's leaner, often friendlier APIs, and Hono because I allready have tried out Elysia. For Hono it is also the wide variety of runtime enironments it can be deployed to, and it's lightwight footprint. I found a [Meduim article](https://dev.to/yutakusuno/hono-simple-messaging-app-using-bun-and-websocket-mnk) that I used as a staring point. The structure of the messaging system is taken from here.

The frontend I based off another recent interview case I had using React, Vite, TS and Panda-CSS as design system.

I opted to split the code base into 3 parts, `client`, `server`, and a `shared` folder symlinked into both `client` and `server` for common type defs and constants. Both FE and BE read the same `.env` file in first common ancestor folder.

I am not sure this is a good final solution, but it simplifies development by having close to no coupling and yet share what's common for both codebases.

***Board***

For the board I had three major options: OS project, CSS/SVG+Markup, a grapichs lib either 2d or 3d. After some research, I opted for Lume.io. Unfortunatly Lume was too cutting edge, and I didn't want to spend too much time fighting the missing types, so I went with R3F.

I have a ThreeJs hobby on maps, so I am aqquainted with the basic concepts. Luckily R3F is the defacto 3d lib for React, so documentation is good, and AIs know it well. AIs did most of the coding here, I just asked for the parts I needed.

This was quite interresting. I started out with a board consiting of instanced tiles that I wrapped in a generated SVG texture to get a cross in the middle of each tile to simulate the full board. I did this so that I could raise and color each tile on hover to signal that a position was availaible. This proved to be a very limiting approach, as the materials of instanced meshes cannot be arbitraliy recolored after initialisation without resorting to custom shaders. I tried having AIs build the shader code, but the solution was too spread out due to the componenet structure of instanced meshes, and I couldn't be bothered to dig further. -So I was basically locked to a white board and then I had to choose black and red for player colors.

In retrospect, I should have made one single board and used four instaneced meshes for 1) white stones, 2) black stones and 3)white and 4) black markers for hover. - Then all I would have to do was to hide/show each accoring to hovers, clicks and game state.
