/* ════════════════════════════════════════════════════════════
   Health Sherpa — JavaScript
   ════════════════════════════════════════════════════════════ */

function toggleSection(header) {
  const section = header.parentElement;
  section.classList.toggle('open');
}

// Sub-section collapse/expand
function toggleSub(subSection) {
  // Don't toggle if click originated from a button (print, etc.)
  if (event && event.target.closest('button')) return;
  subSection.classList.toggle('sub-open');
}

function smoothNav(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  event.currentTarget.classList.add('active');
}

// Intersection Observer for sidebar active state
const observerOptions = {
  root: null,
  rootMargin: '-80px 0px -60% 0px',
  threshold: 0
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(id)) {
          link.classList.add('active');
        }
      });
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section, .hero, .part-divider').forEach(section => {
  if (section.id) observer.observe(section);
});

// Open first section by default
document.querySelector('.section')?.classList.add('open');

// Spice card row toggle — open/close all cards sharing the same grid row
function toggleSpiceRow(card) {
  const grid = card.parentElement;
  if (!grid || !grid.classList.contains('sc-grid')) {
    card.classList.toggle('sc-open');
    return;
  }
  const opening = !card.classList.contains('sc-open');
  const cards = Array.from(grid.querySelectorAll('.sc-card'));
  const idx = cards.indexOf(card);
  // Detect columns from CSS grid computed style
  const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
  const rowStart = Math.floor(idx / cols) * cols;
  const rowmates = cards.slice(rowStart, rowStart + cols);
  rowmates.forEach(c => {
    if (opening) c.classList.add('sc-open');
    else c.classList.remove('sc-open');
  });
}

// Recipe card row toggle — open/close all cards sharing the same grid row
function toggleRecipe(card) {
  const grid = card.parentElement;
  if (!grid || !grid.classList.contains('recipe-grid')) {
    card.classList.toggle('recipe-open');
    return;
  }
  const opening = !card.classList.contains('recipe-open');
  const cards = Array.from(grid.querySelectorAll('.recipe-card'));
  const idx = cards.indexOf(card);
  const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
  const rowStart = Math.floor(idx / cols) * cols;
  const rowmates = cards.slice(rowStart, rowStart + cols);
  rowmates.forEach(c => {
    if (opening) c.classList.add('recipe-open');
    else c.classList.remove('recipe-open');
  });
}

// Grocery section toggle
function toggleGrocery(header) { header.parentElement.classList.toggle('grocery-open'); }

// Theme toggle
function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('blueprint-theme', next);
  document.querySelector('.theme-label').textContent = next === 'light' ? 'Dark mode' : 'Light mode';
}
(function() {
  const saved = localStorage.getItem('blueprint-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) document.documentElement.setAttribute('data-theme', 'light');
  const l = document.querySelector('.theme-label');
  if (l) l.textContent = document.documentElement.getAttribute('data-theme') === 'light' ? 'Dark mode' : 'Light mode';
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    if (!localStorage.getItem('blueprint-theme')) document.documentElement.setAttribute('data-theme', e.matches ? 'light' : 'dark');
  });
})();

// Print a specific section
function printSection(el, e) {
  if (e) { e.stopPropagation(); e.preventDefault(); }
  if (!el) return;
  el.classList.add('print-target');
  const section = el.closest('.section');
  if (section) section.classList.add('has-print-target');
  const grocery = el.closest('.grocery-section');
  if (grocery) { grocery.classList.add('print-target', 'grocery-open'); }
  el.querySelectorAll('.recipe-card').forEach(c => c.classList.add('recipe-open'));
  document.body.classList.add('printing-section');
  window.print();
  document.body.classList.remove('printing-section');
  el.classList.remove('print-target');
  if (section) section.classList.remove('has-print-target');
  if (grocery) grocery.classList.remove('print-target');
  el.querySelectorAll('.recipe-card').forEach(c => c.classList.remove('recipe-open'));
}

// Print single recipe
function printRecipe(btn, e) {
  if (e) e.stopPropagation();
  const card = btn.closest('.recipe-card');
  const section = card.closest('.section');
  card.classList.add('print-target', 'recipe-open');
  if (section) section.classList.add('has-print-target');
  document.body.classList.add('printing-single');
  window.print();
  document.body.classList.remove('printing-single');
  card.classList.remove('print-target');
  if (section) section.classList.remove('has-print-target');
}
