const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>{const d=new Date();return new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)};
const nowT=()=>new Date().toTimeString().slice(0,5);
const fmtD=d=>d?new Date(d+'T00:00').toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}):'-';
const daysTo=d=>Math.round((new Date(d+'T00:00')-new Date(today()+'T00:00'))/864e5);
const fd=f=>Object.fromEntries(new FormData(f));
const num=v=>v===''||v==null?undefined:+v;
const badge=b=>`<span class="badge ${b.c}">${b.l}</span>`;
function toast(m,t=4000){const x=document.createElement('div');x.className='tt';x.textContent=m;$('#toast').appendChild(x);setTimeout(()=>x.remove(),t)}

const COLS=['vitals','meds','appts','records','journal'];
const Store={
  d:null,snap:null,tm:null,user:null,
  def(){return{profile:{nama:'',umur:25,jk:'L',tinggi:170,berat:65,gol:'O',alergi:'',kondisi:'',kontak:'',telp:''},vitals:[],meds:[],medLog:{},appts:[],records:[],journal:[],chat:[],theme:'light'}},
  async load(){
    try{const r=await fetch('api/load.php',{credentials:'same-origin'});
      if(r.status===401){location.href='login.html';return false}
      const j=await r.json();if(j.error)throw 0;
      this.user=j.user;delete j.user;this.d=Object.assign(this.def(),j);this.snapshot();return true}
    catch(e){document.body.innerHTML='<div class="card" style="margin:40px auto;max-width:480px"><h3>Server tidak terjangkau</h3><p>Pastikan Apache &amp; MySQL XAMPP aktif, database.sql sudah diimpor, dan buka lewat <b>http://localhost/sehatiq/</b></p></div>';return false}},
  snapshot(){const d=this.d;this.snap={prof:JSON.stringify(d.profile),theme:d.theme,chat:JSON.stringify(d.chat),log:Object.keys(d.medLog)};
    COLS.forEach(c=>this.snap[c]=Object.fromEntries(d[c].map(x=>[x.id,JSON.stringify(x)])))},
  save(){clearTimeout(this.tm);this.tm=setTimeout(()=>this.flush(),300)},
  async flush(){clearTimeout(this.tm);const d=this.d,s=this.snap,p={up:{},del:{}};let n=0;
    COLS.forEach(c=>{const cur=new Set(d[c].map(x=>x.id));p.up[c]=d[c].filter(x=>s[c][x.id]!==JSON.stringify(x));p.del[c]=Object.keys(s[c]).filter(i=>!cur.has(i));n+=p.up[c].length+p.del[c].length});
    if(JSON.stringify(d.profile)!==s.prof){p.profile=d.profile;n++}
    if(d.theme!==s.theme){p.theme=d.theme;n++}
    if(JSON.stringify(d.chat)!==s.chat){p.chat=d.chat;n++}
    const lk=Object.keys(d.medLog),set=lk.filter(k=>!s.log.includes(k)),unset=s.log.filter(k=>!lk.includes(k));
    if(set.length||unset.length){p.log={set,unset};n++}
    if(!n)return;this.snapshot();
    try{const r=await fetch('api/sync.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p),keepalive:true});
      if(r.status===401)return location.href='login.html';if(!r.ok)throw 0}
    catch(e){toast('Gagal menyimpan ke server. Periksa koneksi/XAMPP.')}},
  add(c,o){o.id=Date.now().toString(36)+Math.random().toString(36).slice(2,5);this.d[c].push(o);this.save();return o},
  del(c,id){this.d[c]=this.d[c].filter(x=>x.id!==id);this.save()},
  export(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(this.d,null,2)],{type:'application/json'}));a.download=`sehatiq-backup-${today()}.json`;a.click()},
  import(file){const r=new FileReader();r.onload=()=>{try{this.d=Object.assign(this.def(),JSON.parse(r.result));this.save();toast('Data diimpor & disimpan ke database');App.render()}catch(e){toast('File tidak valid')}};r.readAsText(file)}
};

const B=(l,c)=>({l,c});
const Health={
  bp(s,d){if(s>=180||d>=120)return B('Krisis hipertensi','bad');if(s>=140||d>=90)return B('Hipertensi tahap 2','bad');if(s>=130||d>=80)return B('Hipertensi tahap 1','warn');if(s>=120)return B('Meningkat','warn');if(s<90||d<60)return B('Rendah','warn');return B('Normal','ok')},
  glu(v,c){if(c==='puasa')return v<70?B('Rendah','bad'):v<100?B('Normal','ok'):v<126?B('Prediabetes','warn'):B('Tinggi (diabetes)','bad');return v<70?B('Rendah','bad'):v<140?B('Normal','ok'):v<200?B('Prediabetes','warn'):B('Tinggi','bad')},
  hr(v){return v<60?B('Rendah','warn'):v<=100?B('Normal','ok'):B('Tinggi','warn')},
  temp(v){return v<36?B('Rendah','warn'):v<=37.5?B('Normal','ok'):v<=38?B('Subfebris','warn'):B('Demam','bad')},
  spo2(v){return v>=95?B('Normal','ok'):v>=90?B('Rendah','warn'):B('Bahaya','bad')},
  bmi(v){return v<18.5?B('Kurus','warn'):v<23?B('Normal','ok'):v<25?B('Berat lebih','warn'):v<30?B('Obesitas I','bad'):B('Obesitas II','bad')},
  calcBmi(p){const m=p.tinggi/100;return p.berat/(m*m)},
  last(k){const a=Store.d.vitals.filter(x=>x[k]!==undefined);return a[a.length-1]},
  score(){let s=0,m=0;const A=(p,x)=>{s+=p;m+=x},P=Store.d.profile;
    const b=this.bmi(this.calcBmi(P)).c;A(b==='ok'?25:b==='warn'?15:5,25);
    const bp=this.last('sys');if(bp){const c=this.bp(bp.sys,bp.dia).c;A(c==='ok'?25:c==='warn'?14:3,25)}
    const g=this.last('glu');if(g){const c=this.glu(g.glu,g.gctx).c;A(c==='ok'?20:c==='warn'?10:2,20)}
    const j=Store.d.journal.slice(-7);if(j.length){const sl=j.reduce((a,x)=>a+(+x.tidur||0),0)/j.length;A(sl>=7&&sl<=9?15:sl>=6?9:4,15)}
    const ad=Modules.meds.adh();if(ad!==null)A(Math.round(ad*15),15);
    return Math.round(s/m*100)}
};
