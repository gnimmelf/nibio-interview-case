import { memo, useCallback, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useSpring, a } from "@react-spring/three";
import { Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { css, cx } from "styled-system/css";
import { useGame } from "./GameProvider";
import { useBoardState } from "~/stores/board-state";

const styles = {
  canvas: css({
    w: "full",
    h: "full",
  }),
};

const TILE_SIZE = 1;
const TILE_HEIGHT = 0.5;
const BOARD_SIZE = 13;

const tileBoxGeometry = new THREE.BoxGeometry(TILE_SIZE, TILE_HEIGHT, TILE_SIZE);
const tileMaterial = new THREE.MeshStandardMaterial({ color: "#deb887" });
const tileHoveredMaterial = new THREE.MeshStandardMaterial({ color: "#d2a679" });

const Tile = memo(({ x, y }: { x: number; y: number }) => {
  const isDragging = useBoardState((state) => state.isDragging);
  const [hovered, setHovered] = useState(false);

  const { yPos } = useSpring({
    yPos: hovered ? 0.2 : 0,
    config: { tension: 300, friction: 20 },
  });

  const clickHandler = useCallback(() => console.log('!', { x, y }), []);

  return (
    <a.group
      position={[x * TILE_SIZE, 0, y * TILE_SIZE]}
      position-y={yPos}
      onClick={clickHandler}
      onPointerOver={(e) => {
        if (isDragging) return;
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        if (isDragging) {
          setHovered(false);
          return;
        }
        e.stopPropagation();
        setHovered(false);
      }}
    >
      <mesh geometry={tileBoxGeometry} material={hovered ? tileHoveredMaterial : tileMaterial} />
      <Line
        points={[
          [-0.5 * TILE_SIZE, TILE_HEIGHT / 2 + 0.01, 0],
          [0.5 * TILE_SIZE, TILE_HEIGHT / 2 + 0.01, 0],
        ]}
        color="black"
      />
      <Line
        points={[
          [0, TILE_HEIGHT / 2 + 0.01, -0.5 * TILE_SIZE],
          [0, TILE_HEIGHT / 2 + 0.01, 0.5 * TILE_SIZE],
        ]}
        color="black"
      />
    </a.group>
  );
});

export const Board = memo(() => {
  const offset = ((BOARD_SIZE - 1) * TILE_SIZE) / 2;
  return (
    <group position={[-offset, 0, -offset]}>
      {Array.from({ length: BOARD_SIZE }).map((_, x) =>
        Array.from({ length: BOARD_SIZE }).map((_, y) => (
          <Tile key={`${x}-${y}`} x={x} y={y} />
        ))
      )}
    </group>
  );
});

function CameraControls() {
  const setDragging = useBoardState((state) => state.setDragging);
  return (
    <OrbitControls
      enablePan={false}
      minDistance={10}
      maxDistance={20}
      maxPolarAngle={Math.PI / 2.2}
      onStart={() => setDragging(true)}
      onEnd={() => setDragging(false)}
    />
  );
}

export function GoBoard() {
  const isDragging = useBoardState((state) => state.isDragging);
  const { authData, connectionData, chatMessages } = useGame();
  return (

      <Canvas
        gl={{ antialias: true }}
        className={cx(styles.canvas, isDragging && css({cursor: "pointer"}))}
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

        <Board />

        <CameraControls />
      </Canvas>

  );
}
