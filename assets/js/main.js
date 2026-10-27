(()=>{'use strict';
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const video=document.getElementById('worker-video'),cover=document.getElementById('video-cover');
 // Personal links (?ref=<token> from the links admin): keep the token 30 days and report key actions as a pixel.
 const LINKS='https://links.iottag.com.au',REF_KEY='lw-ref';
 let ref=null;
 try{const q=new URLSearchParams(location.search).get('ref');if(q&&/^[A-Za-z0-9_-]{6,64}$/.test(q)){ref=q;const u=new URL(location.href);u.searchParams.delete('ref');history.replaceState(null,'',u.pathname+u.search+u.hash);localStorage.setItem(REF_KEY,JSON.stringify({ref:q,exp:Date.now()+30*864e5}));}else{const s=JSON.parse(localStorage.getItem(REF_KEY)||'null');if(s&&s.exp>Date.now())ref=s.ref;else localStorage.removeItem(REF_KEY);}}catch(e){}
 function track(event,detail){if(!ref)return;const p=new URLSearchParams({ref,event});if(detail)p.set('detail',String(detail).replace(/\s+/g,' ').trim().slice(0,200));new Image().src=LINKS+'/api/hit?'+p;}
 track('open');
 document.querySelectorAll('a[href="#contact"]').forEach(a=>a.addEventListener('click',()=>track('book_meeting',a.textContent)));
 document.querySelectorAll('a[href^="mailto:"],a[href^="tel:"]').forEach(a=>a.addEventListener('click',()=>{const ticked=[...document.querySelectorAll('input[name=alarm-type]:checked')].map(i=>i.value).join(', ');track('contact_click',ticked||a.textContent);}));
 let autoMuted=false,heard=false;
 // Count the video only once it plays with sound; the muted autoplay is not a view.
 const listen=()=>{if(!heard&&!video.muted&&!video.paused){heard=true;track('video_play');}};
 function playVideo(){document.getElementById('video').scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'center'});cover.hidden=true;if(autoMuted){autoMuted=false;video.muted=false;video.currentTime=0;}video.focus();const promise=video.play();if(promise&&promise.catch)promise.catch(()=>{video.controls=true;});}
 document.getElementById('watch-video').addEventListener('click',playVideo);cover.addEventListener('click',playVideo);
 video.addEventListener('play',()=>{cover.hidden=true;listen();});video.addEventListener('ended',()=>{cover.hidden=false;if(heard)track('video_complete');});video.addEventListener('volumechange',()=>{if(!video.muted)autoMuted=false;listen();});
 // Browsers only allow autoplay without sound; skip it for reduced-motion users.
 if(!reduced.matches){autoMuted=true;video.muted=true;const auto=video.play();if(auto&&auto.catch)auto.catch(()=>{autoMuted=false;video.muted=false;});}
 const root=document.getElementById('system-tour'),tabs=[...root.querySelectorAll('[role=tab]')],panels=[...root.querySelectorAll('[role=tabpanel]')];
 let current=0,timer=null;
 function select(index,focus=false){current=(index+tabs.length)%tabs.length;tabs.forEach((tab,i)=>{const on=i===current;tab.setAttribute('aria-selected',String(on));tab.tabIndex=on?0:-1;panels[i].hidden=!on;panels[i].classList.toggle('active',on);});if(focus)tabs[current].focus();}
 function stopTour(){if(timer!==null){clearInterval(timer);timer=null;}}
 function startTour(){if(timer!==null||document.hidden)return;timer=setInterval(()=>select(current+1),4800);}
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>{select(i);stopTour();startTour();track('tab_view',tab.innerText);});tab.addEventListener('keydown',e=>{let n=null;if(e.key==='ArrowRight')n=i+1;if(e.key==='ArrowLeft')n=i-1;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==null){e.preventDefault();select(n,true);stopTour();startTour();}});});
 if('IntersectionObserver' in window){new IntersectionObserver(entries=>{const visible=entries[0].isIntersecting;if(visible){startTour();}else{stopTour();}},{threshold:.32}).observe(root);}else{startTour();}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stopTour();});
 // Personal alarm types slider: tabs and arrows switch between the three alarm slides.
 const alarms=document.getElementById('alarm-types');
 if(alarms){const slides=[...alarms.querySelectorAll('.al-slide')],alTabs=[...alarms.querySelectorAll('[role=tab]')],counter=alarms.querySelector('.al-counter');let shown=0;
  const pad=n=>String(n).padStart(2,'0');
  function show(index,focus=false){shown=(index+slides.length)%slides.length;slides.forEach((s,i)=>{const on=i===shown;s.classList.toggle('is-active',on);s.setAttribute('aria-hidden',String(!on));});alTabs.forEach((t,i)=>{const on=i===shown;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;});counter.textContent=pad(shown+1)+' / '+pad(slides.length);if(focus)alTabs[shown].focus();}
  alarms.querySelector('.al-prev').addEventListener('click',()=>show(shown-1));alarms.querySelector('.al-next').addEventListener('click',()=>show(shown+1));
  alTabs.forEach((tab,i)=>{tab.addEventListener('click',()=>show(i));tab.addEventListener('keydown',e=>{let n=null;if(e.key==='ArrowRight')n=i+1;if(e.key==='ArrowLeft')n=i-1;if(e.key==='Home')n=0;if(e.key==='End')n=alTabs.length-1;if(n!==null){e.preventDefault();show(n,true);}});});}
})();
