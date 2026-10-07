const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', '展开导航'); mobileNav.hidden = true; }
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute('aria-label', expanded ? '展开导航' : '收起导航');
  mobileNav.hidden = expanded;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

const tabs = [...document.querySelectorAll('[role="tab"]')];
const detail = document.querySelector('.product-detail');
const caption = document.querySelector('#detail-caption');
const captions = { form: '犬形轮廓 · 细节持续优化', support: '独立承托 · 支撑待验证', care: '一次性接触组件 · 图中未展示' };
function activateTab(tab) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
  const view = tab.id.replace('tab-', '');
  detail.dataset.view = view;
  caption.textContent = captions[view];
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); activateTab(tabs[next]); tabs[next].focus(); }
  });
});

const fitDialog = document.querySelector('#fit-dialog');
let dialogTrigger;
document.querySelectorAll('[data-open-guide]').forEach(button => button.addEventListener('click', () => {
  dialogTrigger = button;
  closeMenu();
  fitDialog.showModal();
  document.body.style.overflow = 'hidden';
}));
document.querySelectorAll('.dialog-close, .dialog-done').forEach(button => button.addEventListener('click', () => fitDialog.close()));
fitDialog.addEventListener('click', event => {
  if (event.target === fitDialog) {
    const bounds = fitDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) fitDialog.close();
  }
});
fitDialog.addEventListener('close', () => { document.body.style.overflow = ''; dialogTrigger?.focus({ preventScroll: true }); });

if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
