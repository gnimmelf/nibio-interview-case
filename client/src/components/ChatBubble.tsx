import { css, cx } from "styled-system/css";

const styles = {
  container: css({
    display: 'flex',
    width: 'full',
    justifyContent: 'start',
    "&>*": {
      margin: "{2}",
      paddingY: "{2}",
      paddingX: "{3}",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "transparent",
      borderRadius: "{lg}",
      borderTopLeftRadius: "0",
      backgroundColor: "{colors.light.200}",
      color: "{colors.surface.text}",
      width: 'clamp(100px, 60%, 90%)',
    },
    "&.my-message": {
      justifyContent: 'end',
      "&>*": {
        borderTopRightRadius: "0",
        borderTopLeftRadius: "{lg}",
        backgroundColor: "{colors.accent}",
      },
    },
  }),
};

export const ChatBubble: React.FC<{
  text: string;
  isFromMe: boolean;
}> = ({ text, isFromMe }) => {
  return (
    <div className={cx(styles.container, isFromMe ? "my-message" : "")}>
      <div>{text}</div>
    </div>
  );
};
