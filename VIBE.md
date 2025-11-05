### What I changed
- Added full Dark Mode support with Light/Dark/Auto toggle and persistent user preference across sessions.
- Implemented theme via CSS custom properties and safe color palette that meets accessibility contrast targets.
- Auto mode follows the OS preference and updates live when the OS theme changes.
- Injected an accessible theme selector into the header of every page through JavaScript (no HTML duplication needed).

### Files updated
- `style.css`
    - Introduced `:root` design tokens (CSS variables) for colors and surfaces.
    - Added `.theme-light` and `.theme-dark` classes and `prefers-color-scheme: dark` handling for Auto mode.
    - Switched key components (body, header, links, cards, emoji boxes, content boxes, inputs, buttons, basket indicator, footer links) to use variables.
    - Ensured contrast-friendly values (e.g., white text on accent reds; link hover colors in dark mode).
- `shop.js`
    - New theme manager: load/store `theme-preference` (`auto`/`light`/`dark`) in `localStorage`.
    - Apply theme by toggling classes on `<html>` and expose `data-theme-mode` attribute for debugging.
    - Listen to `prefers-color-scheme` changes to update Auto mode live.
    - Inject an accessible `<select>` Theme toggle (Light/Dark/Auto) into the header’s nav on all pages, with current selection reflected.

### How it works
- Default is `Auto` if no preference stored.
- Selecting Light or Dark forces that theme (using `.theme-light`/`.theme-dark` on `<html>`).
- Selecting Auto removes forced classes; CSS follows system preference via `@media (prefers-color-scheme: dark)`.
- Preference persists in `localStorage` as `theme-preference`.

### How to verify
1. Open `index.html` (and other pages) in a browser.
2. Use the new Theme dropdown in the header (right side): choose Auto/Light/Dark.
3. In Auto mode, toggle your OS theme and observe the site update immediately.
4. Reload pages; the last chosen mode remains.
5. Check core pages (home, product pages, basket, checkout) for readable text and sufficient contrast.

### Notes
- No HTML files needed changes; the toggle is injected by `shop.js` wherever the standard header is present.
- The color set targets ≥ 4.5:1 contrast for text against backgrounds in both themes.
- You can tweak brand tones by editing variables at the end of `style.css`.