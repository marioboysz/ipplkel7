Modules.vitals={t:'Tanda Vital',i:'heart',tab:'bp',
r(el){const M=this,d=Store.d;
 el.innerHTML=`<div class="card"><h3>Catat Tanda Vital</h3><form id="f"><div class="row">
 <label>Tanggal<input type="date" name="date" value="${today()}" required></label><label>Jam<input type="time" name="time" value="${nowT()}"></label>
 <label>Sistolik<input type="number" name="sys" placeholder="120"></label><label>Diastolik<input type="number" name="dia" placeholder="80"></label>
 <label>Gula darah (mg/dL)<input type="number" name="glu"></label><label>Kondisi gula<select name="gctx"><option value="puasa">Puasa</option><option value="sesudah">Setelah makan</option></select></label>
 <label>Detak (bpm)<input type="number" name="hr"></label><label>Suhu (°C)<input type="number" step=".1" name="temp"></label>
 <label>SpO₂ (%)<input type="number" name="spo2"></label><label>Berat (kg)<input type="number" step=".1" name="bb"></label></div>
 <label>Catatan<input name="note"></label><button class="btn">Simpan</button></form></div>
 <div class="card"><div class="tabs">${[['bp','Tekanan Darah'],['glu','Gula Darah'],['hr','Detak'],['temp','Suhu'],['spo2','SpO₂'],['bb','Berat']].map(([k,l])=>`<button class="btn alt ${M.tab===k?'on':''}" data-t="${k}">${l}</button>`).join('')}</div><canvas id="cv"></canvas></div>
 <div class="card"><h3>Riwayat</h3><div style="overflow:auto"><table><tr><th>Waktu</th><th>Hasil</th><th>Status</th><th></th></tr>${[...d.vitals].reverse().slice(0,40).map(v=>`<tr><td>${fmtD(v.date)} ${v.time||''}</td><td>${M.fmt(v)}</td><td>${M.stat(v)}</td><td><button class="x" data-d="${v.id}">${ic('x',16)}</button></td></tr>`).join('')||'<tr><td colspan=4 class="mut">Belum ada data</td></tr>'}</table></div></div>`;
 $('#f',el).onsubmit=e=>{e.preventDefault();const f=fd(e.target),o={date:f.date,time:f.time,gctx:f.gctx,note:f.note};
  ['sys','dia','glu','hr','temp','spo2','bb'].forEach(k=>{const v=num(f[k]);if(v!==undefined)o[k]=v});
  if(Object.keys(o).length<5)return toast('Isi minimal satu pengukuran');
  if(o.glu===undefined)delete o.gctx;
  Store.add('vitals',o);Store.d.vitals.sort((a,b)=>ts(a.date,a.time)-ts(b.date,b.time));
  if(o.bb){Store.d.profile.berat=o.bb}Store.save();
  const st=M.stat(o,true);toast(st.length?''+st.join(', '):'Tersimpan, semua dalam batas normal');M.r(el)};
 $$('[data-t]',el).forEach(b=>b.onclick=()=>{M.tab=b.dataset.t;M.r(el)});
 $$('[data-d]',el).forEach(b=>b.onclick=()=>{Store.del('vitals',b.dataset.d);M.r(el)});
 const T={bp:[['sys','Sistolik','#dc2626'],['dia','Diastolik','#0d9488']],glu:[['glu','Gula','#d97706']],hr:[['hr','Detak','#e11d48']],temp:[['temp','Suhu','#f97316']],spo2:[['spo2','SpO₂','#0284c7']],bb:[['bb','Berat','#6366f1']]}[M.tab];
 lineChart($('#cv',el),T.map(([k,l,c])=>({label:l,color:c,data:d.vitals.filter(v=>v[k]!==undefined).slice(-30).map(v=>({x:ts(v.date,v.time),y:v[k]}))})))},
fmt(v){const a=[];if(v.sys)a.push(`TD ${v.sys}/${v.dia||'?'}`);if(v.glu)a.push(`Gula ${v.glu}`);if(v.hr)a.push(`HR ${v.hr}`);if(v.temp)a.push(`${v.temp}°C`);if(v.spo2)a.push(`SpO₂ ${v.spo2}%`);if(v.bb)a.push(`${v.bb} kg`);return a.join(' • ')},
stat(v,raw){const r=[];if(v.sys&&v.dia)r.push(Health.bp(v.sys,v.dia));if(v.glu)r.push(Health.glu(v.glu,v.gctx));if(v.hr)r.push(Health.hr(v.hr));if(v.temp)r.push(Health.temp(v.temp));if(v.spo2)r.push(Health.spo2(v.spo2));
 if(raw)return r.filter(x=>x.c!=='ok').map(x=>x.l);return r.map(badge).join(' ')}};
