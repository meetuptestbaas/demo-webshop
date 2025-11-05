// --- Theme management ---
(function () {
  const STORAGE_KEY = "theme-preference"; // values: 'light' | 'dark' | 'auto'
  const DOC = document.documentElement;
  const media = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

  function getStoredPreference() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v === 'light' || v === 'dark' || v === 'auto' ? v : null;
    } catch (_) {
      return null;
    }
  }

  function storePreference(mode) {
    try { localStorage.setItem(STORAGE_KEY, mode); } catch (_) {}
  }

  function applyTheme(mode) {
    DOC.setAttribute('data-theme-mode', mode);
    DOC.classList.remove('theme-light', 'theme-dark');
    if (mode === 'light') DOC.classList.add('theme-light');
    if (mode === 'dark') DOC.classList.add('theme-dark');
    // if 'auto', no class so CSS media query takes over
  }

  function currentSystemPrefersDark() {
    return !!(media && media.matches);
  }

  function initTheme() {
    const stored = getStoredPreference() || 'auto';
    applyTheme(stored);

    // Build toggle UI
    const nav = document.querySelector('header .header-center nav') || document.querySelector('header nav');
    if (nav && !nav.querySelector('.theme-toggle')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'theme-toggle';
      const label = document.createElement('label');
      label.textContent = 'Theme:';
      label.setAttribute('for', 'themeSelect');
      label.style.fontWeight = '500';
      const select = document.createElement('select');
      select.id = 'themeSelect';
      select.className = 'theme-select';
      select.setAttribute('aria-label', 'Select theme mode');

      [
        { value: 'auto', text: 'Auto' },
        { value: 'light', text: 'Light' },
        { value: 'dark', text: 'Dark' },
      ].forEach(opt => {
        const o = document.createElement('option');
        o.value = opt.value; o.textContent = opt.text; select.appendChild(o);
      });

      select.value = stored;
      select.addEventListener('change', function () {
        const val = this.value;
        storePreference(val);
        applyTheme(val);
      });

      wrapper.appendChild(label);
      wrapper.appendChild(select);
      nav.appendChild(wrapper);
    }

    // When in auto, reflect system changes live
    if (media && typeof media.addEventListener === 'function') {
      media.addEventListener('change', () => {
        const pref = getStoredPreference() || 'auto';
        if (pref === 'auto') applyTheme('auto');
      });
    } else if (media && typeof media.addListener === 'function') {
      // Safari <14
      media.addListener(() => {
        const pref = getStoredPreference() || 'auto';
        if (pref === 'auto') applyTheme('auto');
      });
    }
  }

  if (document.readyState !== 'loading') initTheme();
  else document.addEventListener('DOMContentLoaded', initTheme);
})();

const PRODUCTS = {
  apple: { name: "Apple", emoji: "🍏" },
  banana: { name: "Banana", emoji: "🍌" },
  lemon: { name: "Lemon", emoji: "🍋" },
};

function getBasket() {
  try {
    const basket = localStorage.getItem("basket");
    if (!basket) return [];
    const parsed = JSON.parse(basket);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Error parsing basket from localStorage:", error);
    return [];
  }
}

function addToBasket(product) {
  const basket = getBasket();
  basket.push(product);
  localStorage.setItem("basket", JSON.stringify(basket));
}

function clearBasket() {
  localStorage.removeItem("basket");
}

function renderBasket() {
  const basket = getBasket();
  const basketList = document.getElementById("basketList");
  const cartButtonsRow = document.querySelector(".cart-buttons-row");
  if (!basketList) return;
  basketList.innerHTML = "";
  if (basket.length === 0) {
    basketList.innerHTML = "<li>No products in basket.</li>";
    if (cartButtonsRow) cartButtonsRow.style.display = "none";
    return;
  }
  basket.forEach((product) => {
    const item = PRODUCTS[product];
    if (item) {
      const li = document.createElement("li");
      li.innerHTML = `<span class='basket-emoji'>${item.emoji}</span> <span>${item.name}</span>`;
      basketList.appendChild(li);
    }
  });
  if (cartButtonsRow) cartButtonsRow.style.display = "flex";
}

function renderBasketIndicator() {
  const basket = getBasket();
  let indicator = document.querySelector(".basket-indicator");
  if (!indicator) {
    const basketLink = document.querySelector(".basket-link");
    if (!basketLink) return;
    indicator = document.createElement("span");
    indicator.className = "basket-indicator";
    basketLink.appendChild(indicator);
  }
  if (basket.length > 0) {
    indicator.textContent = basket.length;
    indicator.style.display = "flex";
  } else {
    indicator.style.display = "none";
  }
}

// Call this on page load and after basket changes
if (document.readyState !== "loading") {
  renderBasketIndicator();
} else {
  document.addEventListener("DOMContentLoaded", renderBasketIndicator);
}

// Patch basket functions to update indicator
const origAddToBasket = window.addToBasket;
window.addToBasket = function (product) {
  origAddToBasket(product);
  renderBasketIndicator();
};
const origClearBasket = window.clearBasket;
window.clearBasket = function () {
  origClearBasket();
  renderBasketIndicator();
};
