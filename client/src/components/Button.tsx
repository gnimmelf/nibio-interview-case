import { css, cva } from "styled-system/css";
import { styled } from "styled-system/jsx";
import { formControl } from "styled-system/recipes";



export const Button = styled(
  "button",
  formControl,
  {
    defaultProps: { cursor: 'pointer'}
  }
);
