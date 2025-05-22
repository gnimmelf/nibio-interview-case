import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { css, cx } from "styled-system/css";
import { useGame } from "./ConnectionProvider";
import { MoveFormValues } from "../../shared/types";
// Board imports
import { useBoardState } from "~/stores/board-state";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ActiveTile, Board } from "./Board";

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

export const Game: React.FC<{
  postMove: (moveValues: MoveFormValues) => Promise<boolean>;
}> = ({ postMove }) => {
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

        <Board
          onTileClick={setClickedTile}
          playerNo={connectionData?.playerNo!}
        />

        <CameraControls />
      </Canvas>
    </section>
  );
};
