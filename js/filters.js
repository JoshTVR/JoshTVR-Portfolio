/* ==============================================
   filters.js — Project Category Filtering
   ============================================== */

function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      /* Update active button */
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const match = filter === 'all' || card.getAttribute('data-category') === filter;

        if (!match) {
          /* Fade out and hide */
          card.style.opacity   = '0';
          card.style.transform = 'scale(0.94)';
          card.style.transition = 'opacity 200ms ease, transform 200ms ease';
          setTimeout(() => {
            if (!match) card.style.display = 'none';
          }, 200);
        } else {
          /* Show and fade in */
          card.style.display   = 'flex';
          /* Force reflow so the transition fires from the hidden state */
          void card.offsetHeight;
          card.style.opacity   = '1';
          card.style.transform = 'scale(1)';
          card.style.transition = 'opacity 300ms ease, transform 300ms ease';
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', initFilters);
