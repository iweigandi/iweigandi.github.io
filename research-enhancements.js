(function () {
  function descriptionNeedsToggle(description) {
    const text = description.textContent.replace(/\s+/g, ' ').trim();
    return text.length > 430 || description.scrollHeight > description.clientHeight + 4;
  }

  function enhanceResearchListings() {
    if (!document.body || !document.querySelector('#listing-publications, #listing-policy-papers')) return;

    document.querySelectorAll('.quarto-listing-default .quarto-post').forEach((post) => {
      if (post.dataset.enhanced) return;
      post.dataset.enhanced = "true";

      const description = post.querySelector('.listing-description');
      if (!description) return;

      const titleLink = post.querySelector('.listing-title a');
      const buttons = Array.from(description.querySelectorAll('a.btn, .border-primary'));
      let actions = document.createElement('div');
      actions.className = 'post-actions';
      actions.style.marginTop = '0.5rem';
      actions.style.display = 'flex';
      actions.style.gap = '0.5rem';
      actions.style.alignItems = 'center';
      actions.style.flexWrap = 'wrap';

      let hasVisibleBoxes = false;

      buttons.forEach(btn => {
        const isBtn = btn.tagName === 'A' && btn.classList.contains('btn');
        const href = btn.getAttribute('href');
        
        if (isBtn && href && href !== '#') {
          // Transfer real links to the title
          if (titleLink) {
            titleLink.href = href;
            titleLink.target = '_blank';
            titleLink.classList.remove('no-external');
          }
        } else if (isBtn) {
          // Convert fake buttons (like Forthcoming) into simple badges
          const badge = document.createElement('span');
          badge.className = 'd-inline-block border border-primary text-primary rounded px-2 py-1';
          badge.style.fontSize = '0.8rem';
          badge.textContent = btn.textContent;
          actions.appendChild(badge);
          hasVisibleBoxes = true;
        } else {
          // Keep existing badges (like Prizes)
          actions.appendChild(btn);
          hasVisibleBoxes = true;
        }

        const parentP = btn.parentElement;
        if (isBtn) btn.remove();
        if (parentP && parentP.tagName === 'P' && parentP.textContent.trim() === '' && !parentP.hasChildNodes()) {
          parentP.remove();
        }
      });

      if (hasVisibleBoxes) {
        description.insertAdjacentElement('afterend', actions);
      }

      if (descriptionNeedsToggle(description)) {
        if (!actions.parentElement) {
          description.insertAdjacentElement('afterend', actions);
        }
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'research-read-more';

        function updateBtnText() {
          const isEs = localStorage.getItem('site_lang') === 'es';
          const expanded = post.classList.contains('is-expanded');
          if (expanded) {
            button.textContent = isEs ? '[Mostrar menos]' : '[Show less]';
          } else {
            button.textContent = isEs ? '[Leer más]' : '[Read more]';
          }
        }
        updateBtnText();
        window.addEventListener('languageChanged', updateBtnText);

        button.addEventListener('click', () => {
          post.classList.toggle('is-expanded');
          updateBtnText();
        });
        description.insertAdjacentElement('afterend', button);
      }
    });
  }

  function scheduleEnhancement() {
    enhanceResearchListings();
    window.setTimeout(enhanceResearchListings, 100);
    window.setTimeout(enhanceResearchListings, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleEnhancement);
  } else {
    scheduleEnhancement();
  }

  window.addEventListener('quarto-listing-loaded', scheduleEnhancement);
  document.addEventListener('shown.bs.tab', scheduleEnhancement);

  const observer = new MutationObserver(scheduleEnhancement);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
