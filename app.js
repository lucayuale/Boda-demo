(() => {
 'use strict';
 const config=window.VYB_CONFIG;
 if(!config)throw new Error('Missing config.js');
 const types=()=>config.services.map(s=>s.id);
 const todayLocal=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
 const emailValid=v=>typeof v==='string'&&v.length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
 function validDate(value,today=todayLocal()){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return false;
  const [y,m,d]=value.split('-').map(Number),date=new Date(y,m-1,d);
  return date.getFullYear()===y&&date.getMonth()===m-1&&date.getDate()===d&&value>=today;
 }
 function validate(values,today=todayLocal()){
  const e={};
  if(!values.fullName?.trim())e.fullName='required';else if(values.fullName.trim().length<2||values.fullName.trim().length>100)e.fullName='errorName';
  if(!values.email?.trim())e.email='required';else if(!emailValid(values.email.trim()))e.email='errorEmail';
  if(!values.date)e.date='required';else if(!validDate(values.date,today))e.date='errorDate';
  if(!types().includes(values.eventType))e.eventType='errorType';
  if(!String(values.guests||'').trim())e.guests='required';else if(!/^\d+$/.test(String(values.guests))||Number(values.guests)<1||Number(values.guests)>5000)e.guests='errorGuests';
  if((values.message||'').length>2000)e.message='errorMessage';return e;
 }
 function getEndpoint(settings=config){const f=settings.contact?.form;return f?.provider==='formspree'&&f.enabled===true&&f.recipientConfirmed===true&&/^[a-zA-Z0-9]{6,32}$/.test(f.formId||'')?'https://formspree.io/f/'+f.formId:'';}
 function validHttpsUrl(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';}catch{return '';}}
 function safeImageSource(value){return typeof value==='string'&&/^assets\/[a-zA-Z0-9_./-]+\.(webp|png|jpe?g|avif|svg)$/i.test(value)&&!value.split('/').includes('..')?value:'';}
 async function send(values,options={}){
  const errors=validate(values,options.today);if(Object.keys(errors).length)return {status:'invalid',errors};
  const endpoint=getEndpoint(options.config||config);if(!endpoint)return {status:'pending'};
  if(values._gotcha)return {status:'error'};
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),options.timeoutMs||15000);
  try{
   const response=await(options.fetchImpl||fetch)(endpoint,{method:'POST',headers:{Accept:'application/json','Content-Type':'application/json'},credentials:'omit',redirect:'error',referrerPolicy:'no-referrer',signal:controller.signal,body:JSON.stringify({name:values.fullName.trim(),email:values.email.trim(),date:values.date,celebration:values.eventType,guests:Number(values.guests),message:(values.message||'').trim(),language:values.language==='es'?'es':'en',_subject:config.business.name+' — Event enquiry',_gotcha:''})});
   const data=await response.json().catch(()=>null);return {status:response.status===429?'limit':response.ok&&data?.ok===true?'success':'error'};
  }catch{return {status:'network'};}finally{clearTimeout(timer);}
 }
 window.VYB_EVENT_HELPERS={validate,validDate,emailValid,getEndpoint,send,validHttpsUrl,safeImageSource,todayLocal};
 if(typeof document==='undefined')return;
 const $=id=>document.getElementById(id);
 let language='en';try{const stored=localStorage.getItem(config.language.storageKey);if(['en','es'].includes(stored))language=stored;}catch{}
 const local=v=>v&&typeof v==='object'?(v[language]??v.en??''):(v??'');
 const t=key=>config.translations[language][key]||key;
 const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
 const motion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
 function photo(key,cls=''){const item=config.images[key],img=node('img',cls);img.src=safeImageSource(item.src);img.alt=local(item.alt);img.loading='eager';img.decoding='async';img.width=900;img.height=1100;return img;}
 const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08}):null;
 function reveal(){document.querySelectorAll('.reveal:not(.visible)').forEach(el=>observer?observer.observe(el):el.classList.add('visible'));}
 function renderServices(){
  $('service-list').replaceChildren();
  config.services.forEach((service,i)=>{
   const card=node('article','service-card reveal'),visual=node('div','service-image'),top=node('div','service-top');visual.append(photo(service.image));top.append(node('h3','',local(service.title)),node('span','',String(i+1).padStart(2,'0')));
   const link=node('a','underlined');link.href='#enquiry';link.dataset.eventType=service.id;link.append(node('span','',t('serviceCTA')),node('span','','↗'));card.append(visual,top,node('p','',local(service.description)),link);$('service-list').append(card);
  });
 }
 function renderGallery(){
  $('gallery-grid').replaceChildren();
  config.gallery.forEach((key,i)=>{const item=config.images[key],button=node('button','gallery-tile reveal'),visual=node('span','gallery-image'),plus=node('span','gallery-plus','+'),caption=node('span','caption',local(item.caption));button.type='button';button.setAttribute('aria-label',t('galleryOpen')+': '+local(item.alt));plus.setAttribute('aria-hidden','true');visual.append(photo(key),plus);caption.append(node('small','',String(i+1).padStart(2,'0')));button.append(visual,caption);button.addEventListener('click',()=>openGallery(i,button));$('gallery-grid').append(button);});
 }
 function renderExperience(){
  $('experience-list').replaceChildren();config.experiences.forEach((item,i)=>{const row=node('div','experience-row'),copy=node('div');copy.append(node('h3','',local(item.title)),node('p','',local(item.body)));row.append(node('span','',String(i+1).padStart(2,'0')),copy);$('experience-list').append(row);});
 }
 const form=$('event-form'),fields=['fullName','email','date','eventType','guests','message'];let errors={},statusKey='',busy=false;
 form.removeAttribute('inert');$('date').min=todayLocal();$('date').addEventListener('focus',()=>{$('date').min=todayLocal();});
 function renderForm(){
  $('form-notice').textContent=t(getEndpoint()?'ready':'pending');$('form-submit').firstElementChild.textContent=t(busy?'sending':getEndpoint()?'send':'check');$('form-submit').disabled=busy;form.setAttribute('aria-busy',String(busy));
  fields.forEach(name=>{$('error-'+name).textContent=errors[name]?t(errors[name]):'';$(name).setAttribute('aria-invalid',String(Boolean(errors[name])));});$('form-status').textContent=statusKey?t(statusKey):'';
 }
 const nav=$('main-nav'),menu=$('menu-toggle'),mobile=matchMedia('(max-width:900px)');
 function syncMenu(){const open=menu.getAttribute('aria-expanded')==='true';nav.inert=mobile.matches&&!open;menu.setAttribute('aria-label',t(open?'closeMenu':'openMenu'));}
 function closeMenu(focus=false){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');syncMenu();if(focus)menu.focus();}
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);syncMenu();});mobile.addEventListener('change',()=>closeMenu());
 nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeMenu()));document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});
 let selectedImage=0,previousGalleryFocus=null;const dialog=$('lightbox');
 function updateGallery(){const item=config.images[config.gallery[selectedImage]];$('lightbox-image').src=safeImageSource(item.src);$('lightbox-image').alt=local(item.alt);$('lightbox-caption').textContent=local(item.caption);$('lightbox-counter').textContent=String(selectedImage+1).padStart(2,'0')+' / '+String(config.gallery.length).padStart(2,'0');}
 function openGallery(i,trigger){selectedImage=i;previousGalleryFocus=trigger;updateGallery();dialog.showModal();document.body.classList.add('lightbox-open');$('lightbox-close').focus();}
 function closeGallery(){dialog.close();}
 dialog.addEventListener('close',()=>{document.body.classList.remove('lightbox-open');$('lightbox-image').removeAttribute('src');if(previousGalleryFocus?.isConnected)previousGalleryFocus.focus();});
 $('lightbox-close').addEventListener('click',closeGallery);$('lightbox-prev').addEventListener('click',()=>{selectedImage=(selectedImage-1+config.gallery.length)%config.gallery.length;updateGallery();});$('lightbox-next').addEventListener('click',()=>{selectedImage=(selectedImage+1)%config.gallery.length;updateGallery();});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)closeGallery();}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true')closeMenu(true);if(dialog.open&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();selectedImage=(selectedImage+(e.key==='ArrowLeft'?-1:1)+config.gallery.length)%config.gallery.length;updateGallery();}});
 function setLanguage(lang,remember=true){
  language=lang==='es'?'es':'en';document.documentElement.lang=language;
  document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n);});document.querySelectorAll('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.i18nAria)));document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>el.placeholder=t(el.dataset.i18nPlaceholder));
  document.querySelector('.current-lang').textContent=language.toUpperCase();document.querySelector('.next-lang').textContent=language==='en'?'ES':'EN';$('language').setAttribute('aria-label',t('switchLanguage'));
  document.querySelectorAll('[data-business-name]').forEach(el=>el.textContent=config.business.name);document.querySelectorAll('[data-business-tagline]').forEach(el=>el.textContent=local(config.business.tagline));
  document.querySelectorAll('[data-photo]').forEach(el=>{const item=config.images[el.dataset.photo];el.src=safeImageSource(item.src);el.alt=local(item.alt);});
  document.title=local(config.seo.title);$('meta-description').content=local(config.seo.description);document.querySelector('meta[property="og:title"]').content=document.title;document.querySelector('meta[property="og:description"]').content=local(config.seo.description);
  const value=$('eventType').value;$('eventType').replaceChildren(new Option(t('typePlaceholder'),''));config.services.forEach(service=>$('eventType').append(new Option(local(service.title),service.id)));$('eventType').value=value;
  const imageWasOpen=dialog.open;renderServices();renderGallery();renderExperience();renderForm();syncMenu();reveal();
  dialog.setAttribute('aria-label',t('galleryLabel'));$('lightbox-close').setAttribute('aria-label',t('galleryClose'));$('lightbox-prev').setAttribute('aria-label',t('galleryPrev'));$('lightbox-next').setAttribute('aria-label',t('galleryNext'));if(imageWasOpen)updateGallery();
  $('address').textContent=local(config.contact.address);$('address').hidden=!local(config.contact.address);
  if(remember)try{localStorage.setItem(config.language.storageKey,language);}catch{}
 }
 $('language').addEventListener('click',()=>setLanguage(language==='en'?'es':'en'));
 document.addEventListener('click',e=>{const link=e.target.closest('[data-event-type]');if(!link)return;e.preventDefault();$('eventType').value=link.dataset.eventType;delete errors.eventType;renderForm();form.scrollIntoView({behavior:motion(),block:'start'});$('fullName').focus({preventScroll:true});});
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(busy)return;const values=Object.fromEntries(new FormData(form));values.language=language;errors=validate(values);
  if(Object.keys(errors).length){statusKey='invalid';renderForm();$(Object.keys(errors)[0]).focus();return;}
  if(!getEndpoint()){statusKey='validPending';renderForm();$('form-status').focus({preventScroll:true});return;}
  busy=true;statusKey='';renderForm();[...form.elements].forEach(el=>el.disabled=true);
  const result=await send(values);busy=false;[...form.elements].forEach(el=>el.disabled=false);statusKey={success:'success',error:'errorSend',network:'errorNetwork',limit:'errorLimit',pending:'validPending'}[result.status]||'errorSend';
  if(result.status==='success'){form.reset();errors={};}renderForm();$('form-status').focus({preventScroll:true});
 });
 for(const [key,value]of Object.entries(config.brand.colors)){if(['ivory','ink','sage','gold','soft'].includes(key)&&/^#[\da-f]{6}$/i.test(value))document.documentElement.style.setProperty('--'+key,value);}
 const logo=safeImageSource(config.business.logo);if(logo){const image=node('img');image.src=logo;image.alt=config.business.name;document.querySelector('.brand-symbol').replaceChildren(image);}
 if(emailValid(config.contact.email)){$('email-link').href='mailto:'+config.contact.email;$('email-link').textContent=config.contact.email;$('email-link').hidden=false;}
 const insta=validHttpsUrl(config.contact.instagram);if(insta){const u=new URL(insta);if(['instagram.com','www.instagram.com'].includes(u.hostname)&&u.pathname!=='/'){$('instagram-link').href=insta;$('instagram-link').hidden=false;}}
 const canonical=validHttpsUrl(config.seo.canonicalUrl);if(canonical){document.querySelector('link[rel="canonical"]').href=canonical;document.querySelector('meta[property="og:url"]').content=canonical;document.querySelector('meta[property="og:image"]').content=new URL(safeImageSource(config.images.reception.src),canonical).href;}
 $('year').textContent=new Date().getFullYear();
 let queued=false;const links=[...nav.querySelectorAll('a')];function activeNav(){queued=false;let active;links.forEach(link=>{const section=document.querySelector(link.getAttribute('href'));if(section.getBoundingClientRect().top<=160)active=link;});links.forEach(link=>active===link?link.setAttribute('aria-current','location'):link.removeAttribute('aria-current'));}
 window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(activeNav);}},{passive:true});
 setLanguage(language,false);activeNav();
})();
