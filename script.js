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
