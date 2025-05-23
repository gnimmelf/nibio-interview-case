import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { css, cx } from "styled-system/css";
// Board imports
import { useBoardState } from "~/stores/board-state";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { Instances, Box } from "@react-three/drei";
import * as textures from "../lib/textures";
import { BOARD_SIZE } from "../../shared/constants";

import {
  TILE_DEFAULT_PROPS,
  TILE_HEIGHT,
  TILE_SIZE,
  TileInstance,
} from "./TileInstance";
import { useConnection } from "./ConnectionProvider";

const styles = {};

type Vector3Array = [x: number, y: number, z: number];

export type ActiveTile = {
  id: number;
  pos: THREE.Vector2;
};

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

export const Board: React.FC<{
  playerNo: number;
  onTileClick: (arg: ActiveTile) => void;
}> = memo(({ playerNo, onTileClick }) => {
  const instancesRef = useRef<THREE.InstancedMesh>(null);

  const { gameState } = useConnection()
  const { setCanDrag, isDragging } = useBoardState();

  const [hovered, setHovered] = useState<number | null>(null);

  // Set up bounding box and board box
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

  // Textures
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
          metalness={0.2}
          color={TILE_DEFAULT_PROPS.color}
          map={tileTexture}
          emissiveMap={tileTexture}
          emissive={TILE_DEFAULT_PROPS.emmisive}
          emissiveIntensity={TILE_DEFAULT_PROPS.emissiveIntensity}
        />
        {gameState && tiles.map(({ id, pos }) => (
          <TileInstance
            key={id}
            id={id}
            position={pos}
            isHovered={hovered === id}
            playedState={gameState?.boardState[id]}
            playerNo={playerNo}
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
        args={[boxSize[0] + 0.2, boxSize[1] + 0.39, boxSize[2] + 0.2]}
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
      {playerNo > 0 && (
        <Box
          // No-drag bounding box - only for players
          args={[boxSize[0] + 0.2, boxSize[1] + 0.1, boxSize[2] + 0.2]}
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
      )}
    </>
  );
});
