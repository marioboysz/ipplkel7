Modules.emergency={t:'Darurat & P3K',i:'siren',
r(el){const p=Store.d.profile;
 el.innerHTML=`<div class="alert bad"><b>Kondisi darurat?</b> Hubungi <a href="tel:119"><b>119</b></a> (ambulans/gawat darurat) atau <a href="tel:112"><b>112</b></a> sekarang.</div>
 <div class="grid">${[['112','Darurat umum'],['119','Ambulans / Gawat darurat'],['110','Polisi'],['113','Pemadam kebakaran'],['115','Basarnas (SAR)'],['1500-567','Halo Kemenkes']].map(([n,l])=>`<a class="card" href="tel:${n.replace('-','')}" style="text-decoration:none;color:inherit;text-align:center"><div class="big" style="color:var(--bad)">${n}</div>${l}</a>`).join('')}</div>
 <div class="card" style="margin-top:16px"><h3>${ic('idcard')} Kartu Medis Darurat</h3><table><tr><th>Nama</th><td>${esc(p.nama)||'-'}</td><th>Umur</th><td>${p.umur}</td></tr><tr><th>Gol. darah</th><td>${p.gol}</td><th>Alergi</th><td>${esc(p.alergi)||'-'}</td></tr><tr><th>Kondisi kronis</th><td>${esc(p.kondisi)||'-'}</td><th>Kontak darurat</th><td>${esc(p.kontak)||'-'} ${esc(p.telp)}</td></tr></table>
 <p><a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/rumah+sakit+terdekat">${ic('pin')} Cari RS terdekat</a> <button class="btn alt noprint" onclick="window.print()">${ic('printer')} Cetak</button></p></div>
 <h3>Panduan P3K</h3>
 ${[['heart','Henti jantung / CPR','1) Pastikan aman & panggil 119. 2) Cek respons & napas. 3) Tekan dada di tengah tulang dada, kedalaman 5–6 cm, kecepatan 100–120/menit. 4) Gunakan AED bila ada. 5) Lanjutkan sampai bantuan tiba.'],
 ['activity','Stroke (FAST)','Face: wajah miring. Arm: lengan lemah. Speech: bicara pelo. Time: segera 119. Catat waktu mulai gejala; jangan beri makan/minum.'],
 ['droplet','Perdarahan','Tekan luka dengan kain bersih terus-menerus, tinggikan bagian yang berdarah. Jangan lepas kain yang sudah basah, tambahkan lapisan. Ke IGD bila deras.'],
 ['flame','Luka bakar','Alirkan air mengalir (bukan es) 10–20 menit, lepas perhiasan, tutup kain bersih. Jangan oles odol/mentega. Ke RS bila luas, wajah, atau sendi.'],
 ['wind','Tersedak (Heimlich)','Dewasa sadar: 5 tepukan punggung lalu 5 hentakan perut di atas pusar, ulangi. Bayi: tepuk punggung & tekan dada, bukan perut.'],
 ['user','Pingsan','Baringkan, tinggikan kaki 30 cm, longgarkan pakaian, pastikan napas. Bila tidak sadar > 1 menit, hubungi 119.'],
 ['alert','Patah tulang','Jangan luruskan paksa. Imobilisasi dengan bidai, kompres dingin berbalut kain, ke IGD.'],
 ['alert','Gigitan ular','Tenang, imobilisasi anggota gerak, posisi di bawah jantung. Jangan sayat/hisap/torniket ketat. Segera ke RS.'],
 ['alert','Keracunan','Hubungi 119. Jangan paksa muntah. Bawa kemasan zat penyebab ke RS.']].map(([i,a,b])=>`<details><summary>${ic(i,16)} ${a}</summary><p>${b}</p></details>`).join('')}`}};
