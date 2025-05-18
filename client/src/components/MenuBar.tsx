import { Helmet } from "react-helmet-async";
import { css, cx } from "styled-system/css";
import { flex } from "styled-system/patterns";
import { Icon } from "@iconify/react";
import dark from "@iconify-icons/mdi/theme-light-dark";
import { SITE_TITLE } from "~/constants";
import { useTheme } from "./ThemeProvider";

const styles = {
  container: css({
    position: "relative",
  }),
  menuBar: cx(
    css({
      width: "100%",
      zIndex: "10",
      borderBottom: "1px solid {colors.background}",
      backdropFilter: "auto",
      backdropBlur: "sm",
      "& > *": {
        alignItems: "center",
        padding: "{2}",
        margin: "0",
      },
    }),
    flex({ justifyContent: "space-between" })
  ),
};

export const MenuBar: React.FC<{}> = ({}) => {
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title>{SITE_TITLE}</title>
        <meta
          name="description"
          content="Beginner friendly page for learning React Helmet."
        />
      </Helmet>
      <section className={styles.container}>
        <div className={styles.menuBar}>
          <div>
            <h2>{SITE_TITLE} - {theme.currentTheme}</h2>

          </div>
          <Icon
            icon={dark}
            width="46px"
            style={{ cursor: "pointer" }}
            onClick={() => theme.toggleTheme()}
          />
        </div>
      </section>
    </>
  );
};
