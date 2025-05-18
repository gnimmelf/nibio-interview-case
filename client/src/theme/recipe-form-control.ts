import { defineRecipe } from '@pandacss/dev';

export const formControlRecipe = defineRecipe({
  className: 'form-control',
  description: 'Basis styling for formcontrols',
  base: {
    outline: 'none',
    fontSize: '{md}',
    margin: '{2}',
    paddingY: '{2}',
    paddingX: '{3}',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: '{lg}',
    backgroundColor: '{colors.light.200}',
    color: '{colors.text}',
    _hover: {
      borderColor: '{colors.accent}',
    },
    _focus: {
      borderColor: '{colors.accent}',
    },
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    _dark: {
      backgroundColor: '{colors.dark.800}',
      color: '{colors.text}',
      _hover: {
        borderColor: '{colors.dark.accent}',
      },
      _focus: {
        borderColor: '{colors.dark.accent}',
      },
    },

  },
  variants: {
    cursor: {
      pointer: { cursor: 'pointer' },
      text: { cursor: 'text' },
    },
  },
  defaultVariants: {
    cursor: 'pointer',
  },
});
