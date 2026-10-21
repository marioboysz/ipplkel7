Modules.journal={t:'Jurnal & Relaksasi',i:'book',tm:null,
r(el){const M=this,J=Store.d.journal.slice().sort((a,b)=>a.tgl.localeCompare(b.tgl)),E=['','frown','frown','meh','smile','laugh'];
 let streak=0,i=J.find(x=>x.tgl===today())?0:1;for(;;i++){const dt=new Date(Date.now()-i*864e5-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10);if(J.find(x=>x.tgl===dt))streak++;else break}
 const avg=k=>J.length?(J.slice(-7).reduce((a,x)=>a+ +x[k],0)/Math.min(7,J.length)).toFixed(1):'–';
 el.innerHTML=`<div class="grid g2"><div class="card"><h3>Jurnal Harian</h3><form id="f"><div class="row"><label>Tanggal<input type="date" name="tgl" value="${today()}"></label><label>Mood<select name="mood">${[5,4,3,2,1].map(i=>`<option value="${i}">${i} — ${['','Sangat buruk','Buruk','Biasa','Baik','Sangat baik'][i]}</option>`).join('')}</select></label>
 <label>Tidur (jam)<input type="number" step=".5" name="tidur" value="7"></label><label>Air (gelas)<input type="number" name="air" value="8"></label><label>Olahraga (mnt)<input type="number" name="olah" value="30"></label></div><label>Catatan<textarea name="cat" rows="2"></textarea></label><button class="btn">Simpan</button></form></div>
 <div class="card"><h3>${ic('wind')} Latihan Napas (Box Breathing)</h3><div class="circle" id="ci">Siap</div><div style="text-align:center"><button class="btn" id="bs">Mulai</button></div></div></div>
 <div class="grid"><div class="card"><h3>${ic('flame')} Streak</h3><div class="big">${streak} hari</div></div><div class="card"><h3>Rata-rata tidur</h3><div class="big">${avg('tidur')} jam</div></div><div class="card"><h3>Rata-rata mood</h3><div class="big">${avg('mood')}/5</div></div></div>
 <div class="card"><h3>Grafik 14 Hari</h3><canvas id="cv"></canvas></div>
 <div class="card"><h3>Riwayat</h3>${J.slice().reverse().slice(0,20).map(x=>`<div class="item"><div><b>${fmtD(x.tgl)}</b> ${ic(E[x.mood])} • ${ic('moon')} ${x.tidur}j • ${ic('droplet')} ${x.air} • ${ic('activity')} ${x.olah}m<div class="mut">${esc(x.cat)}</div></div><button class="x" data-d="${x.id}">${ic('x',16)}</button></div>`).join('')||'<p class="mut">Kosong</p>'}</div>`;
 $('#f',el).onsubmit=e=>{e.preventDefault();const f=fd(e.target);Store.d.journal=Store.d.journal.filter(x=>x.tgl!==f.tgl);Store.add('journal',f);toast('Jurnal tersimpan');M.r(el)};
 $$('[data-d]',el).forEach(b=>b.onclick=()=>{Store.del('journal',b.dataset.d);M.r(el)});
 const s=J.slice(-14);lineChart($('#cv',el),[{label:'Tidur',color:'#6366f1',data:s.map(x=>({x:ts(x.tgl),y:+x.tidur}))},{label:'Mood',color:'#f59e0b',data:s.map(x=>({x:ts(x.tgl),y:+x.mood}))},{label:'Air',color:'#0284c7',data:s.map(x=>({x:ts(x.tgl),y:+x.air}))}]);
 const ci=$('#ci',el),ph=[['Tarik napas',1],['Tahan',1],['Buang napas',0],['Tahan',0]];let pi=0;clearInterval(M.tm);
 $('#bs',el).onclick=e=>{if(M.tm){clearInterval(M.tm);M.tm=null;e.target.textContent='Mulai';ci.textContent='Siap';ci.classList.remove('big');return}
  e.target.textContent='Berhenti';const st=()=>{const[t,b]=ph[pi++%4];ci.textContent=t;ci.classList.toggle('big',!!b)};st();M.tm=setInterval(st,4000)}}};
