(function(){
  'use strict';
  const $ = (s,r=document) => r.querySelector(s);
  const $$ = (s,r=document) => [...r.querySelectorAll(s)];
  const pageSelect = $('#pageSelect');
  const storageKey = 'mitsabPageContent';
  const mediaKey = 'mitsabAdminMedia';
  let activeImageField = null;
  let toastTimer;

  const media = [
    {name:'site-team-briefing.jpg', meta:'2.4 MB · 2400×1600', url:'https://picsum.photos/seed/mitsab-media-a/900/600'},
    {name:'frontier-safety-upgrade.jpg', meta:'1.8 MB · 2400×1600', url:'https://picsum.photos/seed/mitsab-media-b/900/600'},
    {name:'marine-operations.jpg', meta:'3.1 MB · 2400×1600', url:'https://picsum.photos/seed/mitsab-media-c/900/600'},
    {name:'drilling-camp-works.jpg', meta:'2.0 MB · 2400×1600', url:'https://picsum.photos/seed/mitsab-media-d/900/600'},
    {name:'equipment-maintenance.jpg', meta:'1.6 MB · 2400×1600', url:'https://picsum.photos/seed/mitsab-media-e/900/600'},
    {name:'team-on-site.jpg', meta:'2.2 MB · 2400×1600', url:'https://picsum.photos/seed/mitsab-media-f/900/600'},
    {name:'environmental-survey.jpg', meta:'1.7 MB · 2400×1600', url:'https://picsum.photos/seed/mitsab-media-g/900/600'},
    {name:'engineering-drawings.jpg', meta:'1.1 MB · 1800×1200', url:'https://picsum.photos/seed/mitsab-media-h/900/600'}
  ];
  const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
  const pages = {
    home:{title:'Home',description:'Edit all homepage sections from one place.',sections:[
      {name:'Hero',summary:'Main headline, introduction, and primary actions',fields:[['eyebrow','Eyebrow','Construction · Exploration · Environmental Services — Lagos, Nigeria','input'],['headline','Headline','We build the ground truth beneath big plans.','textarea'],['description','Description','Mitsab Resources Global plans, engineers and delivers infrastructure for clients across construction, oil & gas and environmental sectors — with the paperwork, safety record and site discipline to match.','textarea']],links:[['primaryLabel','Primary button label','See our capabilities'],['primaryUrl','Primary button link','services.html'],['secondaryLabel','Secondary button label','Talk to our team'],['secondaryUrl','Secondary button link','contact.html']],image:['Hero background image','marine-operations.jpg','https://picsum.photos/seed/mitsab-media-c/900/600']},
      {name:'Company introduction',summary:'The homepage “Who we are” section',fields:[['sectionTitle','Section heading','A local builder with a national reach.','textarea'],['description','Intro copy','Registered in Nigeria and grown out of an established oil & gas parent company, Mitsab operates where engineering discipline meets local knowledge of how projects actually get built.','textarea'],['body','Body copy','That background shapes how we work: clear scopes, tracked schedules, and a project team that stays close to the client from planning through handover.','textarea']],links:[['linkLabel','Read more label','More about the company →'],['linkUrl','Read more link','about.html']],image:['Section image','site-team-briefing.jpg','https://picsum.photos/seed/mitsab-media-a/900/600']},
      {name:'Capabilities',summary:'Service cards shown on the homepage',fields:[['sectionTitle','Section heading','Five disciplines, one project team.','textarea'],['description','Section description','From first survey to final handover, these are the services we bring in-house.','textarea'],['items','Visible services','Construction & Civil Works | Exploration Support | Environmental Services | Project & Program Management | Engineering & Design | Industrial Maintenance','textarea']]},
      {name:'Selected work',summary:'Project portfolio preview',fields:[['sectionTitle','Section heading','Innovative construction, exceptional craftsmanship.','textarea'],['description','Section description','A sample of recent delivery across our project sites in Akwa Ibom State.','textarea']],links:[['linkLabel','View all projects label','View all projects →'],['linkUrl','View all projects link','projects.html']]},
      {name:'Contact call-to-action',summary:'Final conversion section and contact link',fields:[['sectionTitle','Heading','Tell us what you’re building.','textarea'],['description','Supporting copy','Send us a brief and our team will get back to you.','textarea']],links:[['linkLabel','Contact button label','Start a conversation'],['linkUrl','Contact button link','contact.html']]}
    ]},
    'about-us':{title:'About Us',description:'Company story, registration details, and values.',sections:[
      {name:'Page introduction',summary:'Page title and lead paragraph',fields:[['headline','Page headline','A local builder with a national reach.','textarea'],['description','Lead paragraph','Registered in Nigeria and grown out of an established oil & gas parent company, Mitsab operates where engineering discipline meets local knowledge of how projects actually get built.','textarea']],image:['Featured image','site-team-briefing.jpg','https://picsum.photos/seed/mitsab-media-a/900/600']},
      {name:'Company story',summary:'About copy and parent company information',fields:[['body','Company story','Mitsab Resources Global Limited is a multi-disciplinary Nigerian company delivering projects across construction, exploration and environmental services. We were established under the company that birthed us, T-SAB Resources, an established name in oil & gas.','textarea'],['registration','Registration number','RC 1667132','input'],['headquarters','Headquarters','Lagos, Nigeria','input'],['parentCompany','Parent company','T-SAB Resources','input']]},
      {name:'Values',summary:'The principles shown on the About page',fields:[['sectionTitle','Section heading','How we work with clients.','textarea'],['items','Values','Clear scopes | Tracked schedules | Close client partnership | Safe delivery','textarea']]},
      {name:'Page call-to-action',summary:'Closing message and link',fields:[['headline','Closing heading','Ready to build what’s next?','textarea']],links:[['linkLabel','Button label','Talk to our team'],['linkUrl','Button link','contact.html']]}
    ]},
    services:{title:'Services',description:'Manage the services list, descriptions, and supporting call-to-action.',sections:[
      {name:'Page introduction',summary:'Services page title and opening text',fields:[['headline','Page headline','Five disciplines, one project team.','textarea'],['description','Lead paragraph','From first survey to final handover, these are the services we bring in-house.','textarea']]},
      {name:'Service catalogue',summary:'All service names and descriptions',fields:[['items','Services and descriptions','General Contracting — End-to-end oversight of a construction project.\nProject & Program Management — Planning, coordination and oversight.\nManpower Supply & Management — Personnel and technical resourcing.\nRenovation & Remodeling — Updating and improving existing structures.\nMinor Civil Maintenance — Infrastructure upkeep and repairs.\nWelding & Fabrication — Structural steel, piping, supports and custom metalwork.\nPre-Construction Services — Feasibility studies, cost estimation and risk assessment.\nBorehole Drilling Services — Reliable, sustainable water solutions.\nEarthwork & Landscaping — Grading, excavation and outdoor space design.','textarea']],image:['Services header image','engineering-drawings.jpg','https://picsum.photos/seed/mitsab-media-h/900/600']},
      {name:'Next step',summary:'Link to selected work',fields:[['headline','Closing heading','See it applied to real work.','textarea']],links:[['linkLabel','Button label','View selected work'],['linkUrl','Button link','projects.html']]}
    ]},
    projects:{title:'Projects',description:'Update the project page introduction, filters, and portfolio entries.',sections:[
      {name:'Page introduction',summary:'Project page headline and lead copy',fields:[['headline','Page headline','Innovative construction projects, exceptional craftsmanship.','textarea'],['description','Lead paragraph','A running record of delivery across our active sites.','textarea']],image:['Header image','frontier-safety-upgrade.jpg','https://picsum.photos/seed/mitsab-media-b/900/600']},
      {name:'Project entries',summary:'Names, categories, locations, and project status',fields:[['items','Projects','Safety upgrade at a Frontier Oil facility — Safety Infrastructure — Ibeno LGA, Akwa Ibom State\nSoak-away pits & septic tank, drilling camp — Civil Works — Qua Iboe Field\nResilient infrastructure for a military base — Construction — Ibeno LGA, Akwa Ibom State','textarea']]},
      {name:'Project call-to-action',summary:'Closing contact prompt',fields:[['headline','Closing heading','Have a project like these?','textarea']],links:[['linkLabel','Button label','Start a conversation'],['linkUrl','Button link','contact.html']]}
    ]},
    newsroom:{title:'Newsroom',description:'Manage newsroom headings, article cards, and newsletter links.',sections:[
      {name:'Page introduction',summary:'Newsroom headline and supporting copy',fields:[['headline','Page headline','Updates from the field.','textarea'],['description','Lead paragraph','Short updates from active sites, equipment work and operations.','textarea']],image:['Header image','team-on-site.jpg','https://picsum.photos/seed/mitsab-media-f/900/600']},
      {name:'Articles',summary:'Article titles, summaries, dates, and categories',fields:[['items','Articles','Recognizing the team behind the work — Events — Jul 2025\nMarine escort services for safe cargo delivery — Marine Operations — Aug 2025\nKeeping heavy equipment running: CAT maintenance — Equipment & Services — Aug 2025','textarea']]},
      {name:'Newsletter call-to-action',summary:'Closing signup prompt',fields:[['headline','Heading','Want updates like these in your inbox?','textarea']],links:[['linkLabel','Button label','Get in touch'],['linkUrl','Button link','contact.html']]}
    ]},
    'our-subsidiaries':{title:'Our Subsidiaries',description:'Manage the group companies and subsidiary descriptions.',sections:[
      {name:'Page introduction',summary:'Page headline and lead copy',fields:[['headline','Page headline','The group behind the work.','textarea'],['description','Lead paragraph','Specialist companies bringing technical depth, local knowledge and safe execution to every project.','textarea']]},
      {name:'Subsidiary profiles',summary:'Company names, descriptions, and links',fields:[['items','Subsidiaries','T-SAB Resources — Established oil & gas parent company.\nDe-Absareal Global Limited — Scaffold installation and tank maintenance.\nMitsab Security Services Limited — Security support for people, sites and assets.','textarea']]},
      {name:'Contact call-to-action',summary:'Closing message and link',fields:[['headline','Closing heading','Work with the Mitsab group.','textarea']],links:[['linkLabel','Button label','Contact our team'],['linkUrl','Button link','contact.html']]}
    ]}
  };

  function getPageKey(){const raw=new URLSearchParams(location.search).get('page') || 'home';return pages[raw] ? raw : 'home';}
  function valueFor(key, fallback){return saved[getPageKey()]?.[key] ?? fallback;}
  function renderPage(){
    const key=getPageKey(); const page=pages[key]; pageSelect.value=key;
    $('#pageEyebrow').textContent='PAGE / '+page.title.toUpperCase(); $('#pageTitle').textContent=page.title; $('#pageDescription').textContent=page.description;
    $('#sectionNav').innerHTML=page.sections.map((s,i)=>`<button type="button" data-section="section-${i}">${String(i+1).padStart(2,'0')} · ${s.name}</button>`).join('');
    $('#sections').innerHTML=page.sections.map((section,index)=>renderSection(section,index,key)).join('');
    $$('#sectionNav button').forEach(btn=>btn.addEventListener('click',()=>{const target=$('#'+btn.dataset.section);target.classList.add('open');target.scrollIntoView({behavior:'smooth',block:'start'});$$('.section-nav button').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}));
    $$('.section-head').forEach(head=>head.addEventListener('click',()=>head.closest('.section-card').classList.toggle('open')));
    $$('.choose-media').forEach(btn=>btn.addEventListener('click',()=>openMediaPicker(btn.dataset.field)));
    $$('.duplicate-section').forEach(btn=>btn.addEventListener('click',()=>showToast('Section duplication will be available after backend connection')));
    $('#sections .section-card:first-child')?.classList.add('open');
  }
  function renderSection(section,index,key){
    const savedPage=saved[key]||{};
    const fields=section.fields?.map(([id,label,fallback,type])=>`<label class="field ${type==='textarea'?'full':''}">${label}${type==='textarea'?`<textarea data-key="${id}" rows="4">${escapeHtml(savedPage[id] ?? fallback)}</textarea>`:`<input data-key="${id}" value="${escapeAttr(savedPage[id] ?? fallback)}">`}</label>`).join('')||'';
    const links=section.links?.map(([id,label,fallback])=>`<label class="field"><span>${label}</span><input data-key="${id}" value="${escapeAttr(savedPage[id] ?? fallback)}"></label>`).join('')||'';
    const linkBlock=links?`<div class="link-fields"><p class="link-title">BUTTONS &amp; LINKS</p><div class="field-grid">${links}</div></div>`:'';
    const imageBlock=section.image?`<label class="field full"><span>${section.image[0]}</span><div class="image-field"><span class="image-thumb ${savedPage[section.image[0]]?'':'image-empty'}" data-image-preview="${index}" style="${savedPage[section.image[0]]||section.image[2] ? `background-image:url('${savedPage[section.image[0]]||section.image[2]}')`:''}">${savedPage[section.image[0]]||section.image[2]?'':'▧'}</span><span class="image-meta"><b data-image-name="${index}">${savedPage[section.image[0]+'_name']||section.image[1]}</b><small>Selected from your media library</small></span><button type="button" class="choose-media" data-field="${section.image[0]}" data-index="${index}">Choose media</button></div></label>`:'';
    return `<article class="section-card" id="section-${index}"><div class="section-head"><span class="section-number">${String(index+1).padStart(2,'0')}</span><div><b>${section.name}</b><small>${section.summary}</small></div><span class="section-toggle">⌄</span></div><div class="section-body"><div class="field-grid">${fields}${imageBlock}</div>${linkBlock}<div class="section-actions"><button type="button" class="duplicate-section">＋ Add another item to this section</button></div></div></article>`;
  }
  function escapeHtml(s){return String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}
  function escapeAttr(s){return escapeHtml(s).replace(/"/g,'&quot;');}
  function openMediaPicker(field){activeImageField=field;renderMedia();$('#mediaBackdrop').classList.add('open');}
  function renderMedia(filter=''){
    const uploaded=JSON.parse(localStorage.getItem(mediaKey)||'[]'); const assets=[...uploaded,...media]; const q=filter.toLowerCase();
    $('#drawerGrid').innerHTML=assets.filter(m=>m.name.toLowerCase().includes(q)).map(m=>`<button type="button" class="media-choice" data-url="${m.url}" data-name="${escapeAttr(m.name)}" style="background-image:url('${m.url}')"><div><b>${escapeHtml(m.name)}</b><small>${escapeHtml(m.meta||'Uploaded just now')}</small></div></button>`).join('') || '<p class="empty">No media found.</p>';
    $$('.media-choice').forEach(choice=>choice.addEventListener('click',()=>{const preview=$(`[data-image-preview="${$$('.choose-media').findIndex(b=>b.dataset.field===activeImageField)}"]`);const name=$(`[data-image-name="${$$('.choose-media').findIndex(b=>b.dataset.field===activeImageField)}"]`);if(preview){preview.style.backgroundImage=`url('${choice.dataset.url}')`;preview.classList.remove('image-empty');preview.textContent='';}if(name)name.textContent=choice.dataset.name;const field=$(`.choose-media[data-field="${CSS.escape(activeImageField)}"]`);if(field){field.dataset.selectedUrl=choice.dataset.url;field.dataset.selectedName=choice.dataset.name;}$('#mediaBackdrop').classList.remove('open');}));
  }
  function savePage(publish=true){
    const key=getPageKey(); const data={}; $$('[data-key]').forEach(el=>data[el.dataset.key]=el.value); $$('.choose-media').forEach(btn=>{if(btn.dataset.selectedUrl){data[btn.dataset.field]=btn.dataset.selectedUrl;data[btn.dataset.field+'_name']=btn.dataset.selectedName;}}); saved[key]=data;localStorage.setItem(storageKey,JSON.stringify(saved));$('#saveState').textContent=publish?'Published just now':'Draft saved just now';$('#lastSaved').textContent='Last saved just now';showToast(publish?'Page changes published':'Draft saved');
  }
  function showToast(message){$('#toastMessage').textContent=message;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2800)}
  pageSelect.addEventListener('change',()=>{const key=pageSelect.value;history.replaceState({},'',`editor.html?page=${key}`);renderPage();});
  $('#savePage').addEventListener('click',()=>savePage(true));
  $('#previewPage').addEventListener('click',()=>{const map={home:'../index.html','about-us':'../about.html',services:'../services.html',projects:'../projects.html',newsroom:'../newsroom.html','our-subsidiaries':'../subsidiaries.html'};window.open(map[getPageKey()], '_blank');});
  $('#closeMedia').addEventListener('click',()=>$('#mediaBackdrop').classList.remove('open'));
  $('#mediaBackdrop').addEventListener('click',e=>{if(e.target===$('#mediaBackdrop'))$('#mediaBackdrop').classList.remove('open')});
  $('#mediaSearch').addEventListener('input',e=>renderMedia(e.target.value));
  $('#drawerUpload').addEventListener('click',()=>$('#drawerFile').click());
  $('#drawerFile').addEventListener('change',e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{const uploaded=JSON.parse(localStorage.getItem(mediaKey)||'[]');uploaded.unshift({name:file.name,meta:`${(file.size/1024/1024).toFixed(1)} MB · Uploaded just now`,url:ev.target.result});localStorage.setItem(mediaKey,JSON.stringify(uploaded));renderMedia($('#mediaSearch').value);showToast('Image uploaded to media library')};reader.readAsDataURL(file);e.target.value='';});
  renderPage();
})();
