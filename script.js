const products = {
  maintenance: { zh: ['1,000+ SKU','保养件','涵盖油品、冷却液、养护品、滤芯与尿素等日常保养产品。',['油品','滤芯','冷却液'],'assets/product-lineup.png'], en: ['1,000+ SKUs','Maintenance parts','Oils, coolants, care products, filters, urea and other routine maintenance essentials.',['Oils','Filters','Coolants'],'assets/product-lineup.png'] },
  wear: { zh: ['1,500+ SKU','易损件','覆盖轮胎、蓄电池、电机、离合器与摩擦片等高频更换部件。',['离合器','摩擦片','蓄电池'],'assets/clutch.png'], en: ['1,500+ SKUs','Wear parts','Tires, batteries, motors, clutches, friction pads and other frequently replaced parts.',['Clutches','Friction pads','Batteries'],'assets/clutch.png'] },
  repair: { zh: ['2,300+ SKU','维修件','覆盖发动机基础件、缸套组件、增压器、水泵与制动鼓等系统维修产品。',['发动机件','制动鼓','底盘件'],'assets/chassis.png'], en: ['2,300+ SKUs','Repair parts','Engine basics, cylinder kits, turbochargers, water pumps, brake drums and more.',['Engine parts','Brake drums','Chassis'],'assets/chassis.png'] },
  accident: { zh: ['1,000+ SKU','事故件','包含驾驶室、灯具、保险杠与后视镜等车身事故维修部件。',['驾驶室','灯具','保险杠'],'assets/pickup.png'], en: ['1,000+ SKUs','Accident parts','Cabs, lamps, bumpers, mirrors and body repair components.',['Cabs','Lamps','Bumpers'],'assets/pickup.png'] },
  modification: { zh: ['200+ SKU','改装件','覆盖卷帘、龙门架、地垫及皮卡功能升级配件。',['卷帘','龙门架','地垫'],'assets/pickup.png'], en: ['200+ SKUs','Modification parts','Roller shutters, gantry racks, floor mats and pickup upgrades.',['Roller shutters','Gantry racks','Floor mats'],'assets/pickup.png'] },
  energy: { zh: ['100+ SKU','新能源配件','涵盖充电桩、随车充、仪表等新能源补能与配套设备。',['充电桩','随车充','仪表'],'assets/charging-family.png'], en: ['100+ SKUs','New-energy parts','Charging piles, portable chargers, meters and supporting equipment.',['Charging piles','Portable chargers','Meters'],'assets/charging-family.png'] }
};

let language = 'zh';
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#site-nav');
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

function renderProduct(key) {
  const [count,title,description,tags,image] = products[key][language];
  document.querySelector('#product-count').textContent = count;
  document.querySelector('#product-title').textContent = title;
  document.querySelector('#product-description').textContent = description;
  document.querySelector('#product-tags').innerHTML = tags.map(tag => `<span>${tag}</span>`).join('');
  const productImage = document.querySelector('#product-image');
  productImage.src = image;
  productImage.alt = title;
  document.querySelector('#product-catalog-link').dataset.category = key;
}

document.querySelectorAll('[data-product]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-product]').forEach(item => item.setAttribute('aria-selected','false'));
  button.setAttribute('aria-selected','true');
  renderProduct(button.dataset.product);
}));

document.querySelector('.lang-switch').addEventListener('click', event => {
  language = language === 'zh' ? 'en' : 'zh';
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-zh]').forEach(node => { node.innerHTML = node.dataset[language]; });
  event.currentTarget.innerHTML = language === 'zh' ? '<span>中</span> / EN' : '中 / <span>EN</span>';
  const selected = document.querySelector('[data-product][aria-selected="true"]');
  renderProduct(selected.dataset.product);
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

const catalogState = { category: 'all', query: '', page: 1, zoom: 1 };
const catalogElements = {
  categories: document.querySelector('#catalog-categories'), search: document.querySelector('#catalog-search'),
  thumbnails: document.querySelector('#catalog-thumbnails'), resultCount: document.querySelector('#catalog-result-count'),
  image: document.querySelector('#catalog-page-image'), viewport: document.querySelector('#catalog-page-viewport'),
  category: document.querySelector('#catalog-page-category'), title: document.querySelector('#catalog-page-title'),
  input: document.querySelector('#catalog-page-input'), pdfLink: document.querySelector('#catalog-pdf-link'),
  prev: document.querySelector('#catalog-prev'), next: document.querySelector('#catalog-next'), zoom: document.querySelector('#catalog-zoom')
};

function catalogLabel(category) { return catalogCategories[category][language]; }
function filteredCatalogPages() {
  const query = catalogState.query.trim().toLowerCase();
  return catalogPages.filter(page => {
    const categoryMatch = catalogState.category === 'all' || page.category === catalogState.category;
    const searchText = `${page.zh} ${page.en} ${catalogCategories[page.category].zh} ${catalogCategories[page.category].en} ${page.page}`.toLowerCase();
    return categoryMatch && (!query || searchText.includes(query));
  });
}

function renderCatalogCategories() {
  catalogElements.categories.innerHTML = Object.entries(catalogCategories).map(([key,value]) =>
    `<button type="button" data-catalog-category="${key}" aria-pressed="${key === catalogState.category}">${value[language]}</button>`
  ).join('');
  catalogElements.categories.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    catalogState.category = button.dataset.catalogCategory;
    const first = filteredCatalogPages()[0];
    if (first) catalogState.page = first.page;
    renderCatalog();
  }));
}

function selectCatalogPage(pageNumber, scrollThumbnail = true) {
  const page = catalogPages.find(item => item.page === Number(pageNumber));
  if (!page) return;
  catalogState.page = page.page;
  catalogElements.image.src = page.image;
  catalogElements.image.alt = language === 'zh' ? `产品手册第 ${page.page} 页：${page.zh}` : `Product manual page ${page.page}: ${page.en}`;
  catalogElements.category.textContent = catalogLabel(page.category);
  catalogElements.title.textContent = page[language];
  catalogElements.input.value = page.page;
  catalogElements.pdfLink.href = `assets/FOTON-AUTOMATE-product-manual.pdf#page=${page.page}`;
  catalogElements.viewport.scrollTo({top:0,left:0});
  document.querySelectorAll('.catalog-thumb').forEach(button => button.setAttribute('aria-current', button.dataset.page == page.page ? 'page' : 'false'));
  if (scrollThumbnail) document.querySelector(`.catalog-thumb[data-page="${page.page}"]`)?.scrollIntoView({block:'nearest',inline:'nearest'});
  const visiblePages = filteredCatalogPages();
  const visibleIndex = visiblePages.findIndex(item => item.page === page.page);
  catalogElements.prev.disabled = visibleIndex <= 0;
  catalogElements.next.disabled = visibleIndex < 0 || visibleIndex === visiblePages.length - 1;
  [page.page - 1,page.page + 1].filter(number => number >= 1 && number <= catalogPages.length).forEach(number => {
    const preload = new Image(); preload.src = catalogPages[number - 1].image;
  });
}

function renderCatalog() {
  renderCatalogCategories();
  const pages = filteredCatalogPages();
  catalogElements.resultCount.textContent = pages.length;
  catalogElements.thumbnails.innerHTML = pages.length ? pages.map(page => `
    <button class="catalog-thumb" type="button" data-page="${page.page}" aria-current="${page.page === catalogState.page ? 'page' : 'false'}">
      <img src="${page.image}" alt="" loading="lazy">
      <span><strong>${language === 'zh' ? '第' : 'Page'} ${page.page} ${language === 'zh' ? '页' : ''}</strong><span>${page[language]}</span></span>
    </button>`).join('') : `<p class="catalog-empty">${language === 'zh' ? '没有匹配的目录页面。' : 'No matching catalog pages.'}</p>`;
  catalogElements.thumbnails.querySelectorAll('.catalog-thumb').forEach(button => button.addEventListener('click', () => selectCatalogPage(button.dataset.page, false)));
  if (!pages.some(page => page.page === catalogState.page) && pages[0]) catalogState.page = pages[0].page;
  selectCatalogPage(catalogState.page, false);
}

catalogElements.search.addEventListener('input', event => {
  catalogState.query = event.target.value;
  const first = filteredCatalogPages()[0];
  if (first) catalogState.page = first.page;
  renderCatalog();
});
catalogElements.input.addEventListener('change', event => {
  catalogState.category = 'all'; catalogState.query = ''; catalogElements.search.value = '';
  catalogState.page = Math.min(63, Math.max(1, Number(event.target.value) || 1)); renderCatalog();
});
function moveCatalogPage(offset) {
  const pages = filteredCatalogPages();
  const index = pages.findIndex(page => page.page === catalogState.page);
  if (pages[index + offset]) selectCatalogPage(pages[index + offset].page);
}
catalogElements.prev.addEventListener('click', () => moveCatalogPage(-1));
catalogElements.next.addEventListener('click', () => moveCatalogPage(1));
document.querySelector('#catalog-zoom-out').addEventListener('click', () => setCatalogZoom(catalogState.zoom - .2));
document.querySelector('#catalog-zoom-in').addEventListener('click', () => setCatalogZoom(catalogState.zoom + .2));
document.querySelector('#catalog-fullscreen').addEventListener('click', () => catalogElements.viewport.requestFullscreen?.());

function setCatalogZoom(value) {
  catalogState.zoom = Math.min(1.8, Math.max(.6, value));
  catalogElements.image.style.width = `${catalogState.zoom * 100}%`;
  catalogElements.image.style.maxWidth = `${840 * catalogState.zoom}px`;
  catalogElements.zoom.value = `${Math.round(catalogState.zoom * 100)}%`;
}

document.addEventListener('keydown', event => {
  if (!catalogElements.viewport.matches(':fullscreen') && location.hash !== '#catalog') return;
  if (event.key === 'ArrowLeft') moveCatalogPage(-1);
  if (event.key === 'ArrowRight') moveCatalogPage(1);
});

document.querySelector('.lang-switch').addEventListener('click', renderCatalog);
document.querySelector('#product-catalog-link').addEventListener('click', event => {
  catalogState.category = event.currentTarget.dataset.category;
  catalogState.query = '';
  catalogElements.search.value = '';
  const first = filteredCatalogPages()[0];
  if (first) catalogState.page = first.page;
  renderCatalog();
});
renderCatalog();
