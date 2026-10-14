// House of Ralph - Web Application Script Logic

document.addEventListener('DOMContentLoaded', () => {

  // --- Header Scroll Effect ---
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Menu Toggle ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    // Change menu icon based on menu state
    const icon = mobileToggle.querySelector('i');
    if (navMenu.classList.contains('active')) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });

  // Close menu when links are clicked
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
    });
  });

  // --- Strategy Section Concept Tabs ---
  const conceptCards = document.querySelectorAll('.concept-card');
  const showcasePanels = document.querySelectorAll('.showcase-panel');

  conceptCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove active from all cards
      conceptCards.forEach(c => c.classList.remove('active'));
      // Add active to clicked card
      card.classList.add('active');

      // Get target panel id
      const targetId = card.getAttribute('data-target');

      // Hide all panels
      showcasePanels.forEach(panel => {
        panel.classList.remove('active');
      });

      // Show target panel
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // --- Sniper Trade Before/After Toggles (Supports 2-phase & 3-phase cards) ---
  const togglePanels = document.querySelectorAll('.showcase-panel, .journal-card');
  togglePanels.forEach(panel => {
    const phaseBtns = panel.querySelectorAll('.toggle-tab-btn');
    const imgElement = panel.querySelector('.execution-img');
    const captionElement = panel.querySelector('.execution-caption');

    if (phaseBtns.length > 0 && imgElement) {
      phaseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          // Remove active class from other buttons in this container
          phaseBtns.forEach(b => b.classList.remove('active'));
          // Set clicked button to active
          btn.classList.add('active');

          const phase = btn.getAttribute('data-phase');
          
          // Get phase-specific sources & descriptions
          const src = imgElement.getAttribute(`data-${phase}-src`);
          const alt = imgElement.getAttribute(`data-${phase}-alt`);
          const text = captionElement.getAttribute(`data-${phase}-text`);

          if (src) imgElement.src = src;
          if (alt) imgElement.alt = alt;
          if (text) captionElement.innerHTML = text;
        });
      });
    }
  });

  // --- Trade Journal Category Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const journalCards = document.querySelectorAll('.journal-card');
  const noTradesMsg = document.getElementById('no-trades-msg');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class on filter buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      let visibleCount = 0;

      journalCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      if (noTradesMsg) {
        if (visibleCount === 0) {
          noTradesMsg.style.display = 'flex';
        } else {
          noTradesMsg.style.display = 'none';
        }
      }
    });
  });

  // --- Position Sizing Calculator ---
  const balanceInput = document.getElementById('calc-balance');
  const riskPercentInput = document.getElementById('calc-risk-percent');
  const stoplossInput = document.getElementById('calc-stoploss');
  const pairSelect = document.getElementById('calc-pair');
  const calculateBtn = document.getElementById('btn-calculate');

  // Outputs
  const resultRiskCash = document.getElementById('result-risk-cash');
  const resultLotSize = document.getElementById('result-lot-size');
  const resultUnits = document.getElementById('result-units');
  const resultPipVal = document.getElementById('result-pip-val');

  // Map of Pip Values per 1 Standard Lot (100k Units)
  const pipValueMap = {
    GBPUSD: 10.00,
    EURUSD: 10.00,
    AUDUSD: 10.00,
    USDJPY: 9.30,
    USDCAD: 7.40
  };

  function calculatePositionSize() {
    // Read input values
    const balance = parseFloat(balanceInput.value);
    const riskPercent = parseFloat(riskPercentInput.value);
    const stoploss = parseFloat(stoplossInput.value);
    const selectedPair = pairSelect.value;

    // Check validity
    if (isNaN(balance) || balance <= 0 ||
        isNaN(riskPercent) || riskPercent <= 0 ||
        isNaN(stoploss) || stoploss <= 0) {
      alert('Please enter valid numeric inputs greater than zero.');
      return;
    }

    // Cash amount to risk
    const cashRisk = balance * (riskPercent / 100);

    // Pip value lookup
    const pipValPerLot = pipValueMap[selectedPair] || 10.00;

    // Standard Lots = Cash Risk / (Stoploss in Pips * Pip Value per 1 Standard Lot)
    const lotSize = cashRisk / (stoploss * pipValPerLot);

    // Units = Lots * 100,000
    const units = lotSize * 100000;

    // Update UI elements with formatted values
    resultRiskCash.textContent = `$${cashRisk.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    resultLotSize.textContent = `${lotSize.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Lots`;
    resultUnits.textContent = Math.round(units).toLocaleString();
    resultPipVal.textContent = `$${pipValPerLot.toFixed(2)} / pip`;
  }

  if (calculateBtn) {
    calculateBtn.addEventListener('click', calculatePositionSize);
  }

  // --- Scroll Fade In Section Effects ---
  const fadeSections = document.querySelectorAll('.fade-in-section');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  fadeSections.forEach(section => {
    observer.observe(section);
  });

  // --- Chart Lightbox Modal Logic ---
  const lightbox = document.getElementById('chart-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  const zoomableImages = document.querySelectorAll('.showcase-media-frame img, .journal-media-frame img, .execution-img');

  zoomableImages.forEach(img => {
    img.style.cursor = 'zoom-in';

    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxImg.classList.remove('zoomed');
      lightboxImg.style.transformOrigin = 'center center';

      const parentPanel = img.closest('.showcase-panel') || img.closest('.journal-card');
      if (parentPanel) {
        const caption = parentPanel.querySelector('.chart-caption, .execution-caption');
        if (caption) {
          lightboxCaption.innerHTML = caption.innerHTML;
          lightboxCaption.style.display = 'block';
        } else {
          lightboxCaption.style.display = 'none';
        }
      } else {
        lightboxCaption.style.display = 'none';
      }

      lightbox.classList.add('show');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  lightboxImg.addEventListener('click', (e) => {
    e.stopPropagation();
    
    if (lightboxImg.classList.contains('zoomed')) {
      lightboxImg.classList.remove('zoomed');
      // Reset transform origin to center after scale transition completes
      setTimeout(() => {
        if (!lightboxImg.classList.contains('zoomed')) {
          lightboxImg.style.transformOrigin = 'center center';
        }
      }, 300);
    } else {
      // Zoom in exactly where the user clicked
      const rect = lightboxImg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const pctX = (x / rect.width) * 100;
      const pctY = (y / rect.height) * 100;
      
      lightboxImg.style.transformOrigin = `${pctX}% ${pctY}%`;
      lightboxImg.classList.add('zoomed');
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.classList.remove('zoomed');
    setTimeout(() => {
      lightboxImg.style.transformOrigin = 'center center';
    }, 300);
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('show')) {
      closeLightbox();
    }
  });
});
