document.addEventListener('DOMContentLoaded',()=>{
 const menu=document.querySelector('.menu-btn'), nav=document.querySelector('.nav-links');
 if(menu&&nav) menu.addEventListener('click',()=>nav.classList.toggle('open'));
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');observer.unobserve(e.target)}}),{threshold:.12});
 document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

 const lightbox=document.querySelector('#lightbox');
 const openLightbox=(title,image)=>{
   if(!lightbox)return;
   lightbox.querySelector('.lb-title').textContent=title||'Project';
   const media=lightbox.querySelector('.lightbox-media');
   media.innerHTML=image?`<img src="${image}" alt="${title||'Project'}">`:'';
   lightbox.classList.add('open');
 };
 document.querySelectorAll('[data-project]').forEach(card=>card.addEventListener('click',()=>openLightbox(card.dataset.title,card.dataset.image)));
 document.querySelectorAll('.top-image-slot img[data-image-base]').forEach(img=>{
   const exts=['jpg','jpeg','png','webp'];
   let i=0;
   const base=img.dataset.imageBase;
   const tryNext=()=>{
     if(i>=exts.length){ img.parentElement.classList.add('image-missing'); img.remove(); return; }
     const ext=exts[i++];
     img.src=`${base}.${ext}`;
   };
   img.addEventListener('error',tryNext);
   tryNext();
 });
 const close=()=>lightbox?.classList.remove('open');
 document.querySelector('.lightbox-close')?.addEventListener('click',close);
 lightbox?.addEventListener('click',e=>{if(e.target===lightbox)close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});

 const projectPage=document.querySelector('#project-grid');
 if(projectPage){
   const configs={
     pattern:{title:'Pattern Design',folder:'pattern-design',prefix:'pattern',description:'Repeatable visual designs for backgrounds, packaging, stationery and digital content.'},
     tute:{title:'Tute Cover Design',folder:'tute-cover-design',prefix:'tute',description:'Educational cover designs that make subjects easy to identify and notes look organised.'},
     social:{title:'Social Media Post Design',folder:'social-media-post-design',prefix:'social',description:'Social graphics designed to communicate promotions, announcements and brand messages clearly.'},
     printable:{title:'Printable Design',folder:'printable-design',prefix:'printable',description:'Print-ready creative work for posters, flyers, cards, labels and other physical materials.'}
   };
   const key=new URLSearchParams(location.search).get('category');
   const config=configs[key];
   const section=document.querySelector('#project-gallery');
   const categories=document.querySelector('#category-grid');
   const heading=document.querySelector('#category-title');
   if(config){
     categories.hidden=true; section.hidden=false;
     document.querySelector('#project-kicker').textContent=config.title;
     document.querySelector('#project-heading').textContent='My Projects';
     if(heading)heading.textContent=config.title;
     const grid=document.querySelector('#project-grid');
     const empty=document.querySelector('#empty-projects');
     let found=0;
     const tryImage=(slot,extIndex=0)=>{
       const exts=['jpg','jpeg','png','webp'];
       if(extIndex>=exts.length){
         if(slot===20 && found===0){
           empty.hidden=false;
         }
         return;
       }
       const path=`assets/projects/${config.folder}/${config.prefix}-${String(slot).padStart(2,'0')}.${exts[extIndex]}`;
       const img=new Image();
       img.onload=()=>{
         found++;
         const card=document.createElement('article');
         card.className='project-card reveal';
         card.innerHTML=`<div class="project-media"><img src="${path}" alt="${config.title} project ${slot}" loading="lazy" decoding="async"></div><div class="project-info"><span class="pill">${config.title}</span><h3>Project ${String(slot).padStart(2,'0')}</h3><p>${config.description}</p></div>`;
         card.addEventListener('click',()=>openLightbox(`${config.title} — Project ${String(slot).padStart(2,'0')}`,path));
         grid.appendChild(card); observer.observe(card);
       };
       img.onerror=()=>tryImage(slot,extIndex+1);
       img.src=path;
     };
     for(let i=1;i<=20;i++)tryImage(i);
   }
 }
});