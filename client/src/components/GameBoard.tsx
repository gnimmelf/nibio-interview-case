import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { css, cx } from "styled-system/css";
import { useGame } from "./ConnectionProvider";
import { useBoardState } from "~/stores/board-state";
// Board imports
import { Canvas, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { Instances, Instance, OrbitControls, Box } from "@react-three/drei";
import * as textures from "../lib/textures";

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

type ActiveTile = {
  id: number;
  pos: THREE.Vector2;
};

type Vector3Array = [x: number, y: number, z: number];

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
        ] as Vector3Array,
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
  const bottomY = position[1] - TILE_HEIGHT / 2;
  const scaleY = isHovered ? 1.5 : 1;

  return (
    <group
      position={[position[0], bottomY, position[2]]}
      scale={[1, scaleY, 1]}
    >
      <Instance
        {...props}
        position={[0, TILE_HEIGHT / 2, 0]}
        color={isHovered ? "darkgoldenrod" : "white"}
      />
    </group>
  );
};

const Board: React.FC<{
  onTileClick: (arg: ActiveTile) => void;
}> = memo(({ onTileClick }) => {
  const instancesRef = useRef<THREE.InstancedMesh>(null);
  const { setCanDrag, isDragging } = useBoardState();

  const [hovered, setHovered] = useState<number | null>(null);

  const [boxSize, setBoxSize] = useState<Vector3Array>([1, 1, 1]);
  const [boxPosition, setBoxPosition] = useState<Vector3Array>([0, 0, 0]);
  useEffect(() => {
    if (instancesRef.current) {
      const boundingBox = new THREE.Box3().setFromObject(instancesRef.current);
      const size = new THREE.Vector3();
      boundingBox.getSize(size);
      const center = new THREE.Vector3();
      boundingBox.getCenter(center);
      setBoxSize([size.x, size.y, size.z]);
      setBoxPosition([center.x, center.y, center.z]);
    }
  }, [instancesRef.current]);

  const tileTexture = useMemo(() => textures.createMarbleTileTexture(), []);
  const frameTexture = useMemo(() => textures.createOakWoodTexture(), []);

  return (
    <>
      <Instances
        ref={instancesRef}
        limit={BOARD_SIZE * BOARD_SIZE}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[TILE_SIZE, TILE_HEIGHT, TILE_SIZE]} />
        <meshPhysicalMaterial
          color={"darkorange"}
          roughness={0.2}
          metalness={0.2}
          emissiveMap={tileTexture}
          emissive={"white"}
          emissiveIntensity={0.5}
        />
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
              if (!isDragging) {
                setHovered(id);
              }
            }}
            onClick={(e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation();
              onTileClick({
                id,
                pos: new THREE.Vector2(
                  id % BOARD_SIZE,
                  Math.floor(id / BOARD_SIZE)
                ),
              });
            }}
          />
        ))}
      </Instances>
      <Box
        // Board frame
        args={[boxSize[0] + 0.2, boxSize[1] + 0.2, boxSize[2] + 0.2]}
        position={[boxPosition[0], boxPosition[1] - 0.2, boxPosition[2]]}
        onPointerOver={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
        }}
      >
        <meshPhysicalMaterial
          map={frameTexture}
          metalness={0.05}
          roughness={0.6}
          clearcoat={0.3}
          clearcoatRoughness={0.4}
          reflectivity={0.2}
          emissive="white"
          emissiveIntensity={0.05}
        />
      </Box>
      <Box
        // No-drag bounding box
        args={[boxSize[0] + 0.2, boxSize[1]+.1, boxSize[2] + 0.2]}
        position={[
          boxPosition[0],
          boxPosition[1] + boxSize[1] / 2,
          boxPosition[2],
        ]}
        onPointerOver={() => {
          if (!isDragging) {
            setCanDrag(false);
          }
        }}
        onPointerOut={() => {
          setCanDrag(true);
        }}
      >
        <meshStandardMaterial
        transparent
        color={"fuchsia"}
        opacity={0}
        wireframe={true}
      />
      </Box>
    </>
  );
});

function CameraControls() {
  const { canDrag, setDragging } = useBoardState((state) => state);
  return (
    <OrbitControls
      enabled={canDrag}
      enablePan={false}
      minDistance={12}
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
        camera={{ position: [2, 10, 12], near: 1, far: 30, fov: 70 }}
      >
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[10, -10, 10]} decay={2} intensity={Math.PI} />

        <Board onTileClick={setClickedTile} />

        <CameraControls />
      </Canvas>
    </section>
  );
}
