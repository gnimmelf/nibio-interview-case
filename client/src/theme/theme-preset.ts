import { definePreset } from '@pandacss/dev'
import { cardRecipe } from './recipe-card'
import { linkRecipe, linkScopeRecipe, pageLinkStyles } from './recipe-link-scope'
import { createLightPalette } from './palette-light'
import { createDarkPalette } from './palette-dark'
import { formControlRecipe } from './recipe-form-control'

const palettes = {
  light: createLightPalette(),
  dark: createDarkPalette()
}

export const themeiumPreset = definePreset({
  name: 'theme-preset',
  // Define conditions for light and dark modes
  conditions: {
    light: '[data-theme=light] &',
    dark: '[data-theme=dark] &',
  },

  // Theme configuration
  theme: {
    extend: {
      tokens: {
        colors: palettes,
        cursor: {
          click: { value: 'pointer' },
          disabled: { value: 'not-allowed' },
        }
      },
      // Semantic tokens for UI elements
      semanticTokens: {
        colors: {
          background: {
            value: {
              base: '{colors.light.50}',
              _dark: '{colors.dark.300}',
            },
          },
          accent: {
            value: {
              base: '{colors.light.accent}',
              _dark: '{colors.dark.accent}',
            },
          },
          text: {
            value: {
              base: '{colors.light.text}',
              _dark: '{colors.dark.text}',
            },
          },
          surface: {
            background: {
              value: {
                base: '{colors.light.surface.50}',
                _dark: '{colors.dark.surface.200}',
              },
            },
            text: {
              value: {
                base: '{colors.light.surface.text}',
                _dark: '{colors.dark.surface.text}',
              },
            },

          }
        },
      },
      recipes: {
        link: linkRecipe,
        linkScope: linkScopeRecipe,
        formControl: formControlRecipe
      },
      slotRecipes: {
        card: cardRecipe,
      }
    },
  },

  // Global CSS to apply the theme
  globalCss: {
    html: {
      fontFamily: 'sans-serif',
      color: 'text',
      backgroundColor: 'background',
    },
    body: {
      margin: 0,
      padding: 0,
    },
    h1: {
      fontSize: '4xl', // Maps to preset-panda's fontSizes.4xl
      fontWeight: 'bold',
      lineHeight: '1.2',
      marginBottom: '4',
    },
    h2: {
      fontSize: '2xl', // Maps to preset-panda's fontSizes.2xl
      fontWeight: 'semibold',
      lineHeight: '1.3',
      marginBottom: '3',
    },
    h3: {
      fontSize: 'xl',
      fontWeight: 'medium',
      lineHeight: '1.4',
      marginBottom: '2',
    },
    a: pageLinkStyles,
    "::-webkit-scrollbar": {
      width: "4px",
      height: "4px",
    },
    "::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "::-webkit-scrollbar-thumb": {
      background: "gray.500",
      borderRadius: "full",
    },
  },
})

// Export for use in Panda CSS config
export default themeiumPreset