export default {
  extends: ['html-validate:recommended'],
  rules: {
    // Astro emits app-owned object-position and view-transition styles on images and links.
    'no-inline-style': 'off',
  },
};
