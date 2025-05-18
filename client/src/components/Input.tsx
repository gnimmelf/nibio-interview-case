import { css, cva } from "styled-system/css";
import { styled } from "styled-system/jsx";
import { formControl } from "styled-system/recipes";

export const Input = styled(
  "input",
  formControl,
  {
    defaultProps: { cursor: 'text'}
  }
);
