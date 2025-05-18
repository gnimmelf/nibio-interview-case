import { defineRecipe } from '@pandacss/dev';

const linkBase = {
  _focusVisible: {
    outline: "none",
  },
}

/**
 * Basic page link styles - exported for use in preset
 */
export const pageLinkStyles = {
  color: '{colors.light.link}',
  _dark: {
    color: '{colors.dark.link}',
  },
  _hover: {
    color: '{colors.light.link.hover}',
    _dark: {
      color: '{colors.dark.link.hover}',
    },
  },
}

const surfaceLink = {
  color: '{colors.light.surface.link}',
  _dark: {
    color: '{colors.dark.surface.link}',
  },
  _hover: {
    color: '{colors.light.surface.link.hover}',
    _dark: {
      color: '{colors.dark.surface.link.hover}',
    },
  },
}

const menuLink = {
  color: '{colors.light.400}',
  _dark: {
    color: '{colors.dark.50}',
  },
  _hover: {
    color: '{colors.light.300}',
    _dark: {
      color: '{colors.dark.100}',
    },
  },
}

/**
 * Link style reciepe, apply directly to links and link-like elements.
 */
export const linkRecipe = defineRecipe({
  className: 'link',
  base: linkBase,
  variants: {
    cursor: {
      click: { cursor: 'pointer' },
      disabled: { cursor: 'not-allowed' },
    },
    area: {
      page: pageLinkStyles,
      surface: surfaceLink,
      menu: menuLink
    }
  },
  defaultVariants: {
    cursor: 'click',
    area: 'surface'
  },
});

/**
 * Same as `link`, but applies styles to all child `a` elements
 */
export const linkScopeRecipe = defineRecipe({
  className: 'link-scope',
  base: {
    '& a': linkBase
  },
  variants: {
    cursor: {
      click: { '& a': { cursor: 'pointer' } },
      disabled: { '& a': { cursor: 'not-allowed' } },
    },
    area: {
      page: { '& a': pageLinkStyles },
      surface: { '& a': surfaceLink },
      menu: { '& a': menuLink },
    }
  },
  defaultVariants: {
    cursor: 'click',
    area: 'surface'
  },
});