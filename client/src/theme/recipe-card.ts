import { defineSlotRecipe } from '@pandacss/dev'

export const cardRecipe = defineSlotRecipe({
  className: 'card',
  description: 'A semantic card component with header, content, and footer',
  slots: ['root', 'header', 'content', 'footer'], // Define the slots
  base: {
    root: {
      '--borderColor': 'transparent',
      '--hoverColor': '{colors.light.surface.200}',
      _dark: {
        '--hoverColor': '{colors.dark.surface.50}',
      },
      position: "relative", // Important when using `linkOverlay` in children
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '{colors.surface.background}',
      color: '{colors.surface.text}',
      borderRadius: 'lg',
      boxShadow: '{shadows.2xl}',
      overflow: 'hidden',
      border: "1px solid var(--borderColor)",
      _hover: {
        borderColor: 'var(--hoverColor)'
      }
    },
    header: {
      padding: '4',
      fontWeight: 'bold',
      borderBottom: '1px solid var(--borderColor)',
    },
    content: {
      padding: '4',
      color: 'text',
      flex: '1',
    },
    footer: {
      borderTop: '1px solid var(--borderColor)',
      padding: '4',
      fontSize: 'sm',
    },
  },
})