const App={
  order:['dashboard','symptom','vitals','meds','appts','records','calc','journal','chat','emergency'],
  cur:null,
  async init(){
    if(!await Store.load())return;document.documentElement.dataset.theme=Store.d.theme;
    $$('[data-ic]').forEach(e=>e.innerHTML=ic(e.dataset.ic,+e.dataset.s||18));$('#lg').innerHTML=ic('shield',24);
    $('#usr').innerHTML=ic('user',16)+' '+esc(Store.user.nama);
    $('#out').onclick=async()=>{await Store.flush();await fetch('api/auth.php?a=logout',{method:'POST'});location.href='login.html'};
    addEventListener('beforeunload',()=>Store.flush());
    $('#nav').innerHTML=this.order.map(k=>`<a href="#${k}" data-k="${k}">${ic(Modules[k].i)} ${Modules[k].t}</a>`).join('');
    $('#theme').onclick=()=>{Store.d.theme=Store.d.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=Store.d.theme;Store.save();this.render()};
    $('#exp').onclick=()=>Store.export();$('#imp').onchange=e=>e.target.files[0]&&Store.import(e.target.files[0]);
    $('#menu').onclick=()=>$('#side').classList.toggle('open');
    $('#nav').onclick=()=>$('#side').classList.remove('open');
    addEventListener('hashchange',()=>this.render());addEventListener('resize',()=>this.cur==='dashboard'&&this.render());
    const clk=()=>$('#clock').textContent=new Date().toLocaleString('id-ID',{weekday:'long',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'});
    clk();setInterval(clk,15000);setInterval(()=>Modules.meds.tick(),20000);
    this.render();
  },
  render(){
    const k=Modules[location.hash.slice(1)]?location.hash.slice(1):'dashboard';this.cur=k;
    clearInterval(Modules.journal.tm);Modules.journal.tm=null;
    $$('#nav a').forEach(a=>a.classList.toggle('on',a.dataset.k===k));
    $('#title').innerHTML=ic(Modules[k].i,20)+' '+Modules[k].t;
    Modules[k].r($('#view'));scrollTo(0,0);
  }
};
App.init();
