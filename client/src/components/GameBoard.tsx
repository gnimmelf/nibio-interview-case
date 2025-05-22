import React, { memo, useEffect, useState } from "react";
import { css, cx } from "styled-system/css";
import { Canvas } from "@react-three/fiber";
import { useGame } from "./ConnectionProvider";
import { useBoardState } from "~/stores/board-state";
// Board imports
import { Instances, Instance, OrbitControls, Box } from "@react-three/drei";
import { animated as a, useSpring } from "@react-spring/three";
import { ThreeEvent } from "@react-three/fiber";
import { Vector2 } from "three";

const styles = {
  container: css({
    w: "full",
    h: "full",
  }),
  canvas: css({
    w: "full",
    h: "full",
  }),
};

const TILE_SIZE = 1;
const TILE_HEIGHT = 0.5;
const BOARD_SIZE = 13;
const HOVER_LIFT = 0.2;

// Wrap Drei’s Instance so springs work
const AnimatedInstance = a(Instance);

type ActiveTile = {
  id: number;
  pos: Vector2;
};

interface TileInstanceProps {
  id: number;
  isHovered: boolean;
  position: [number, number, number];
  onPointerOver?: (event: ThreeEvent<MouseEvent>) => void;
  onPointerOut?: (event: ThreeEvent<MouseEvent>) => void;
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
}

// Precompute an array of { id, position } for all tiles
const tiles = (() => {
  const out: { id: number; pos: [number, number, number] }[] = [];
  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      const id = x * BOARD_SIZE + y;
      out.push({
        id,
        pos: [
          (x - (BOARD_SIZE - 1) / 2) * TILE_SIZE,
          0,
          (y - (BOARD_SIZE - 1) / 2) * TILE_SIZE,
        ] as [number, number, number],
      });
    }
  }
  return out;
})();


const TileInstance: React.FC<TileInstanceProps> = ({
  id,
  isHovered,
  position,
  ...props
}) => {
  // Spring for this tile’s Y offset
  const { positionY } = useSpring({
    positionY: isHovered ? HOVER_LIFT : 0,
    config: { tension: 600, friction: 20 },
  });

  return (
    <AnimatedInstance
      {...props}
      position-x={position[0]}
      position-y={positionY}
      position-z={position[2]}
    />
  );
}

const Board: React.FC<{
  onTileClick: (arg: ActiveTile) => void;
}> = memo(({ onTileClick }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <Instances limit={BOARD_SIZE * BOARD_SIZE} castShadow receiveShadow>
      <boxGeometry args={[TILE_SIZE, TILE_HEIGHT, TILE_SIZE]} />
      <meshStandardMaterial color="burlywood" />

      {tiles.map(({ id, pos }) => (
        <TileInstance
          key={id}
          id={id}
          position={pos}
          isHovered={hovered === id}
          onPointerOut={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            setHovered(null);
          }}
          onPointerOver={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            setHovered(id);
          }}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            onTileClick({
              id,
              pos: new Vector2(id % BOARD_SIZE, Math.floor(id / BOARD_SIZE)),
            });
          }}
        />
      ))}
    </Instances>
  );
});

function CameraControls() {
  const { canDrag, setDragging } = useBoardState((state) => state);
  return (
    <OrbitControls
      enabled={canDrag}
      enablePan={false}
      minDistance={10}
      maxDistance={20}
      maxPolarAngle={Math.PI / 2.2}
      onStart={() => setDragging(true)}
      onEnd={() => setDragging(false)}
    />
  );
}

export function GameBoard() {
  const { canDrag } = useBoardState((state) => state);
  const { authData, connectionData, chatMessages } = useGame();

  const [clickedTile, setClickedTile] = useState<ActiveTile | undefined>();

  useEffect(() => {
    console.log({ canDrag });
  }, [canDrag]);

  useEffect(() => {
    console.log({ clickedTile });
  }, [clickedTile]);

  return (
    <section
      className={styles.container}
      style={{ cursor: canDrag ? "move" : "pointer" }}
    >
      <Canvas
        gl={{ antialias: true }}
        className={styles.canvas}
        camera={{ position: [2, 10, 12], near: 5, far: 30, fov: 70 }}
      >
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[10, 10, 10]} decay={2} intensity={Math.PI} />

        <Board onTileClick={setClickedTile} />

        <CameraControls />
      </Canvas>
    </section>
  );
}
