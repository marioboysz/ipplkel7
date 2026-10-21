Modules.symptom={t:'Cek Gejala',i:'stethoscope',
S:{demam:'Demam',menggigil:'Menggigil',batuk:'Batuk',pilek:'Pilek / hidung tersumbat',bersin:'Bersin-bersin',tenggorokan:'Sakit tenggorokan',kepala:'Sakit kepala',pusing:'Pusing',mual:'Mual',muntah:'Muntah',diare:'Diare',perut:'Nyeri perut',ulu:'Nyeri ulu hati / perih',kembung:'Kembung',sesak:'Sesak napas',dada:'Nyeri dada',otot:'Nyeri otot / pegal',lemas:'Lemas / lelah',pucat:'Wajah pucat',ruam:'Ruam kulit',gatal:'Gatal',sendi:'Nyeri sendi',mata:'Nyeri di belakang mata',darah:'Mimisan / gusi berdarah',haus:'Sering haus',bak:'Sering buang air kecil',nyeribak:'Nyeri saat buang air kecil',bb:'Berat badan turun',kabur:'Penglihatan kabur',penciuman:'Hilang penciuman / perasa',debar:'Jantung berdebar',cahaya:'Sensitif cahaya / suara',baal:'Lemah / mati rasa satu sisi tubuh',pelo:'Bicara pelo / sulit bicara',bingung:'Kebingungan / hampir pingsan'},
C:[
 ['Common Cold (Pilek Biasa)','pilek:3,bersin:2,tenggorokan:2,batuk:2,demam:1,kepala:1',0,'Istirahat, banyak minum hangat, vitamin C. Biasanya membaik 5–7 hari.'],
 ['Influenza','demam:3,otot:3,lemas:2,batuk:2,kepala:2,menggigil:2,tenggorokan:1,pilek:1',1,'Istirahat cukup, cairan, parasetamol sesuai aturan. Periksa bila memburuk > 3 hari.'],
 ['COVID-19','demam:2,batuk:2,penciuman:4,lemas:2,tenggorokan:1,sesak:2,otot:1',1,'Lakukan tes antigen/PCR, pakai masker, dan isolasi mandiri sampai hasil jelas.'],
 ['Demam Berdarah (DBD)','demam:3,mata:3,darah:3,otot:2,kepala:2,mual:2,ruam:2,sendi:2,lemas:1',2,'Segera cek darah (trombosit). Perbanyak minum. Waspada hari ke-3–5 demam.'],
 ['Demam Tifoid','demam:3,perut:3,kepala:2,lemas:2,mual:2,diare:1,muntah:1',2,'Perlu pemeriksaan laboratorium dan antibiotik dari dokter.'],
 ['Gastritis (Maag)','ulu:4,mual:3,kembung:3,muntah:1,perut:2',1,'Makan teratur porsi kecil, hindari pedas/kopi/asam, konsultasi dokter bila berulang.'],
 ['Gastroenteritis','diare:4,muntah:3,perut:3,mual:3,demam:1,lemas:1',1,'Minum oralit untuk cegah dehidrasi. Ke dokter bila diare > 2 hari atau ada darah.'],
 ['Migrain','kepala:4,cahaya:3,mual:3,muntah:1,pusing:1',1,'Istirahat di ruang gelap & tenang, hindari pemicu. Konsultasi bila sering.'],
 ['Gejala Diabetes','haus:3,bak:3,bb:3,lemas:2,kabur:2,gatal:1',1,'Periksa gula darah puasa dan HbA1c ke fasilitas kesehatan.'],
 ['Infeksi Saluran Kemih','nyeribak:4,bak:2,perut:1,demam:1',1,'Perbanyak minum air putih; perlu pemeriksaan urin dan terapi dokter.'],
 ['Alergi','bersin:3,gatal:3,ruam:3,mata:1,pilek:2',0,'Hindari pemicu alergi; antihistamin atas anjuran apoteker/dokter.'],
 ['Anemia','lemas:3,pucat:3,pusing:3,debar:2,sesak:1',1,'Cek hemoglobin. Konsumsi makanan kaya zat besi.'],
 ['Tekanan Darah Tinggi','kepala:2,pusing:2,kabur:2,debar:2',1,'Ukur tekanan darah segera dan catat di menu Tanda Vital.']],
RF:{dada:'Nyeri dada → kemungkinan masalah jantung',sesak:'Sesak napas → gangguan napas/jantung',baal:'Lemah satu sisi tubuh → kemungkinan STROKE',pelo:'Bicara pelo → kemungkinan STROKE',bingung:'Kebingungan/hampir pingsan → kondisi serius'},
sel:new Set(),
r(el){const M=this;
 el.innerHTML=`<div class="card"><h3>Pilih gejala yang Anda alami</h3><div class="chips" id="ch">${Object.entries(M.S).map(([k,v])=>`<span class="chip ${M.sel.has(k)?'on':''}" data-k="${k}">${v}</span>`).join('')}</div>
 <div class="row" style="margin-top:14px"><label>Sudah berapa hari?<input type="number" id="hari" min="0" value="1"></label><label>Tingkat keparahan<select id="par"><option>Ringan</option><option>Sedang</option><option>Berat</option></select></label></div>
 <button class="btn" id="go">Analisis Gejala</button> <button class="btn alt" id="rs">Reset</button></div><div id="res"></div>`;
 $('#ch',el).onclick=e=>{const k=e.target.dataset.k;if(!k)return;M.sel.has(k)?M.sel.delete(k):M.sel.add(k);e.target.classList.toggle('on')};
 $('#rs',el).onclick=()=>{M.sel.clear();M.r(el)};
 $('#go',el).onclick=()=>M.analyze(el);},
analyze(el){const M=this,s=[...M.sel],hari=+$('#hari',el).value,par=$('#par',el).value;
 if(!s.length)return toast('Pilih minimal satu gejala');
 let h='';const rf=s.filter(k=>M.RF[k]);
 if(rf.length||par==='Berat')h+=`<div class="alert bad"><b>${ic('alert')} PERHATIAN: tanda bahaya terdeteksi</b><br>${rf.map(k=>'• '+M.RF[k]).join('<br>')}${par==='Berat'&&!rf.length?'• Keparahan berat':''}<br><b>Segera hubungi 119 / 112 atau ke IGD terdekat.</b></div>`;
 const res=M.C.map(([n,w,u,tip])=>{const W=Object.fromEntries(w.split(',').map(x=>x.split(':'))),tot=Object.values(W).reduce((a,b)=>a+ +b,0);
   const hit=s.filter(k=>W[k]),m=hit.reduce((a,k)=>a+ +W[k],0);
   return{n,u,tip,hit,sc:hit.length?(m/tot)*.6+(hit.length/s.length)*.4:0}}).filter(x=>x.sc>.2).sort((a,b)=>b.sc-a.sc).slice(0,4);
 h+=`<div class="card"><h3>Kemungkinan Kondisi</h3>${res.length?res.map(x=>`<div class="item"><div><b>${x.n}</b> ${badge(x.u===2?B('Perlu segera diperiksa','bad'):x.u===1?B('Konsultasi dokter','warn'):B('Perawatan mandiri','ok'))}<div class="bar" style="margin:6px 0"><i style="width:${Math.round(x.sc*100)}%"></i></div><div class="mut">Kecocokan ${Math.round(x.sc*100)}% • gejala cocok: ${x.hit.map(k=>M.S[k]).join(', ')}</div><div>${ic('bulb')} ${x.tip}</div></div></div>`).join(''):'<p>Gejala belum cukup spesifik. Tambahkan gejala lain atau konsultasi dokter.</p>'}</div>`;
 if(hari>7)h+=`<div class="alert warn">Gejala > 7 hari. Sebaiknya periksakan ke dokter.</div>`;
 h+=`<button class="btn alt" id="sv">${ic('save')} Simpan ke Rekam Medis</button><p class="mut">Hasil ini perkiraan berbasis aturan sederhana, bukan diagnosis medis.</p>`;
 $('#res',el).innerHTML=h;
 $('#sv',el).onclick=()=>{Store.add('records',{tipe:'Cek Gejala',judul:res[0]?res[0].n:'Cek gejala',tgl:today(),catatan:'Gejala: '+s.map(k=>M.S[k]).join(', ')+` (${hari} hari, ${par})`,faskes:''});toast('Tersimpan ke rekam medis')};
 $('#res',el).scrollIntoView({behavior:'smooth'})}};
