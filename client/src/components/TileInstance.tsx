import * as THREE from "three";
import { useEffect, useRef } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { Instance } from "@react-three/drei";

export const TILE_SIZE = 1;
export const TILE_HEIGHT = 0.5;

export const TILE_DEFAULT_PROPS = {
  color: "white",
  emmisive: "white",
  emissiveIntensity: 0.1,
  offsetPosY: 0,
} as const;

const HOVER_PROPS = {
  ...TILE_DEFAULT_PROPS,
  emissiveIntensity: 0.5,
  offsetPosY: 0.27,
};

const PLAYER_COLORS = {
  1: "red",
  2: "black",
} as const;
type PlayerColorKey = keyof typeof PLAYER_COLORS;

interface TileInstanceProps {
  id: number;
  isHovered: boolean;
  playerNo: number;
  position: [number, number, number];
  onPointerOver?: (event: ThreeEvent<MouseEvent>) => void;
  onPointerOut?: (event: ThreeEvent<MouseEvent>) => void;
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
}
export const TileInstance: React.FC<TileInstanceProps> = ({
  id,
  isHovered,
  playerNo,
  position,
  ...props
}) => {
  const instanceRef = useRef<THREE.InstancedMesh>(null);

  const hoverProps = {
    ...TILE_DEFAULT_PROPS,
    posY: position[1],
  };

  if (playerNo > 0 && isHovered) {
    Object.assign(hoverProps, {
      posY: position[1] + HOVER_PROPS.offsetPosY,
      color: PLAYER_COLORS[playerNo as PlayerColorKey],
      emissive: PLAYER_COLORS[playerNo as PlayerColorKey],
      emissiveIntensity: 0.5,
    });
  }

  // Re-spread
  const { posY, ...instanceProps } = hoverProps;

  return (
    <group position={[position[0], posY, position[2]]}>
      <Instance
        ref={instanceRef}
        position={[0, TILE_HEIGHT / 2, 0]}
        {...instanceProps}
        {...props}
      />
    </group>
  );
};
