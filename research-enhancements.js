(function () {
  function descriptionNeedsToggle(description) {
    const text = description.textContent.replace(/\s+/g, ' ').trim();
    return text.length > 430 || description.scrollHeight > description.clientHeight + 4;
  }

  function enhanceResearchListings() {
    if (!document.body || !document.querySelector('#listing-publications, #listing-policy-papers')) return;

    document.querySelectorAll('.quarto-listing-default .quarto-post').forEach((post) => {
      if (post.dataset.enhanced || !post.getClientRects().length) return;
      post.dataset.enhanced = "true";

      const description = post.querySelector('.listing-description');
      if (!description) return;

      const badges = description.querySelectorAll('span.border-primary');
      let actions = document.createElement('div');
      actions.className = 'post-actions';
      actions.style.marginTop = '0.5rem';
      actions.style.display = 'flex';
      actions.style.gap = '0.5rem';
      actions.style.alignItems = 'center';
      actions.style.flexWrap = 'wrap';

      badges.forEach(badge => {
        const parentP = badge.parentElement;
        actions.appendChild(badge);
        if (parentP && parentP.tagName === 'P' && parentP.textContent.trim() === '' && !parentP.hasChildNodes()) {
          parentP.remove();
        }
      });

      if (badges.length) {
        description.insertAdjacentElement('afterend', actions);
      }

      if (!description.querySelector('a.btn') && descriptionNeedsToggle(description)) {
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
