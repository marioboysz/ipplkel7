Modules.appts={t:'Janji Dokter',i:'calendar',
r(el){const M=this,A=Store.d.appts.slice().sort((a,b)=>(a.tgl+a.jam).localeCompare(b.tgl+b.jam)),up=A.filter(a=>!a.selesai&&daysTo(a.tgl)>=0),past=A.filter(a=>!up.includes(a)).reverse();
 const row=a=>`<div class="item"><div><b>${esc(a.dokter)}</b> <span class="badge gray">${esc(a.spes||'Umum')}</span><div class="mut">${fmtD(a.tgl)} • ${a.jam} • ${esc(a.lokasi||'-')}</div>${a.cat?`<div>${esc(a.cat)}</div>`:''}</div>
  ${!a.selesai&&daysTo(a.tgl)>=0?`<span class="badge ${daysTo(a.tgl)<=1?'warn':'ok'}">${daysTo(a.tgl)?daysTo(a.tgl)+' hari':'Hari ini'}</span><button class="btn sm" data-s="${a.id}">Selesai</button>`:'<span class="badge gray">Lewat/Selesai</span>'}<button class="x" data-d="${a.id}">${ic('x',16)}</button></div>`;
 el.innerHTML=`<div class="card"><h3>Buat Janji Baru</h3><form id="f"><div class="row"><label>Nama dokter<input name="dokter" required></label><label>Spesialis<select name="spes">${['Umum','Penyakit Dalam','Anak','Jantung','Kulit','THT','Mata','Gigi','Saraf','Kandungan','Ortopedi','Psikiater'].map(x=>`<option>${x}</option>`).join('')}</select></label>
 <label>Tanggal<input type="date" name="tgl" min="${today()}" required></label><label>Jam<input type="time" name="jam" required></label></div><label>Lokasi / RS<input name="lokasi"></label><label>Catatan / keluhan<input name="cat"></label><button class="btn">Simpan Janji</button></form></div>
 <div class="card"><h3>Akan Datang (${up.length})</h3>${up.map(row).join('')||'<p class="mut">Tidak ada</p>'}</div><div class="card"><h3>Riwayat</h3>${past.map(row).join('')||'<p class="mut">Kosong</p>'}</div>`;
 $('#f',el).onsubmit=e=>{e.preventDefault();Store.add('appts',fd(e.target));toast('Janji tersimpan');M.r(el)};
 $$('[data-s]',el).forEach(b=>b.onclick=()=>{Store.d.appts.find(a=>a.id===b.dataset.s).selesai=1;Store.save();M.r(el)});
 $$('[data-d]',el).forEach(b=>b.onclick=()=>{Store.del('appts',b.dataset.d);M.r(el)})}};
