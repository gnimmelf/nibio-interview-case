import { css, cx } from "styled-system/css";

const styles = {
  container: css({
    display: "flex",
    width: "full",
    justifyContent: "start",
    "&>*": {
      width: "clamp(100px, 60%, 90%)",
      margin: "{2}",
    },
    "& .bubble": {
      paddingY: "{2}",
      paddingX: "{3}",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "transparent",
      borderRadius: "{lg}",
      borderTopLeftRadius: "0",
      backgroundColor: "{colors.light.200}",
      color: "{colors.surface.text}",
    },
    "&.my-message": {
      justifyContent: "end",
      "& .bubble": {
        borderTopRightRadius: "0",
        borderTopLeftRadius: "{lg}",
        backgroundColor: "{colors.accent}",
      },
    },
  }),
  title: css({
    fontSize: "{sm}",
    "&.my-message": {
      textAlign: "right",
    },
  }),
};

export const ChatBubble: React.FC<{
  text: string;
  isFromMe: boolean;
  title: string;
  isPlayer: boolean;
  isSpectator: boolean;
}> = ({ text, isFromMe, title }) => {
  return (
    <div className={cx(styles.container, isFromMe && "my-message")}>
      <div>
        <div className={cx(styles.title, isFromMe && "my-message")}>{title}</div>
        <div className={cx("bubble")}>{text}</div>
      </div>
    </div>
  );
};
