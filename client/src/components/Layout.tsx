import { css, cx } from "styled-system/css";
import { flex } from "styled-system/patterns";
import { MenuBar } from "./MenuBar";
import { GoGame } from "./GoGame";

const styles = {
  page: cx(
    flex({
      direction: "column",
    }),
    css({
      height: "100vh",
      width: "100%",
      "& > div:first-child": {
        flex: "0 0 auto", // First child takes content height
        minHeight: 0,
      },
      "& > div:last-child": {
        flex: "1 1 auto", // Second child fills remaining height
        minHeight: 0,
      },
    })
  ),
};

export const Layout: React.FC<{}> = ({}) => {
  return (
    <div className={styles.page}>
      <div>
        <MenuBar />
      </div>
      <div>
        <GoGame />
      </div>
    </div>
  );
};
