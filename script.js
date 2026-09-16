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
     const exts=['jpg','jpeg','png','webp'];
     let found=0;

     // Create the cards immediately. The browser can then lazy-load only images
     // that are close to the viewport instead of probing 20 x 4 filenames first.
     for(let slot=1;slot<=20;slot++){
       const number=String(slot).padStart(2,'0');
       const base=`assets/projects/${config.folder}/${config.prefix}-${number}`;
       const card=document.createElement('article');
       card.className='project-card reveal';
       card.innerHTML=`<div class="project-media"><img src="${base}.jpg" alt="${config.title} project ${number}" loading="${slot<=4?'eager':'lazy'}" ${slot<=2?'fetchpriority="high"':''} decoding="async"></div><div class="project-info"><span class="pill">${config.title}</span><h3>Project ${number}</h3><p>${config.description}</p></div>`;
       const img=card.querySelector('img');
       let extIndex=0;
       img.addEventListener('load',()=>{found++;}, {once:true});
       img.addEventListener('error',()=>{
         extIndex++;
         if(extIndex<exts.length){
           img.src=`${base}.${exts[extIndex]}`;
         }else{
           card.remove();
           if(grid.children.length===0) empty.hidden=false;
         }
       });
       card.addEventListener('click',()=>openLightbox(`${config.title} — Project ${number}`,img.currentSrc||img.src));
       grid.appendChild(card);
       observer.observe(card);
     }
   }
 }
});
