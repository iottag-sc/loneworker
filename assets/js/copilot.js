(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

// Personal links: report walkthrough email clicks against the invitation stored by main.js.
let ref=null;
try{const s=JSON.parse(localStorage.getItem('lw-ref')||'null');if(s&&s.exp>Date.now())ref=s.ref;}catch(e){}
if(ref)$$('a[href^="mailto:"]').forEach(a=>a.addEventListener('click',()=>{new Image().src='https://links.iottag.com.au/api/hit?'+new URLSearchParams({ref,event:'contact_click',detail:a.textContent.trim()});}));

// Waveforms: level 0 calm, 1 rising, 2 alert
$$('.wave').forEach(w=>{const lv=+w.dataset.level||0;for(let i=0;i<18;i++){const b=document.createElement('i'),t=i/17,r=.55+.45*Math.abs(Math.sin(i*1.7+lv));const h=lv===0?.14+.16*r:lv===1?.22+.5*t*r+.08:.25+.7*t*(.7+.3*r);b.style.setProperty('--h',Math.min(1,h).toFixed(2));b.style.animationDelay=(i%5)*.12+'s';if(lv>0&&i>12)b.className='hot';w.append(b);}});

// Reveal on scroll
const io=new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');o.unobserve(e.target);}}),{threshold:.2,rootMargin:'0px 0px -6% 0px'});
$$('.rv,.deck').forEach(el=>io.observe(el));

// Scroll story: the phone follows the step in the middle of the screen
const steps=$$('.step'),phone=$('#phone'),segs=$$('.progress i'),label=$('#state-label');
if(steps.length&&phone){
 const set=i=>{phone.dataset.state=i;steps.forEach((s,j)=>s.classList.toggle('is-active',j===i));segs.forEach((s,j)=>s.classList.toggle('on',j<=i));label.textContent='Step '+(i+1)+' of '+steps.length+' · '+steps[i].dataset.label;};
 const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)set(steps.indexOf(e.target));}),{rootMargin:'-45% 0px -45% 0px'});
 steps.forEach(s=>so.observe(s));set(0);
}

// Feature explorer: search + filter chips
const cards=$$('.fcard'),chips=$$('.chip'),q=$('#fq'),count=$('#fcount'),empty=$('#fempty');
if(q){let cat='all';
 const apply=()=>{const t=q.value.trim().toLowerCase();let n=0;cards.forEach(c=>{const ok=(cat==='all'||c.dataset.cat.split(' ').includes(cat))&&(!t||c.textContent.toLowerCase().includes(t));c.hidden=!ok;if(ok)n++;});count.textContent=n+(n===1?' feature':' features');empty.hidden=n>0;};
 chips.forEach(ch=>ch.addEventListener('click',()=>{cat=ch.dataset.cat;chips.forEach(c=>c.setAttribute('aria-pressed',String(c===ch)));apply();}));
 q.addEventListener('input',apply);
}

if(!reduced){
 // Card spotlight follows the cursor
 cards.forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--x',e.clientX-r.left+'px');c.style.setProperty('--y',e.clientY-r.top+'px');}));
 // Magnetic buttons
 $$('.magnetic').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*.3).toFixed(1)+'px)';});b.addEventListener('pointerleave',()=>{b.style.transform='';});});
}
})();
