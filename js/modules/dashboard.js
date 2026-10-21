const Modules={};
const TIPS=['Minum air putih minimal 8 gelas per hari.','Tidur 7–9 jam membantu pemulihan tubuh dan imun.','Jalan kaki 30 menit sehari menurunkan risiko penyakit jantung.','Kurangi garam: batas wajar < 5 gram (1 sdt) per hari.','Cuci tangan 20 detik dengan sabun mencegah banyak infeksi.','Cek tekanan darah rutin, terutama jika usia > 40 tahun.','Batasi gula tambahan, maksimal sekitar 4 sdm per hari.','Tarik napas dalam 5 menit dapat menurunkan stres.','Makan sayur & buah minimal 5 porsi per hari.','Jangan abaikan imunisasi dan medical check-up tahunan.'];
Modules.dashboard={t:'Dashboard',i:'home',r(el){
  const d=Store.d,p=d.profile,bmi=Health.calcBmi(p),bb=Health.bmi(bmi),sc=Health.score();
  const bp=Health.last('sys'),gl=Health.last('glu'),hr=Health.last('hr'),ad=Modules.meds.adh();
  const col=sc>=75?'var(--ok)':sc>=50?'var(--warn)':'var(--bad)';
  const al=[];
  if(bp&&Health.bp(bp.sys,bp.dia).c==='bad')al.push(['bad',`Tekanan darah terakhir ${bp.sys}/${bp.dia} tergolong ${Health.bp(bp.sys,bp.dia).l}. Konsultasikan dengan dokter.`]);
  if(gl&&Health.glu(gl.glu,gl.gctx).c==='bad')al.push(['bad',`Gula darah terakhir ${gl.glu} mg/dL: ${Health.glu(gl.glu,gl.gctx).l}.`]);
  d.meds.filter(m=>m.stok!==''&&m.stok!==undefined&&+m.stok<=5).forEach(m=>al.push(['warn',`Stok obat ${esc(m.nama)} tinggal ${m.stok}. Segera isi ulang.`]));
  d.appts.filter(a=>!a.selesai&&daysTo(a.tgl)>=0&&daysTo(a.tgl)<=1).forEach(a=>al.push(['info',`Janji dengan ${esc(a.dokter)} ${daysTo(a.tgl)?'besok':'HARI INI'} pukul ${a.jam}.`]));
  if(!d.vitals.length)al.push(['info','Mulai catat tanda vital Anda di menu "Tanda Vital" untuk mendapat analisis otomatis.']);
  const next=d.appts.filter(a=>!a.selesai&&daysTo(a.tgl)>=0).sort((a,b)=>(a.tgl+a.jam).localeCompare(b.tgl+b.jam))[0];
  el.innerHTML=`
  <div class="card"><h3>Halo${p.nama?', '+esc(p.nama):''} ${ic('hand')}</h3><div class="mut">${ic('bulb')} ${TIPS[new Date().getDate()%TIPS.length]}</div></div>
  ${al.map(a=>`<div class="alert ${a[0]}">${a[1]}</div>`).join('')}
  <div class="grid">
   <div class="card" style="text-align:center"><h3>Skor Kesehatan</h3><div class="ring" style="background:conic-gradient(${col} ${sc*3.6}deg,var(--bd) 0)"><b>${sc}</b></div><div class="mut" style="margin-top:8px">dari 100</div></div>
   <div class="card"><h3>BMI</h3><div class="big">${bmi.toFixed(1)}</div>${badge(bb)}<div class="mut">${p.berat} kg / ${p.tinggi} cm</div></div>
   <div class="card"><h3>Tekanan Darah</h3><div class="big">${bp?bp.sys+'/'+bp.dia:'–'}</div>${bp?badge(Health.bp(bp.sys,bp.dia)):''}<div class="mut">${bp?fmtD(bp.date):'Belum ada data'}</div></div>
   <div class="card"><h3>Gula Darah</h3><div class="big">${gl?gl.glu:'–'}</div>${gl?badge(Health.glu(gl.glu,gl.gctx)):''}<div class="mut">mg/dL</div></div>
   <div class="card"><h3>Detak Jantung</h3><div class="big">${hr?hr.hr:'–'}</div>${hr?badge(Health.hr(hr.hr)):''}<div class="mut">bpm</div></div>
   <div class="card"><h3>Obat Hari Ini</h3><div class="big">${ad===null?'–':Math.round(ad*100)+'%'}</div><div class="bar"><i style="width:${(ad||0)*100}%"></i></div><div class="mut">${ad===null?'Belum ada obat':'kepatuhan'}</div></div>
   <div class="card"><h3>Janji Berikutnya</h3>${next?`<b>${esc(next.dokter)}</b><div class="mut">${fmtD(next.tgl)} • ${next.jam}<br>${daysTo(next.tgl)===0?'Hari ini':daysTo(next.tgl)+' hari lagi'}</div>`:'<div class="mut">Tidak ada janji</div>'}</div>
  </div>
  <div class="grid g2" style="margin-top:16px">
   <div class="card"><h3>Tren Tekanan Darah</h3><canvas id="c1"></canvas></div>
   <div class="card"><h3>Tren Tidur & Mood (7 hari)</h3><canvas id="c2"></canvas></div>
  </div>
  <div class="card"><h3>Aksi Cepat</h3><div class="chips">${['symptom:Cek Gejala','vitals:Catat Vital','meds:Obat','chat:Tanya AI','emergency:Darurat'].map(x=>{const[a,b]=x.split(':');return`<a class="chip" href="#${a}">${ic(Modules[a].i,15)} ${b}</a>`}).join('')}</div></div>`;
  const v=d.vitals.filter(x=>x.sys).slice(-14),j=d.journal.slice(-7);
  lineChart($('#c1',el),[{label:'Sistolik',color:'#dc2626',data:v.map(x=>({x:ts(x.date,x.time),y:x.sys}))},{label:'Diastolik',color:'#0d9488',data:v.map(x=>({x:ts(x.date,x.time),y:x.dia}))}]);
  lineChart($('#c2',el),[{label:'Tidur (jam)',color:'#6366f1',data:j.map(x=>({x:ts(x.tgl),y:+x.tidur}))},{label:'Mood (1-5)',color:'#f59e0b',data:j.map(x=>({x:ts(x.tgl),y:+x.mood}))}]);
}};
