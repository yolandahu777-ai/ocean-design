(() => {
  const content=window.portfolioContent;
  const projects=content.projects;
  const $=s=>document.querySelector(s);
  const dialogs=[...document.querySelectorAll('dialog')];
  const workProjects=projects.filter(p=>p.section!=='playground');
  const playProjects=projects.filter(p=>p.section==='playground');
  let activeProject=null;
  let returnFocus=null;
  const element=(tag,className,text)=>{const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;};
  function appendChinese(parent,text,className='translation-zh'){if(!text)return;const translation=element('span',className,text);translation.lang='zh-CN';parent.append(translation);}
  function setBilingualText(target,english,chinese){target.textContent=english||'';appendChinese(target,chinese);}
  function setProfileText(target,english,chinese){
    target.replaceChildren();
    const primary=element('span','profile-primary',chinese||english||'');primary.lang=chinese?'zh-CN':'en';target.append(primary);
    if(english&&chinese&&english!==chinese){const secondary=element('span','profile-secondary',english);secondary.lang='en';target.append(secondary);}
  }
  function profileParagraph(copy,className='resume-copy'){
    const block=element('div',className);
    if(copy.logo)block.append(profileLogo(copy.logo,'resume-point-logo'));
    if(copy.zh){const zh=element('p','profile-primary',copy.zh);zh.lang='zh-CN';block.append(zh);}
    if(copy.en&&copy.en!==copy.zh){const en=element('p',copy.zh?'profile-secondary':'profile-primary',copy.en);en.lang='en';block.append(en);}
    return block;
  }
  function profileLogo(logo,className='resume-logo'){
    const frame=element('span',`${className} logo-${logo.variant||'brand'}`);frame.setAttribute('aria-hidden','true');
    const img=element('img');img.src=logo.src;img.alt='';img.width=56;img.height=56;img.decoding='async';
    frame.append(img);return frame;
  }
  function profileHeading(english,chinese,logo,note){
    const identity=element('div','resume-identity'+(note?' has-company-note':''));const title=element('h4');setProfileText(title,english,chinese);
    const copy=element('div','resume-identity-copy');copy.append(title);if(note)copy.append(profileParagraph(note,'resume-company-note'));
    if(logo)identity.append(profileLogo(logo));identity.append(copy);return identity;
  }
  function renderProfile(){
    const profile=content.profile;
    setBilingualText($('#about-title'),profile.designer,profile.nameZh);
    setProfileText($('#profile-location'),profile.location.en,profile.location.zh);
    setProfileText($('#profile-role'),profile.role.en,profile.role.zh);
    $('#profile-summary').replaceChildren(profileParagraph(profile.summary,'profile-summary-copy'));
    const contacts=$('#profile-contacts');contacts.replaceChildren();
    [{label:'Email',labelZh:'邮箱',value:profile.contacts.email,href:`mailto:${profile.contacts.email}`},{label:'Phone',labelZh:'电话',value:profile.contacts.phone,href:`tel:${profile.contacts.phone}`}].forEach(contact=>{
      const link=element('a','profile-contact');link.href=contact.href;
      const label=element('span','profile-contact-label');const zh=element('span','profile-primary',contact.labelZh);zh.lang='zh-CN';const en=element('span','profile-secondary',contact.label);en.lang='en';label.append(zh,document.createTextNode(' / '),en);
      link.append(label,element('span','profile-contact-value',contact.value));contacts.append(link);
    });
    $('#profile-experience').replaceChildren(...profile.experience.map(job=>{
      const entry=element('article','resume-entry');const header=element('header','resume-entry-heading');const title=profileHeading(job.company,job.companyZh,job.logo,job.companyNote);
      const period=element('p','resume-period');setProfileText(period,job.period,job.periodZh);
      header.append(title,period);const role=element('p','resume-role');setProfileText(role,job.role,job.roleZh);
      const points=element('ul','resume-points');job.points.forEach(point=>{const li=element('li');li.append(profileParagraph(point));points.append(li);});
      entry.append(header,role,points);return entry;
    }));
    $('#profile-education').replaceChildren(...profile.education.map(education=>{
      const entry=element('article','resume-entry education-entry');const header=element('header','resume-entry-heading');const title=profileHeading(education.school,education.schoolZh,education.logo);const period=element('p','resume-period');setProfileText(period,education.period,education.periodZh);header.append(title,period);
      const course=element('p','resume-role');setProfileText(course,education.course,education.courseZh);entry.append(header,course);
      if(education.note||education.noteZh){const note=element('p','education-note');setProfileText(note,education.note,education.noteZh);entry.append(note);}return entry;
    }));
    $('#profile-skills').replaceChildren(...profile.skills.map(skill=>{
      const li=element('li','profile-skill');const title=element('h4','profile-skill-title');setProfileText(title,skill.title,skill.titleZh);
      li.append(title,profileParagraph(skill.description,'resume-copy skill-description'));
      if(skill.details?.length){const details=element('ul','skill-details');skill.details.forEach(detail=>{const item=element('li');item.append(profileParagraph(detail));details.append(item);});li.append(details);}
      return li;
    }));
    $('#profile-tools').textContent=profile.tools.join(' · ');
    $('#profile-additional').replaceChildren(...profile.additional.map(item=>{const li=element('li');li.append(profileParagraph(item));return li;}));
  }
  function setHeadline(lines,chinese=content.profile.headlineZh){$('.intro h1').replaceChildren();lines.forEach((line,i)=>{if(i)$('.intro h1').append(document.createElement('br'));$('.intro h1').append(document.createTextNode(line));});$('#intro-headline-zh').textContent=chinese||'';}
  function createCard(project,index,hero=false){
    const item=element('div','gallery-item');
    const button=element('button','project-card'+(hero?' card-hero':' case-card'));
    button.dataset.project=project.id;button.setAttribute('aria-label',`View ${project.name} project`);
    button.style.background=project.coverBackground||'#e8e8e4';
    const board=element('span','cover-artboard'+(project.cover.length>1?' cover-pair':''));
    project.cover.forEach((source,i)=>{
      const img=element('img');img.src=source;img.alt=`${project.name} — ${project.category}${project.cover.length>1?`, view ${i+1}`:''}`;
      img.loading=hero?'eager':'lazy';img.decoding='async';
      if(hero)img.fetchPriority='high';
      img.style.objectFit=project.cover.length>1?'contain':(project.coverFit||'contain');img.style.objectPosition=project.coverPosition||'center';
      board.append(img);
    });
    button.append(board);
    if(project.series)button.append(element('span','series-badge',project.series));
    if(project.layout==='film'){const badge=element('span','film-badge',`▶ AI FILM · ${project.duration}`);badge.setAttribute('aria-hidden','true');button.append(badge);}
    const action=element('span','project-action',project.layout==='film'?'Watch film ':'View project ');const plus=element('span',null,'+');plus.setAttribute('aria-hidden','true');action.append(plus);button.append(action);
    const meta=element('div','project-meta');const category=element('span','project-category',project.category);appendChinese(category,project.categoryZh);
    const name=element('span',null,`${String(index+1).padStart(2,'0')} / ${project.name}`);appendChinese(name,project.nameZh);
    if(project.date){const date=element('time','project-date',project.year);date.dateTime=project.date;name.append(date);}
    meta.append(name,category);
    item.append(button,meta);return item;
  }
  function renderGallery(){
    const gallery=$('#work-gallery');gallery.replaceChildren();
    const collaborations=workProjects.filter(p=>p.series==='IP COLLABORATION');
    if(collaborations.length){
      const series=element('section','ip-series');series.setAttribute('aria-labelledby','ip-series-title');
      const heading=element('h2','series-heading','IP Collaborations · 2024—2025');heading.id='ip-series-title';
      const seriesGrid=element('div','ip-series-grid');collaborations.forEach((p,i)=>seriesGrid.append(createCard(p,workProjects.indexOf(p),i===0)));
      series.append(heading,seriesGrid);gallery.append(series);
    }
    const remaining=workProjects.filter(p=>!collaborations.includes(p));
    const grid=element('div','case-grid');remaining.forEach(p=>grid.append(createCard(p,workProjects.indexOf(p))));gallery.append(grid);
    $('#playground-projects').replaceChildren(...playProjects.map((p,i)=>createCard(p,i)));
    $('[data-work-count]').textContent=String(workProjects.length).padStart(2,'0');
  }
  function openDialog(dialog){returnFocus=document.activeElement;dialog.showModal();document.body.classList.add('modal-open');dialog.scrollTop=0;dialog.querySelector('[data-close]').focus();}
  function nextProject(){const group=projects.filter(p=>p.section===activeProject.section);return group[(group.findIndex(p=>p.id===activeProject.id)+1)%group.length];}
  function pauseMedia(){document.querySelectorAll('#project-dialog video').forEach(video=>video.pause());}
  function createMedia(item,index){
    const figure=element('figure','detail-figure');
    if(item.type==='video'){
      const video=element('video','detail-video');
      video.src=item.src;video.poster=item.poster||'';video.controls=true;video.playsInline=true;video.preload='none';
      video.setAttribute('aria-label',item.alt);video.muted=item.muted!==false;
      if(item.width)video.width=item.width;if(item.height)video.height=item.height;
      video.append(document.createTextNode('Your browser does not support embedded video. '));
      const fallback=element('a',null,'Open the film');fallback.href=item.src;video.append(fallback);
      video.addEventListener('play',()=>document.querySelectorAll('#project-dialog video').forEach(other=>{if(other!==video)other.pause();}));
      figure.append(video);
    }else{
      const img=element('img','detail-image');img.src=item.src;img.alt=item.alt;img.loading=index?'lazy':'eager';img.decoding='async';figure.append(img);
    }
    if(item.caption){const caption=element('figcaption',null,item.caption);appendChinese(caption,item.captionZh);figure.append(caption);}return figure;
  }
  function createMediaGrid(items,layout){
    const grid=element('div','detail-media-grid'+(['pair','quad','portrait'].includes(layout)?` media-${layout}`:''));
    grid.append(...items.map(createMedia));return grid;
  }
  function createMetrics(metrics){
    const list=element('dl','case-metrics');
    metrics.forEach(metric=>{
      const item=element('div','case-metric');const label=element('dt');setBilingualText(label,metric.label,metric.labelZh);
      const value=element('dd',null,metric.value);appendChinese(value,metric.valueZh,'metric-value-zh');
      item.append(label,value);list.append(item);
    });
    return list;
  }
  function createIntroduction(introduction){
    const section=element('section','project-introduction'+(!introduction.title?' project-introduction-compact':''));section.setAttribute('aria-labelledby','project-concept-title');
    const heading=element('header','project-introduction-heading');
    const label=element(introduction.title?'p':'h3','small-heading',`${introduction.label||'BRAND CONCEPT'} / `);const labelZh=element('span',null,introduction.labelZh||'品牌理念');labelZh.lang='zh-CN';label.append(labelZh);heading.append(label);
    if(introduction.title){const title=element('h3',null,introduction.title);title.id='project-concept-title';appendChinese(title,introduction.titleZh);heading.append(title);}
    else label.id='project-concept-title';
    const columns=element('div','project-introduction-columns');
    [{key:'en',lang:'en',label:'ENGLISH'},{key:'zh',lang:'zh-CN',label:'中文'}].forEach(language=>{
      const column=element('div','project-introduction-copy');column.lang=language.lang;
      column.append(element('p','language-label',language.label));
      introduction.paragraphs.forEach(paragraph=>column.append(element('p',null,paragraph[language.key])));
      columns.append(column);
    });
    section.append(heading,columns);
    if(introduction.tagline){
      const tagline=element('div','project-introduction-tagline');
      const en=element('p',null,introduction.tagline.en);en.lang='en';
      const zh=element('p',null,introduction.tagline.zh);zh.lang='zh-CN';tagline.append(en,zh);section.append(tagline);
    }
    return section;
  }
  function createCaseStudy(paragraphs){
    const section=element('section','case-study');section.setAttribute('aria-label','Project story / 项目介绍');
    paragraphs.forEach((paragraph,index)=>{
      const row=element('section','case-study-row');const heading=element('h3','case-study-label',`${String(index+1).padStart(2,'0')} / ${paragraph.title}`);
      heading.id=`case-story-${index}`;appendChinese(heading,paragraph.titleZh);row.setAttribute('aria-labelledby',heading.id);
      const columns=element('div','case-study-columns');
      [{key:'en',lang:'en'},{key:'zh',lang:'zh-CN'}].forEach(language=>{
        const copy=element('p','case-study-copy');copy.lang=language.lang;
        const text=paragraph[language.key];const highlights=paragraph.highlights?.[language.key]||[];let position=0;
        while(position<text.length){
          const match=highlights.map(value=>({value,index:text.indexOf(value,position)})).filter(item=>item.value&&item.index>=0).sort((a,b)=>a.index-b.index)[0];
          if(!match){copy.append(document.createTextNode(text.slice(position)));break;}
          copy.append(document.createTextNode(text.slice(position,match.index)),element('strong',null,match.value));position=match.index+match.value.length;
        }
        columns.append(copy);
      });
      row.append(heading,columns);section.append(row);
    });
    return section;
  }
  function showProject(id){
    const p=projects.find(p=>p.id===id);if(!p)return;pauseMedia();activeProject=p;
    $('#detail-title').textContent=p.name;appendChinese($('#detail-title'),p.nameZh,'detail-title-zh');$('#detail-subtitle').textContent=p.subtitle;appendChinese($('#detail-subtitle'),p.subtitleZh,'detail-subtitle-zh');
    const introduction=p.caseStudy?null:(p.introduction||(p.descriptionZh?{label:'PROJECT OVERVIEW',labelZh:'项目介绍',paragraphs:[{en:p.description,zh:p.descriptionZh}]}:null));
    $('.detail-info').classList.toggle('has-project-introduction',Boolean(introduction||p.caseStudy));
    $('#project-dialog').classList.toggle('has-case-study',Boolean(p.caseStudy));
    const media=$('#detail-images');media.replaceChildren();const opening=createMediaGrid(p.images,p.imageLayout);
    if(p.caseStudy)media.append(createCaseStudy(p.caseStudy));
    if(p.layout==='film'){
      const lead=element('div','film-lead');lead.append(opening);if(introduction)lead.append(createIntroduction(introduction));media.append(lead);
    }else{media.append(opening);if(introduction)media.append(createIntroduction(introduction));}
    (p.sections||[]).forEach((section,index)=>{
      const block=element('section','case-section');const heading=element('div','case-section-heading');
      const title=element('h3',null,section.title);title.id=`case-section-${index}`;appendChinese(title,section.titleZh);block.setAttribute('aria-labelledby',title.id);heading.append(title);
      if(section.description){const description=element('p',null,section.description);appendChinese(description,section.descriptionZh);heading.append(description);}
      block.append(heading);
      if(section.metrics?.length)block.append(createMetrics(section.metrics));
      if(section.items?.length)block.append(createMediaGrid(section.items,section.layout));
      if(section.note){const note=element('p','case-note');setBilingualText(note,section.note,section.noteZh);block.append(note);}
      media.append(block);
    });
    $('#detail-description').textContent=p.description;setBilingualText($('#detail-discipline'),p.discipline,p.disciplineZh);setBilingualText($('#detail-client'),p.client||'Personal work',p.clientZh);
    $('#detail-year-row').hidden=!p.year;$('#detail-year').textContent=p.year||'';
    $('#detail-tool-row').hidden=!p.tool;$('#detail-tool').textContent=p.tool||'';
    $('#next-title').textContent=nextProject().name;
    if(!$('#project-dialog').open)openDialog($('#project-dialog'));
    else {$('#project-dialog').scrollTo({top:0,behavior:'instant'});$('#project-dialog [data-close]').focus({preventScroll:true});}
  }
  function setView(view){
    const play=view==='playground';
    document.querySelectorAll('[data-view]').forEach(t=>{const selected=t.dataset.view===view;t.classList.toggle('active',selected);t.setAttribute('aria-pressed',String(selected));});
    $('#work-gallery').hidden=play;$('#playground-gallery').hidden=!play;
    setHeadline(play?['Images & ideas.','Room to explore.']:content.profile.headline,play?'图像与灵感，自由探索。':content.profile.headlineZh);
    $('.edition').replaceChildren(document.createTextNode(play?'PLAYGROUND':'SELECTED WORK'),document.createElement('br'),document.createTextNode(play?'BRAND / IMAGE STUDIES':content.profile.designer.toUpperCase()));
    window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }
  document.addEventListener('click',e=>{
    const project=e.target.closest('[data-project]');if(project){showProject(project.dataset.project);return;}
    const about=e.target.closest('[data-about]');if(about){openDialog($('#about-dialog'));return;}
    const view=e.target.closest('[data-view]');if(view){setView(view.dataset.view);return;}
    const close=e.target.closest('[data-close]');if(close)close.closest('dialog').close();
  });
  $('#next-project').addEventListener('click',()=>{if(activeProject)showProject(nextProject().id);});
  dialogs.forEach(dialog=>{
    dialog.addEventListener('close',()=>{if(dialog.id==='project-dialog')pauseMedia();if(!dialogs.some(d=>d.open)){document.body.classList.remove('modal-open');returnFocus?.focus({preventScroll:true});}});
    dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
  });
  $('.wordmark').addEventListener('click',e=>{e.preventDefault();setView('work');});
  $('#back-top').addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
  $('#intro-expertise-en').textContent=content.profile.expertise;
  $('#intro-expertise-zh').textContent=content.profile.expertiseZh;
  renderProfile();
  $('[data-year]').textContent=String(new Date().getFullYear());
  renderGallery();setHeadline(content.profile.headline);
})();
