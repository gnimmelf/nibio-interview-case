import { styled } from "styled-system/jsx";
import { formControl } from "styled-system/recipes";

export const Input = styled(
  "input",
  formControl,
  {
    defaultProps: { cursor: 'text'}
  }
);
