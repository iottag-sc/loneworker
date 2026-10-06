(()=>{'use strict';
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const video=document.getElementById('worker-video'),cover=document.getElementById('video-cover');
 function playVideo(){document.getElementById('video').scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'center'});cover.hidden=true;video.focus();const promise=video.play();if(promise&&promise.catch)promise.catch(()=>{video.controls=true;});}
 document.getElementById('watch-video').addEventListener('click',playVideo);cover.addEventListener('click',playVideo);
 video.addEventListener('play',()=>{cover.hidden=true;});video.addEventListener('ended',()=>{cover.hidden=false;});
 const root=document.getElementById('system-tour'),tabs=[...root.querySelectorAll('[role=tab]')],panels=[...root.querySelectorAll('[role=tabpanel]')];
 let current=0,timer=null;
 function select(index,focus=false){current=(index+tabs.length)%tabs.length;tabs.forEach((tab,i)=>{const on=i===current;tab.setAttribute('aria-selected',String(on));tab.tabIndex=on?0:-1;panels[i].hidden=!on;panels[i].classList.toggle('active',on);});if(focus)tabs[current].focus();}
 function stopTour(){if(timer!==null){clearInterval(timer);timer=null;}}
 function startTour(){if(timer!==null||document.hidden)return;timer=setInterval(()=>select(current+1),4800);}
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>{select(i);stopTour();startTour();});tab.addEventListener('keydown',e=>{let n=null;if(e.key==='ArrowRight')n=i+1;if(e.key==='ArrowLeft')n=i-1;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==null){e.preventDefault();select(n,true);stopTour();startTour();}});});
 if('IntersectionObserver' in window){new IntersectionObserver(entries=>{const visible=entries[0].isIntersecting;if(visible){startTour();}else{stopTour();}},{threshold:.32}).observe(root);}else{startTour();}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stopTour();});
})();
