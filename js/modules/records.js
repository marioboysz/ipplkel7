Modules.records={t:'Profil & Rekam Medis',i:'clipboard',flt:'Semua',q:'',
r(el){const M=this,d=Store.d,p=d.profile,T=['Diagnosis','Alergi','Vaksin','Lab','Operasi','Resep','Cek Gejala','Lainnya'];
 const R=d.records.filter(x=>(M.flt==='Semua'||x.tipe===M.flt)&&(x.judul+x.catatan).toLowerCase().includes(M.q)).sort((a,b)=>b.tgl.localeCompare(a.tgl));
 el.innerHTML=`<div class="grid g2"><div class="card"><h3>Profil Kesehatan</h3><form id="pf"><div class="row"><label>Nama<input name="nama" value="${esc(p.nama)}"></label><label>Umur<input type="number" name="umur" value="${p.umur}"></label>
 <label>Jenis kelamin<select name="jk"><option value="L" ${p.jk==='L'?'selected':''}>Laki-laki</option><option value="P" ${p.jk==='P'?'selected':''}>Perempuan</option></select></label>
 <label>Tinggi (cm)<input type="number" name="tinggi" value="${p.tinggi}"></label><label>Berat (kg)<input type="number" step=".1" name="berat" value="${p.berat}"></label>
 <label>Gol. darah<select name="gol">${['A','B','AB','O'].map(g=>`<option ${p.gol===g?'selected':''}>${g}</option>`).join('')}</select></label></div>
 <label>Alergi<input name="alergi" value="${esc(p.alergi)}"></label><label>Kondisi kronis<input name="kondisi" value="${esc(p.kondisi)}"></label>
 <div class="row"><label>Kontak darurat<input name="kontak" value="${esc(p.kontak)}"></label><label>No. telepon<input name="telp" value="${esc(p.telp)}"></label></div><button class="btn">Simpan Profil</button></form></div>
 <div class="card"><h3>Tambah Catatan Medis</h3><form id="rf"><div class="row"><label>Jenis<select name="tipe">${T.map(t=>`<option>${t}</option>`).join('')}</select></label><label>Tanggal<input type="date" name="tgl" value="${today()}"></label></div>
 <label>Judul<input name="judul" required></label><label>Faskes / dokter<input name="faskes"></label><label>Catatan<textarea name="catatan" rows="3"></textarea></label><button class="btn">Tambah</button></form></div></div>
 <div class="card"><div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px"><input id="q" placeholder="Cari rekam medis..." value="${esc(M.q)}" style="flex:1;min-width:180px">${['Semua',...T].map(t=>`<span class="chip ${M.flt===t?'on':''}" data-f="${t}">${t}</span>`).join('')}</div>
 ${R.map(x=>`<div class="item"><div><b>${esc(x.judul)}</b> <span class="badge gray">${esc(x.tipe)}</span><div class="mut">${fmtD(x.tgl)} ${x.faskes?'• '+esc(x.faskes):''}</div><div>${esc(x.catatan)}</div></div><button class="x" data-d="${x.id}">${ic('x',16)}</button></div>`).join('')||'<p class="mut">Tidak ada catatan.</p>'}</div>
 <button class="btn alt noprint" onclick="window.print()">${ic('printer')} Cetak Rekam Medis</button>`;
 $('#pf',el).onsubmit=e=>{e.preventDefault();const f=fd(e.target);['umur','tinggi','berat'].forEach(k=>f[k]=+f[k]);Object.assign(Store.d.profile,f);Store.save();toast('Profil tersimpan')};
 $('#rf',el).onsubmit=e=>{e.preventDefault();Store.add('records',fd(e.target));M.r(el)};
 $('#q',el).oninput=e=>{M.q=e.target.value.toLowerCase();M.r(el);const i=$('#q',el);i.focus();i.setSelectionRange(99,99)};
 $$('[data-f]',el).forEach(c=>c.onclick=()=>{M.flt=c.dataset.f;M.r(el)});
 $$('[data-d]',el).forEach(b=>b.onclick=()=>{Store.del('records',b.dataset.d);M.r(el)})}};
