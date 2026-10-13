(function(){
  'use strict';
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  const views = ['overview','pages','projects','newsroom','media','activity','settings'];
  const state = JSON.parse(localStorage.getItem('mitsabAdminState') || '{}');
  const navItems = $$('.nav-item');
  const toast = $('#toast');
  let toastTimer;

  function showToast(message){
    $('#toastMessage').textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  function openView(name){
    if (!views.includes(name)) return;
    views.forEach(view => $('#'+view+'-view')?.classList.toggle('active', view === name));
    navItems.forEach(item => item.classList.toggle('active', item.dataset.view === name));
    const label = ({overview:'Overview',pages:'Pages',projects:'Projects',newsroom:'Newsroom',media:'Media library',activity:'Activity log',settings:'Settings'})[name];
    $('#breadcrumbCurrent').textContent = label;
    $('#sidebar').classList.remove('open');
    window.scrollTo({top:0,behavior:'smooth'});
  }

  navItems.forEach(item => item.addEventListener('click', () => openView(item.dataset.view)));
  $$('[data-view-link]').forEach(el => el.addEventListener('click', () => openView(el.dataset.viewLink)));
  $('#mobileMenu').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
  $('#collapseSidebar').addEventListener('click', () => {
    const sidebar = $('#sidebar');
    if (window.innerWidth > 800) {
      const collapsed = sidebar.classList.toggle('collapsed');
      sidebar.style.width = collapsed ? '74px' : '';
      $('.main-area').style.marginLeft = collapsed ? '74px' : '';
      $('.main-area').style.width = collapsed ? 'calc(100% - 74px)' : '';
      $$('.sidebar .brand span:last-child,.workspace-switcher>span:not(.workspace-icon),.workspace-switcher svg,.nav-item>span:not(.nav-icon),.nav-label,.secure-badge div,.collapse-btn span').forEach(el => el.style.display = collapsed ? 'none' : '');
      $$('.nav-item').forEach(el => { el.style.justifyContent = collapsed ? 'center' : ''; el.style.paddingLeft = collapsed ? '0' : ''; });
      $('.collapse-btn').innerHTML = collapsed ? '→' : '← <span>Collapse menu</span>';
    }
  });

  function openEditor({title='Homepage hero', description='We build the ground truth beneath big plans.', type='Page section', eyebrow='CONTENT EDITOR', status='Published'}={}){
    $('#modalTitle').textContent = title;
    $('#modalEyebrow').textContent = eyebrow;
    $('#editorTitle').value = title;
    $('#editorDescription').value = description;
    $('#editorType').value = type;
    $('#editorStatus').value = status;
    $('#modalBackdrop').classList.add('open');
    $('#editorTitle').focus();
  }
  function closeEditor(){ $('#modalBackdrop').classList.remove('open'); }
  $('#modalClose').addEventListener('click', closeEditor);
  $('#cancelModal').addEventListener('click', closeEditor);
  $('#modalBackdrop').addEventListener('click', e => { if(e.target === $('#modalBackdrop')) closeEditor(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeEditor(); });

  $$('[data-action]').forEach(el => el.addEventListener('click', () => {
    const action = el.dataset.action;
    if(action === 'edit-home') { window.location.href = 'editor.html?page=home'; return; }
    if(action === 'edit-page') { window.location.href = 'editor.html?page=' + encodeURIComponent((el.dataset.page || 'home').toLowerCase().replace(/\s+/g,'-')); return; }
    if(action === 'new-post') openEditor({title:'New newsroom post',description:'Share a short update from an active site, equipment work, or operation.',type:'Newsroom post',eyebrow:'NEWSROOM / NEW POST',status:'Draft'});
    if(action === 'new-project') openEditor({title:'New project',description:'Add verified project details and a concise delivery summary.',type:'Project',eyebrow:'PROJECTS / NEW PROJECT',status:'Draft'});
    if(action === 'edit-home') openEditor({title:'Homepage hero',description:'We build the ground truth beneath big plans.',type:'Page section',eyebrow:'PAGES / HOME'});
    if(action === 'edit-page') openEditor({title:el.dataset.page || 'Edit page',description:'Update this page content, imagery, and supporting sections.',type:'Page section',eyebrow:'PAGES / EDIT PAGE'});
    if(action === 'edit-project') openEditor({title:el.dataset.project || 'Edit project',description:'A verified project description that explains what was delivered, where, and for whom.',type:'Project',eyebrow:'PROJECTS / EDIT PROJECT'});
    if(action === 'edit-post') openEditor({title:el.dataset.post || 'Edit newsroom post',description:'A short piece on the latest work, people, or operations at Mitsab.',type:'Newsroom post',eyebrow:'NEWSROOM / EDIT POST'});
    if(action === 'save-settings'){ state.settingsSaved = new Date().toISOString(); localStorage.setItem('mitsabAdminState',JSON.stringify(state)); showToast('Workspace settings saved'); }
  }));

  $('#contentForm').addEventListener('submit', e => {
    e.preventDefault();
    const title = $('#editorTitle').value.trim() || 'Untitled content';
    state.lastSaved = {title,description:$('#editorDescription').value,status:$('#editorStatus').value,updated:new Date().toISOString()};
    localStorage.setItem('mitsabAdminState',JSON.stringify(state));
    closeEditor();
    showToast(title + ' saved as ' + state.lastSaved.status.toLowerCase());
  });

  function bindSearch(inputId, rowSelector){
    const input = $('#'+inputId);
    if(!input) return;
    input.addEventListener('input', () => {
      const query = input.value.toLowerCase().trim();
      $$(rowSelector).forEach(row => row.style.display = !query || (row.dataset.search||'').includes(query) ? '' : 'none');
    });
  }
  bindSearch('pageSearch','#pageRows .table-row');
  bindSearch('projectSearch','#projectCards .content-card');
  bindSearch('newsSearch','#newsRows .table-row');
  bindSearch('mediaSearch','#mediaGrid .media-item');

  $('#uploadButton').addEventListener('click', () => $('#mediaUpload').click());
  $('#mediaUpload').addEventListener('change', e => {
    const files = [...e.target.files];
    if(!files.length) return;
    files.forEach((file, index) => {
      const item = document.createElement('div');
      item.className = 'media-item';
      const reader = new FileReader();
      reader.onload = ev => { item.style.backgroundImage = `url(${ev.target.result})`; };
      reader.readAsDataURL(file);
      item.innerHTML = `<button class="media-check">✓</button><div class="media-overlay"><b>${file.name}</b><small>${(file.size/1024/1024).toFixed(1)} MB · Uploaded just now</small></div>`;
      $('#mediaGrid').prepend(item);
    });
    showToast(files.length + (files.length === 1 ? ' image' : ' images') + ' added to the library');
    e.target.value = '';
  });
  document.addEventListener('click', e => {
    if(e.target.matches('.media-check')) e.target.classList.toggle('selected');
    if(e.target.matches('.editor-tabs button')){$$('.editor-tabs button').forEach(b=>b.classList.remove('active'));e.target.classList.add('active');}
    if(e.target.matches('.media-tabs button')){$$('.media-tabs button').forEach(b=>b.classList.remove('active'));e.target.classList.add('active');}
  });
})();
