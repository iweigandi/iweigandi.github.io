(function() {
  const dictionary = {
    "Research": "Investigación",
    "Teaching": "Docencia",
    "Blog": "Blog",
    "Data": "Datos",
    "CV": "CV",
    "Academic": "Académico",
    "Professional": "Profesional",
    "Publications": "Publicaciones",
    "Working Papers": "Documentos de Trabajo",
    "Policy & Other": "Otros",
    "WP": "DT",
    "Policy": "Política",
    "Education": "Educación",
    "Daily Global Financial Cycle proxy": "Proxy diario del Ciclo Financiero Global",
    "Covered Interest Parity deviations in CHF-USD": "Desviaciones de la Paridad de Tasas de Interés Cubierta en CHF-USD",
    "G-SIBs' market leverage": "Apalancamiento de mercado de los G-SIBs",
    "FX dealer positions and UIP outcomes": "Posiciones de dealers en FX y resultados de UIP",
    "Repository": "Repositorio",
    "Buenas!": "Hello!" 
  };

  const reverseDictionary = Object.fromEntries(
    Object.entries(dictionary).map(([en, es]) => [es, en])
  );
  dictionary["Hello!"] = "Buenas!";
  reverseDictionary["Buenas!"] = "Hello!";
  delete dictionary["Buenas!"];

  let currentLang = localStorage.getItem('site_lang') || 'en';
  function updateListingDates(lang) {
    const locale = lang === 'es' ? 'es-ES' : 'en-US';
    const options = lang === 'es'
      ? { day: 'numeric', month: 'short', year: 'numeric' }
      : { month: 'short', day: 'numeric', year: 'numeric' };

    document.querySelectorAll('.quarto-post').forEach(post => {
      const timestamp = Number(post.dataset.listingDateSort);
      const dateEl = post.querySelector('.listing-date');
      if (!Number.isFinite(timestamp) || !dateEl) return;

      const parts = new Intl.DateTimeFormat(locale, options).formatToParts(new Date(timestamp));
      const value = type => parts.find(part => part.type === type)?.value || '';
      const month = value('month').replace('.', '');
      dateEl.textContent = lang === 'es'
        ? `${value('day')} ${month.charAt(0).toUpperCase()}${month.slice(1)}, ${value('year')}`
        : `${month} ${value('day')}, ${value('year')}`;
    });
  }

  function applyLanguage(lang) {
    const isEs = lang === 'es';
    const dict = isEs ? dictionary : reverseDictionary;

    const elementsToTranslate = document.querySelectorAll(
      '.navbar, .nav-tabs, h1, h2, h3, h4, .photo-overlay, .chart-card, .listing-label'
    );

    elementsToTranslate.forEach(el => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
      let node;
      while ((node = walker.nextNode())) {
        const text = node.nodeValue.trim();
        if (dict[text]) {
          node.nodeValue = node.nodeValue.replace(text, dict[text]);
        }
      }
    });

    document.querySelectorAll('.lang-en').forEach(el => {
      el.style.display = isEs ? 'none' : 'block';
    });
    document.querySelectorAll('.lang-es').forEach(el => {
      el.style.display = isEs ? 'block' : 'none';
    });

    const toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) {
      toggleBtn.innerHTML = isEs 
        ? '<span style="opacity:0.5; font-weight:normal;">ENG</span><span style="margin:0 6px; opacity:0.3; font-weight:normal;">|</span><span>ESP</span>'
        : '<span>ENG</span><span style="margin:0 6px; opacity:0.3; font-weight:normal;">|</span><span style="opacity:0.5; font-weight:normal;">ESP</span>';
    }

    document.documentElement.lang = lang;
    localStorage.setItem('site_lang', lang);
    updateListingDates(lang);
    
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
  }


  function setupEmailLink() {
    const emailLink = Array.from(document.querySelectorAll('.navbar a.nav-link')).find(link =>
      link.querySelector('.bi-envelope')
    );
    if (!emailLink) return;

    const address = ['iweigandi', 'gmail.com'].join('@');
    emailLink.setAttribute('aria-label', 'Email');
    emailLink.setAttribute('title', 'Email');
    emailLink.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = `mailto:${address}`;
    });
  }
  document.addEventListener('DOMContentLoaded', () => {
    let rightNav = document.querySelector('.navbar-nav.navbar-nav-scroll.ms-auto');
    if (!rightNav) rightNav = document.querySelector('.navbar-nav.ms-auto');
    
    if (rightNav && !document.getElementById('lang-toggle')) {
      const li = document.createElement('li');
      li.className = 'nav-item compact';
      
      const btn = document.createElement('button');
      btn.id = 'lang-toggle';
      btn.className = 'nav-link';
      btn.style.background = 'transparent';
      btn.style.border = 'none';
      btn.style.cursor = 'pointer';
      btn.style.fontWeight = 'bold';
      btn.style.display = 'flex';
      btn.style.alignItems = 'center';
      btn.style.paddingTop = '8px'; // Align with navbar links
      
      btn.innerHTML = currentLang === 'es' 
        ? '<span style="opacity:0.5; font-weight:normal;">ENG</span><span style="margin:0 6px; opacity:0.3; font-weight:normal;">|</span><span>ESP</span>'
        : '<span>ENG</span><span style="margin:0 6px; opacity:0.3; font-weight:normal;">|</span><span style="opacity:0.5; font-weight:normal;">ESP</span>';
      
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        currentLang = currentLang === 'es' ? 'en' : 'es';
        applyLanguage(currentLang);
      });

      li.appendChild(btn);
      rightNav.insertBefore(li, rightNav.firstChild);
    }
    
    setupEmailLink();

    if (currentLang === 'es') {
      applyLanguage('es');
    } else {
      document.querySelectorAll('.lang-es').forEach(el => el.style.display = 'none');
      document.querySelectorAll('.lang-en').forEach(el => el.style.display = 'block');
      updateListingDates('en');
    }
  });
})();
