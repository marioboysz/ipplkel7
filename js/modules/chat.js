Modules.chat={t:'Asisten AI Kesehatan',i:'bot',
R:[
 [/^(hai|halo|hi|hello|selamat)/i,()=>'Halo! Saya asisten SehatIQ. Tanyakan soal gejala, gaya hidup sehat, atau data kesehatan Anda (mis. "BMI saya", "tekanan darah saya", "jadwal obat").'],
 [/bmi|indeks massa/i,()=>{const p=Store.d.profile,b=Health.calcBmi(p);return`BMI Anda ${b.toFixed(1)} (${Health.bmi(b).l}). Rentang normal Asia-Pasifik: 18,5–22,9.`}],
 [/(tekanan darah|tensi).*(saya|ku|terakhir)/i,()=>{const v=Health.last('sys');return v?`Tekanan darah terakhir ${v.sys}/${v.dia} mmHg (${Health.bp(v.sys,v.dia).l}) pada ${fmtD(v.date)}.`:'Belum ada data tekanan darah. Catat di menu Tanda Vital.'}],
 [/(gula|glukosa).*(saya|ku|terakhir)/i,()=>{const v=Health.last('glu');return v?`Gula darah terakhir ${v.glu} mg/dL (${Health.glu(v.glu,v.gctx).l}).`:'Belum ada data gula darah.'}],
 [/(jadwal|obat).*(saya|hari ini)|obat saya/i,()=>{const L=Modules.meds.today();return L.length?'Jadwal obat hari ini:\n'+L.map(x=>`${x.done?'[selesai]':'[belum]'} ${x.j} ${x.m.nama}`).join('\n'):'Belum ada jadwal obat.'}],
 [/skor/i,()=>`Skor kesehatan Anda saat ini ${Health.score()}/100.`],
 [/tekanan darah|tensi|hipertensi|darah tinggi/i,()=>'Tekanan darah normal < 120/80 mmHg. ≥ 140/90 termasuk hipertensi. Kurangi garam, olahraga teratur, jaga berat badan, dan kontrol rutin. Bila ≥ 180/120 dengan gejala, segera ke IGD.'],
 [/diabetes|gula darah|kencing manis/i,()=>'Gula darah puasa normal 70–99 mg/dL; 100–125 prediabetes; ≥126 diabetes. Batasi gula, perbanyak serat, olahraga rutin, dan periksa HbA1c berkala.'],
 [/demam|panas/i,()=>'Untuk demam: istirahat, minum banyak cairan, kompres hangat, parasetamol sesuai dosis. Ke dokter bila > 3 hari, suhu ≥ 39°C, kejang, atau ada bintik merah/perdarahan (waspada DBD).'],
 [/batuk|pilek|flu/i,()=>'Batuk/pilek biasanya virus: istirahat, minum hangat, madu (bukan untuk bayi < 1 tahun). Periksa bila > 7 hari, sesak, atau demam tinggi.'],
 [/sakit kepala|pusing|migrain/i,()=>'Sakit kepala: cukupkan cairan & tidur, kurangi layar, istirahat tenang. Segera ke IGD bila mendadak sangat hebat, disertai lemah satu sisi, bicara pelo, atau kejang.'],
 [/diare|mencret/i,()=>'Diare: ganti cairan dengan oralit, makan bertahap. Ke dokter bila > 2 hari, ada darah, atau tanda dehidrasi (mulut kering, jarang BAK).'],
 [/maag|asam lambung|gerd/i,()=>'Maag: makan teratur porsi kecil, hindari kopi, pedas, asam, dan rokok; jangan langsung berbaring setelah makan.'],
 [/diet|menurunkan berat|kurus|gemuk/i,()=>'Turun berat sehat: defisit ±500 kkal/hari, protein cukup, sayur banyak, kurangi minuman manis, olahraga 150 menit/minggu. Hitung kebutuhan di menu Kalkulator.'],
 [/tidur|insomnia/i,()=>'Tips tidur: jadwal konsisten, hindari kafein sore, matikan layar 1 jam sebelum tidur, kamar gelap & sejuk.'],
 [/stres|cemas|depresi|sedih/i,()=>'Coba latihan napas di menu Jurnal, olahraga ringan, dan bicara dengan orang terpercaya. Bila berlangsung lama atau mengganggu aktivitas, temui psikolog/psikiater. Jika ada keinginan menyakiti diri, segera hubungi 119 (ext. 8) atau layanan darurat.'],
 [/olahraga|latihan/i,()=>'Target WHO: 150 menit aktivitas sedang per minggu + latihan kekuatan 2x/minggu. Mulai bertahap.'],
 [/air|minum/i,()=>'Kebutuhan air ±35 ml/kg berat badan per hari. Lihat kalkulator untuk angka personal Anda.'],
 [/covid|corona/i,()=>'Bila bergejala: pakai masker, tes antigen/PCR, isolasi. Segera ke faskes bila sesak atau saturasi < 95%.'],
 [/darurat|ambulans|pingsan|serangan jantung|stroke/i,()=>'Hubungi 119 / 112 sekarang. Buka menu Darurat untuk panduan P3K, CPR, dan tanda stroke (FAST).'],
 [/terima kasih|makasih|thanks/i,()=>'Sama-sama! Tetap sehat '],
],
reply(t){for(const[r,f]of this.R)if(r.test(t))return f();return'Maaf, saya belum paham. Coba gunakan menu "Cek Gejala" untuk analisis gejala, atau tanyakan seputar demam, batuk, tekanan darah, diabetes, diet, tidur, stres, atau olahraga.'},
r(el){const M=this,C=Store.d.chat;if(!C.length)C.push({r:'b',t:M.reply('halo')});
 el.innerHTML=`<div class="card"><div class="chat" id="ch">${C.map(m=>`<div class="msg ${m.r}">${esc(m.t)}</div>`).join('')}</div>
 <div class="chips" style="margin:10px 0">${['BMI saya','Skor kesehatan saya','Tips tidur','Apa itu hipertensi?','Jadwal obat saya','Cara diet sehat'].map(q=>`<span class="chip" data-q="${q}">${q}</span>`).join('')}</div>
 <form id="f" style="display:flex;gap:8px"><input id="i" placeholder="Tulis pertanyaan kesehatan..." autocomplete="off"><button class="btn">Kirim</button></form> <button class="btn alt sm" id="cl" style="margin-top:8px;color:var(--tx)">Hapus riwayat</button></div>`;
 const send=t=>{if(!t.trim())return;C.push({r:'u',t});C.push({r:'b',t:M.reply(t)});if(C.length>60)C.splice(0,2);Store.save();M.r(el)};
 $('#f',el).onsubmit=e=>{e.preventDefault();send($('#i',el).value)};
 $$('[data-q]',el).forEach(c=>c.onclick=()=>send(c.dataset.q));
 $('#cl',el).onclick=()=>{Store.d.chat=[];Store.save();M.r(el)};
 const ch=$('#ch',el);ch.scrollTop=ch.scrollHeight;$('#i',el).focus()}};
