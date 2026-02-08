/**
 * @file
 * Utility for dynamically updating website icons based on user's preferred color scheme.
 */
(() => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const lightIcons = () =>
    document.querySelectorAll('link[rel~="icon"][data-theme="light"]');

  const darkIcons = () =>
    document.querySelectorAll('link[rel~="icon"][data-theme="dark"]');

  const updateIcons = ({ matches }) => {
    const enable = matches ? darkIcons() : lightIcons();
    const disable = matches ? lightIcons() : darkIcons();

    disable.forEach((icon) => icon.remove());
    enable.forEach((icon) => document.head.append(icon));
  };

  // Initial sync
  updateIcons(mediaQuery);

  // React to system theme changes
  mediaQuery.addEventListener("change", updateIcons);
})();
