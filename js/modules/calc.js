Modules.calc={t:'Kalkulator Kesehatan',i:'calculator',
r(el){const p=Store.d.profile;
 el.innerHTML=`<div class="card"><h3>Data Anda</h3><form id="f"><div class="row"><label>Umur<input type="number" name="umur" value="${p.umur}"></label><label>Jenis kelamin<select name="jk"><option value="L" ${p.jk==='L'?'selected':''}>Laki-laki</option><option value="P" ${p.jk==='P'?'selected':''}>Perempuan</option></select></label>
 <label>Tinggi (cm)<input type="number" name="tinggi" value="${p.tinggi}"></label><label>Berat (kg)<input type="number" step=".1" name="berat" value="${p.berat}"></label>
 <label>Aktivitas<select name="akt"><option value="1.2">Jarang olahraga</option><option value="1.375">1–3x/minggu</option><option value="1.55" selected>3–5x/minggu</option><option value="1.725">6–7x/minggu</option></select></label>
 <label>Tujuan<select name="tj"><option value="-500">Turun berat</option><option value="0" selected>Pertahankan</option><option value="400">Naik berat</option></select></label></div><button class="btn">Hitung</button></form></div><div id="out"></div>`;
 const run=()=>{const f=fd($('#f',el)),u=+f.umur,H=+f.tinggi,W=+f.berat,L=f.jk==='L',bmi=W/((H/100)**2),st=Health.bmi(bmi);
  const bmr=10*W+6.25*H-5*u+(L?5:-161),tdee=bmr*f.akt,kal=Math.round(tdee+ +f.tj),ib=(L?50:45.5)+0.9*(H-152),mx=220-u;
  const pos=Math.min(100,Math.max(0,(bmi-15)/25*100));
  $('#out',el).innerHTML=`<div class="grid"><div class="card"><h3>BMI</h3><div class="big">${bmi.toFixed(1)}</div>${badge(st)}<div class="bar" style="margin-top:10px"><i style="width:${pos}%"></i></div><div class="mut">Skala Asia-Pasifik</div></div>
  <div class="card"><h3>BMR</h3><div class="big">${Math.round(bmr)}</div><div class="mut">kkal/hari saat istirahat</div></div>
  <div class="card"><h3>Kebutuhan Kalori</h3><div class="big">${kal}</div><div class="mut">kkal/hari (TDEE ${Math.round(tdee)})</div></div>
  <div class="card"><h3>Berat Ideal</h3><div class="big">${ib.toFixed(1)} kg</div><div class="mut">Rumus Devine</div></div>
  <div class="card"><h3>Kebutuhan Air</h3><div class="big">${(W*0.035).toFixed(1)} L</div><div class="mut">≈ ${Math.round(W*0.035/0.25)} gelas/hari</div></div>
  <div class="card"><h3>Makronutrien</h3><div>Karbo: <b>${Math.round(kal*.5/4)} g</b></div><div>Protein: <b>${Math.round(kal*.2/4)} g</b></div><div>Lemak: <b>${Math.round(kal*.3/9)} g</b></div></div></div>
  <div class="card"><h3>Zona Detak Jantung (maks ${mx} bpm)</h3><table><tr><th>Zona</th><th>Rentang</th></tr>${[['Pemanasan',.5,.6],['Pembakaran lemak',.6,.7],['Kardio',.7,.8],['Performa',.8,.9]].map(z=>`<tr><td>${z[0]}</td><td>${Math.round(mx*z[1])}–${Math.round(mx*z[2])} bpm</td></tr>`).join('')}</table></div>`};
 $('#f',el).onsubmit=e=>{e.preventDefault();run()};run()}};
