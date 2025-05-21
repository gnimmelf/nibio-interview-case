import { css } from "styled-system/css";
import { useGame } from "./GameProvider";
import { useEffect, useRef } from "react";

const styles = {};

export const GoBoard: React.FC<{}> = ({}) => {
  const { authData, connectionData, chatMessages } = useGame();

  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const grid = scene.querySelector("#grid");
    const spacing = 380 / 12;

    // Add grid lines and star points (as above)
    for (let i = 0; i < 13; i++) {
      const hLine = document.createElement("lume-box");
      hLine.setAttribute("size", `380 1 0`);
      hLine.setAttribute("position", `0 ${(i - 6) * spacing} 1`);
      hLine.setAttribute("color", "white");
      grid.appendChild(hLine);

      const vLine = document.createElement("lume-box");
      vLine.setAttribute("size", `1 380 0`);
      vLine.setAttribute("position", `${(i - 6) * spacing} 0 1`);
      vLine.setAttribute("color", "white");
      grid.appendChild(vLine);
    }

    const starPoints = [
      [4, 4],
      [4, 10],
      [10, 4],
      [10, 10],
      [7, 7],
    ];
    starPoints.forEach(([x, y]) => {
      const point = document.createElement("lume-sphere");
      point.setAttribute("size", "5 5 5");
      point.setAttribute(
        "position",
        `${(x - 6) * spacing} ${(y - 6) * spacing} 2`
      );
      point.setAttribute("color", "white");
      grid.appendChild(point);
    });

    // Handle stone placement
    scene.addEventListener("click", (event) => {
      const rect = scene.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      const gridX = Math.round(x / spacing) * spacing;
      const gridY = Math.round(y / spacing) * spacing;

      const stone = document.createElement("lume-sphere");
      stone.setAttribute("size", "15 15 15");
      stone.setAttribute("position", `${gridX} ${gridY} 3`);
      stone.setAttribute("color", "black");
      grid.appendChild(stone);
    });
  }, []);

  return (
    <lume-scene ref={sceneRef} id="scene" webgl>
      <lume-node id="board" size="400 400 0">
        <lume-plane id="grid" size="380 380 0" color="black" opacity="0.8" />
      </lume-node>
    </lume-scene>
  );
};
